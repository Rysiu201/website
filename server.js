import express from 'express';
import session from 'express-session';
import passport from 'passport';
import { Strategy as DiscordStrategy } from 'passport-discord';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import fs from 'fs';
import config from './config.js';

dotenv.config();

// In-memory storage of question sets assigned to users
const userQuestions = new Map();

const STATUS = {
  SENT: 'Wysłane',
  PENDING: 'Przyjęte, oczekuje na rozpatrzenie',
  IN_REVIEW: 'W trakcie rozpatrywania',
  APPROVED: 'Rozpatrzone Pozytywnie',
  REJECTED: 'Rozpatrzone negatywnie (Napisz nowe podanie w ciągu 24/48h)'
};

// Configurable cooldown settings loaded from config.js
const {
  REAPPLY_COOLDOWN_HOURS,
  EXTRA_COOLDOWN_HOURS,
  REJECTION_HISTORY_WINDOW_HOURS,
  REJECTIONS_BEFORE_EXTRA_COOLDOWN
} = config;

const DB_FILE = path.join(process.cwd(), 'database.json');

function loadDb() {
  try {
    return JSON.parse(fs.readFileSync(DB_FILE, 'utf8'));
  } catch (err) {
    return { applications: [] };
  }
}

function saveDb(db) {
  fs.writeFileSync(DB_FILE, JSON.stringify(db, null, 2));
}

function computeReapplyAfter(history) {
  const rejections = (history || []).filter(h => h.status === STATUS.REJECTED);
  if (rejections.length === 0) return null;
  const last = rejections[rejections.length - 1];
  const recent = rejections.filter(
    r => last.timestamp - r.timestamp <= REJECTION_HISTORY_WINDOW_HOURS * 3600 * 1000
  );

  let cooldown = REAPPLY_COOLDOWN_HOURS;
  if (recent.length >= REJECTIONS_BEFORE_EXTRA_COOLDOWN) {
    cooldown += EXTRA_COOLDOWN_HOURS;
  }
  return last.timestamp + cooldown * 3600 * 1000;
}

// Pool of possible scenario questions
const allQuestions = [
  'Co zrobisz, jeśli zobaczysz gracza łamiącego zasady roleplayu (np. powergaming)?',
  'Jak zareagujesz, gdy Twój znajomy z OOC przekaże Ci informacje IC?',
  'Podaj przykład, jak prawidłowo użyć komendy /me w sytuacji przeszukania.',
  'Co wpiszesz w /do, gdy Twoja postać zostaje zatrzymana do kontroli przez policję?',
  'Twoja postać została postrzelona – jak odgrywasz taką sytuację IC?',
  'Co oznacza skrót NVL i jak rozumiesz jego zastosowanie?',
  'Gracz ucieka z miejsca zdarzenia po wypadku – jak powinieneś się zachować jako świadek?',
  'Jak wygląda różnica między IC a OOC i dlaczego ważne jest ich oddzielenie?',
  'Kto podejmuje decyzję w sytuacji konfliktowej – IC czy administracja OOC?',
  'Czy Twoja postać może wiedzieć, kto ją zabił, jeśli została zastrzelona z zaskoczenia? Uzasadnij.',
  'Gracz używa voice chatu, by przekazać coś spoza gry – jak powinieneś zareagować?',
  'Czy możesz napisać na czacie OOC "dlaczego mnie zabiłeś?"? Jeśli nie, to gdzie to zgłosić?',
  'Twoja postać traci przytomność – jakie działania podejmujesz jako gracz?',
  'Podaj przykład zachowania, które uznajesz za powergaming.',
  'Czy Twoja postać może znać lokalizację kogoś, kogo nie widziała od kilku dni? Wyjaśnij.',
  'Masz 3 osoby celujące do Ciebie z broni – co robisz i jak to odgrywasz?',
  'Czy możesz zmienić postać i kontynuować zemstę na kimś, kto zabił Twoją poprzednią? (nawiązanie do new life rule)',
  'Jakie są konsekwencje odgrywania scen, które są niezgodne z lore/realizmem serwera?',
  'Podaj przykład poprawnego odgrywania sceny handlu narkotykami.',
  'Czy masz obowiązek zapisać swoją postać po śmierci permanentnej? Co to oznacza?',
  'Czy Twoja postać może mieć wspomnienia po śmierci permanentnej?',
  'Jakie znasz zasady związane z porwaniami innych graczy?',
  'Czy można napaść na LSPD bez zaplanowanej akcji IC? Dlaczego tak/nie?',
  'Czy można wjechać na teren frakcji bez uzasadnienia IC?',
  'Podaj przykład metagamingu w rozmowie głosowej.',
  'Czy Twoja postać może wiedzieć, że ktoś handluje narkotykami, jeśli nikt jej tego nie powiedział IC?',
  'W jaki sposób zgłaszasz łamanie zasad, jeśli nie chcesz eskalować konfliktu?',
  'Podczas RP ktoś używa obraźliwego języka OOC – co robisz?',
  'Twoja postać jest świadkiem napadu – czy możesz to od razu zgłosić IC? Jak?',
  'Czy Twoja postać może znać cenę broni, jeśli nie była w sklepie IC?',
  'Podaj przykład łamania zasady Fail RP.',
  'Co oznacza skrót VDM?',
  'Czy Twoja postać może rozpoznać kogoś tylko po ubraniu i masce?',
  'Czy odgrywanie choroby psychicznej wymaga zgody administracji?',
  'Jakie zachowania są niedozwolone w scenach z udziałem medyków?',
  'Czy możesz rozłączyć się z gry w trakcie aresztowania? Co jeśli to przypadek?',
  'Masz 2 postacie – czy mogą się znać lub współpracować?',
  'Jakich działań nie wolno podejmować, by uniknąć konsekwencji IC?',
  'Czy możesz przywrócić swoją postać po permie, jeśli „umarła przypadkiem”?',
  'Co robisz, jeśli przez przypadek złamiesz zasadę, np. przypadkowy metagaming?',
  'Podaj przykład dobrze rozegranego napadu IC.',
  'W jaki sposób Twoja postać może poznać członka gangu?',
  'Czy możesz przeprowadzić transakcję bronią przy komendzie LSPD?',
  'Jak należy odgrywać użycie broni palnej w miejscu publicznym?',
  'Czy zemsta OOC na kimś IC jest dozwolona?',
  'Czy można stosować szantaż OOC? Jeśli nie – co robić, gdy się to zdarzy?',
  'Twoja postać została pobita, ale nie zgłosiła tego – czy może później się mścić IC?',
  'Czy każda postać musi mieć unikalną historię? Dlaczego?',
  'Jaki wpływ ma realność RP na immersję graczy?',
  'Czy możesz prowadzić grupę przestępczą bez zgody administracji?'
];

// Get the directory path of the current file
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 8080;

// Parse JSON bodies
app.use(express.json());

// Session and authentication setup
app.use(
  session({
    secret: process.env.SESSION_SECRET || 'keyboardcat',
    resave: false,
    saveUninitialized: false
  })
);

app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((obj, done) => {
  done(null, obj);
});

const discordEnabled =
  process.env.DISCORD_CLIENT_ID &&
  process.env.DISCORD_CLIENT_SECRET &&
  process.env.DISCORD_CALLBACK_URL;

if (discordEnabled) {
  passport.use(
    new DiscordStrategy(
      {
        clientID: process.env.DISCORD_CLIENT_ID,
        clientSecret: process.env.DISCORD_CLIENT_SECRET,
        callbackURL: process.env.DISCORD_CALLBACK_URL,
        scope: ['identify']
      },
      (_accessToken, _refreshToken, profile, done) => {
        return done(null, profile);
      }
    )
  );
  app.get('/auth/discord', passport.authenticate('discord'));

  app.get(
    '/auth/discord/callback',
    passport.authenticate('discord', { failureRedirect: '/' }),
    (req, res) => {
      res.redirect('/');
    }
  );
} else {
  console.warn('Discord OAuth not configured, authentication disabled');
  app.get('/auth/discord', (_req, res) => {
    res.status(501).send('OAuth disabled');
  });
  app.get('/auth/discord/callback', (_req, res) => {
    res.redirect('/');
  });
}

app.get('/auth/logout', (req, res, next) => {
  req.logout(err => {
    if (err) return next(err);
    res.redirect('/');
  });
});

app.get('/api/user', async (req, res) => {
  if (!req.user) {
    return res.json({ user: null, isAdmin: false });
  }

  const user = {
    id: req.user.id,
    username: req.user.username,
    avatar: req.user.avatar
  };

  let roles = [];
  let isAdmin = false;

  if (process.env.DISCORD_BOT_TOKEN && process.env.DISCORD_GUILD_ID) {
    try {
      const response = await fetch(
        `https://discord.com/api/guilds/${process.env.DISCORD_GUILD_ID}/members/${user.id}`,
        {
          headers: {
            Authorization: `Bot ${process.env.DISCORD_BOT_TOKEN}`
          }
        }
      );
      if (response.ok) {
        const data = await response.json();
        roles = data.roles || [];
        isAdmin =
          roles.includes(process.env.MANAGEMENT_ROLE_ID || '') ||
          roles.includes(process.env.STAFF_ROLE_ID || '');
      }
    } catch (err) {
      console.error('Failed to fetch roles', err);
    }
  }

  res.json({ user, roles, isAdmin });
});

// Provide a consistent set of questions for each authenticated user
app.get('/api/questions', (req, res) => {
  if (!req.user) {
    return res.status(401).json({ questions: [] });
  }

  // Check if the user already has questions assigned
  if (!userQuestions.has(req.user.id)) {
    // Shuffle and assign 5 questions
    const shuffled = [...allQuestions].sort(() => Math.random() - 0.5);
    userQuestions.set(req.user.id, shuffled.slice(0, 5));
  }

  res.json({ questions: userQuestions.get(req.user.id) });
});

// Return application status for the logged in user
app.get('/api/status', (req, res) => {
  if (!req.user) {
    return res.json({ status: null });
  }

  const db = loadDb();
  const appEntry = db.applications.find(a => a.userId === req.user.id);
  res.json({
    status: appEntry ? appEntry.status : null,
    history: appEntry ? appEntry.history || [] : [],
    reapplyAfter: appEntry ? appEntry.reapplyAfter || null : null,
    baseCooldownHours: REAPPLY_COOLDOWN_HOURS,
    extraCooldownHours: EXTRA_COOLDOWN_HOURS,
    recentRejections: appEntry
      ? appEntry.history.filter(
          h =>
            h.status === STATUS.REJECTED &&
            Date.now() - h.timestamp <=
              REJECTION_HISTORY_WINDOW_HOURS * 3600 * 1000
        ).length
      : 0,
    rejectionsBeforeExtra: REJECTIONS_BEFORE_EXTRA_COOLDOWN
  });
});

// Handle application submissions
app.post('/api/apply', async (req, res) => {
  const webhook = process.env.WEBHOOK_URL;
  const payload = {
    content: 'Nowe podanie',
    embeds: [
      {
        title: 'Podanie o whitelist',
        description: 'Nowe podanie z formularza',
        fields: [
          { name: 'Discord', value: req.body.ooc?.discord || 'brak', inline: false }
        ]
      }
    ]
  };

  if (webhook) {
    try {
      await fetch(webhook, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
    } catch (err) {
      console.error('Failed to send webhook', err);
    }
  } else {
    console.log('Application:', req.body);
  }
  // Save application with initial status
  if (req.user) {
    const db = loadDb();
    const userApps = db.applications.filter(a => a.userId === req.user.id);
    const latest = userApps[userApps.length - 1];
    if (latest && latest.status !== STATUS.REJECTED) {
      return res
        .status(400)
        .json({ success: false, status: latest.status });
    }
    if (latest && latest.status === STATUS.REJECTED) {
      const reapplyAfter = latest.reapplyAfter || 0;
      if (Date.now() < reapplyAfter) {
        return res
          .status(400)
          .json({ success: false, status: latest.status, reapplyAfter });
      }
    }

    const newApp = {
      id: Date.now().toString(),
      userId: req.user.id,
      data: req.body,
      status: STATUS.SENT,
      history: [{ status: STATUS.SENT, timestamp: Date.now() }]
    };
    db.applications.push(newApp);
    saveDb(db);
  }

  res.json({ success: true, status: STATUS.SENT });
});

// Endpoint for administrators to update application status
app.post('/api/admin/status', async (req, res) => {
  if (!req.user) {
    return res.status(401).json({ success: false });
  }

  const { userId, status } = req.body || {};
  if (!userId || !status) {
    return res.status(400).json({ success: false });
  }

  let isAdmin = false;
  if (process.env.DISCORD_BOT_TOKEN && process.env.DISCORD_GUILD_ID) {
    try {
      const response = await fetch(
        `https://discord.com/api/guilds/${process.env.DISCORD_GUILD_ID}/members/${req.user.id}`,
        {
          headers: { Authorization: `Bot ${process.env.DISCORD_BOT_TOKEN}` }
        }
      );
      if (response.ok) {
        const data = await response.json();
        const roles = data.roles || [];
        isAdmin =
          roles.includes(process.env.MANAGEMENT_ROLE_ID || '') ||
          roles.includes(process.env.STAFF_ROLE_ID || '');
      }
    } catch (err) {
      console.error('Failed to check admin roles', err);
    }
  }

  if (!isAdmin) {
    return res.status(403).json({ success: false });
  }

  const db = loadDb();
  const appEntry = db.applications.find(a => a.userId === userId);
  if (!appEntry) {
    return res.status(404).json({ success: false });
  }

  appEntry.status = status;
  appEntry.history = appEntry.history || [];
  appEntry.history.push({ status, timestamp: Date.now() });

  if (status === STATUS.REJECTED) {
    appEntry.reapplyAfter = computeReapplyAfter(appEntry.history);
  } else {
    delete appEntry.reapplyAfter;
  }

  saveDb(db);
  res.json({ success: true });
});

// Provide list of all applications for administrators
app.get('/api/admin/applications', async (req, res) => {
  if (!req.user) {
    return res.status(401).json({ applications: [] });
  }

  let isAdmin = false;
  if (process.env.DISCORD_BOT_TOKEN && process.env.DISCORD_GUILD_ID) {
    try {
      const response = await fetch(
        `https://discord.com/api/guilds/${process.env.DISCORD_GUILD_ID}/members/${req.user.id}`,
        { headers: { Authorization: `Bot ${process.env.DISCORD_BOT_TOKEN}` } }
      );
      if (response.ok) {
        const data = await response.json();
        const roles = data.roles || [];
        isAdmin =
          roles.includes(process.env.MANAGEMENT_ROLE_ID || '') ||
          roles.includes(process.env.STAFF_ROLE_ID || '');
      }
    } catch (err) {
      console.error('Failed to check admin roles', err);
    }
  }

  if (!isAdmin) {
    return res.status(403).json({ applications: [] });
  }

  const db = loadDb();
  const sorted = db.applications
    .map(a => ({
      ...a,
      ts: a.history && a.history[0] ? a.history[0].timestamp : Number(a.id)
    }))
    .sort((a, b) => a.ts - b.ts);

  const counts = {};
  const result = sorted.map(a => {
    counts[a.userId] = (counts[a.userId] || 0) + 1;
    return {
      id: a.id,
      userId: a.userId,
      discord: a.data?.ooc?.discord || '',
      status: a.status,
      timestamp: a.ts,
      number: counts[a.userId]
    };
  });

  res.json({ applications: result });
});

// Provide single application details for administrators
app.get('/api/admin/applications/:id', async (req, res) => {
  if (!req.user) {
    return res.status(401).json({ application: null });
  }

  let isAdmin = false;
  if (process.env.DISCORD_BOT_TOKEN && process.env.DISCORD_GUILD_ID) {
    try {
      const response = await fetch(
        `https://discord.com/api/guilds/${process.env.DISCORD_GUILD_ID}/members/${req.user.id}`,
        { headers: { Authorization: `Bot ${process.env.DISCORD_BOT_TOKEN}` } }
      );
      if (response.ok) {
        const data = await response.json();
        const roles = data.roles || [];
        isAdmin =
          roles.includes(process.env.MANAGEMENT_ROLE_ID || '') ||
          roles.includes(process.env.STAFF_ROLE_ID || '');
      }
    } catch (err) {
      console.error('Failed to check admin roles', err);
    }
  }

  if (!isAdmin) {
    return res.status(403).json({ application: null });
  }

  const db = loadDb();
  const appEntry = db.applications.find(a => a.id === req.params.id);
  if (!appEntry) {
    return res.status(404).json({ application: null });
  }

  res.json({ application: appEntry });
});

// Serve static files
app.use(express.static(path.join(__dirname, 'dist')));

// All routes return index.html (to support SPA routing)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

// Start the server
app.listen(PORT, () => {
  console.log(`server was run on http://localhost:${PORT}`);
});