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
  APPROVED: 'Pozytywnie',
  REJECTED: 'Negatywnie',
  ARCHIVED: 'Zarchiwizowane'
};

// Configurable cooldown settings loaded from config.js
// Values may be updated at runtime so always reference the config object

const DB_FILE = path.join(process.cwd(), 'database.json');

function normalizeStatus(s) {
  if (!s) return s;
  if (
    s === 'Negatywnie (Napisz nowe podanie w ciągu 24/48h)' ||
    s === 'Rozpatrzone negatywnie'
  )
    return STATUS.REJECTED;
  if (s === 'Rozpatrzone Pozytywnie') return STATUS.APPROVED;
  return s;
}

function loadDb() {
  try {
    const data = JSON.parse(fs.readFileSync(DB_FILE, 'utf8'));
    if (data && Array.isArray(data.applications)) {
      data.applications.forEach(app => {
        app.status = normalizeStatus(app.status);
        if (Array.isArray(app.history)) {
          app.history = app.history.map(h => ({
            ...h,
            status: normalizeStatus(h.status)
          }));
        }
        if (!('rejectionReason' in app)) app.rejectionReason = '';
        if (!('adminNotes' in app)) app.adminNotes = '';
        if (!('interviewNotes' in app)) app.interviewNotes = '';
        if (!('archived' in app)) app.archived = null;
        if (!('type' in app)) app.type = 'whitelist';
      });
    }
    if (!data.playerNotes) data.playerNotes = {};
    return data;
  } catch (err) {
    return { applications: [], playerNotes: {} };
  }
}

function saveDb(db) {
  fs.writeFileSync(DB_FILE, JSON.stringify(db, null, 2));
}

function computeReapplyAfter(
  history,
  baseHours = config.REAPPLY_COOLDOWN_HOURS
) {
  const rejections = (history || []).filter(
    h => normalizeStatus(h.status) === STATUS.REJECTED
  );
  if (rejections.length === 0) return null;
  const last = rejections[rejections.length - 1];
  const recent = rejections.filter(
    r =>
      last.timestamp - r.timestamp <=
      config.REJECTION_HISTORY_WINDOW_HOURS * 3600 * 1000
  );

  let cooldown = baseHours;
  if (recent.length >= config.REJECTIONS_BEFORE_EXTRA_COOLDOWN) {
    cooldown += config.EXTRA_COOLDOWN_HOURS;
  }
  return last.timestamp + cooldown * 3600 * 1000;
}

function autoArchiveOldApplications(db) {
  const WEEK = 7 * 24 * 3600 * 1000;
  const now = Date.now();
  let changed = false;
  for (const app of db.applications) {
    if (
      !app.archived &&
      (app.status === STATUS.APPROVED || app.status === STATUS.REJECTED)
    ) {
      const last = (app.history && app.history[app.history.length - 1]) || null;
      const ts = last ? last.timestamp : Number(app.id);
      if (now - ts >= WEEK) {
        app.archived = { timestamp: now, by: 'System' };
        app.history = app.history || [];
        app.history.push({
          status: STATUS.ARCHIVED,
          timestamp: now,
          by: 'System'
        });
        changed = true;
      }
    }
  }
  if (changed) saveDb(db);
}

function recomputeAllReapplyAfter() {
  const db = loadDb();
  let changed = false;
  for (const app of db.applications) {
    if (!Array.isArray(app.history) || app.history.length === 0) continue;
    const base =
      app.type === 'administrator' ||
      app.type === 'moderator' ||
      app.type === 'checker' ||
      app.type === 'developer'
        ? config.ADMIN_REAPPLY_COOLDOWN_DAYS * 24
        : app.type === 'unban'
          ? (app.data?.banDurationDays
              ? app.data.banDurationDays * 24 * config.UNBAN_COOLDOWN_PERCENT
              : config.REAPPLY_COOLDOWN_HOURS)
          : config.REAPPLY_COOLDOWN_HOURS;
    const newVal = computeReapplyAfter(app.history, base);
    if (newVal) {
      if (app.reapplyAfter !== newVal) {
        app.reapplyAfter = newVal;
        changed = true;
      }
    } else if (app.reapplyAfter) {
      delete app.reapplyAfter;
      changed = true;
    }
  }
  if (changed) saveDb(db);
}

// Pytania scenariuszowe znajdują się w pliku config.js

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
        scope: ['identify', 'guilds']
      },
      (accessToken, _refreshToken, profile, done) => {
        profile.accessToken = accessToken;
        return done(null, profile);
      }
    )
  );
  app.get('/auth/discord', passport.authenticate('discord'));

  app.get('/auth/discord/callback', (req, res, next) => {
    passport.authenticate('discord', async (err, user) => {
      if (err) return next(err);
      if (!user) return res.redirect('/');

      try {
        let inGuild = false;
        if (process.env.DISCORD_BOT_TOKEN && process.env.DISCORD_GUILD_ID) {
          const memberRes = await fetch(
            `https://discord.com/api/guilds/${process.env.DISCORD_GUILD_ID}/members/${user.id}`,
            { headers: { Authorization: `Bot ${process.env.DISCORD_BOT_TOKEN}` } }
          );
          inGuild = memberRes.ok;
        } else {
          const guildRes = await fetch('https://discord.com/api/users/@me/guilds', {
            headers: { Authorization: `Bearer ${user.accessToken}` }
          });
          if (guildRes.ok) {
            const guilds = await guildRes.json();
            inGuild = Array.isArray(guilds) && guilds.some(g => g.id === process.env.DISCORD_GUILD_ID);
          }
        }

        if (!inGuild) {
          const invite = process.env.DISCORD_INVITE_URL || '/discord-required';
          return res.redirect(invite);
        }

        req.logIn(user, err2 => {
          if (err2) return next(err2);
          res.redirect('/');
        });
      } catch (e) {
        next(e);
      }
    })(req, res, next);
  });
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

// Return avatar and status for a specific Discord user
app.get('/api/team-member/:id', async (req, res) => {
  if (!process.env.DISCORD_BOT_TOKEN) {
    return res.status(500).json({ avatar: null, status: 'offline' });
  }

  try {
    const userRes = await fetch(`https://discord.com/api/users/${req.params.id}`, {
      headers: { Authorization: `Bot ${process.env.DISCORD_BOT_TOKEN}` }
    });
    let avatar = null;
    if (userRes.ok) {
      const userData = await userRes.json();
      if (userData.avatar) {
        avatar = `https://cdn.discordapp.com/avatars/${userData.id}/${userData.avatar}.png`;
      }
    }

    let status = 'offline';
    if (process.env.DISCORD_GUILD_ID) {
      const memberRes = await fetch(
        `https://discord.com/api/guilds/${process.env.DISCORD_GUILD_ID}/members/${req.params.id}`,
        { headers: { Authorization: `Bot ${process.env.DISCORD_BOT_TOKEN}` } }
      );
      if (memberRes.ok) {
        const memberData = await memberRes.json();
        status = memberData?.presence?.status || status;
      }
    }

    res.json({ avatar, status });
  } catch (err) {
    console.error('Failed to fetch team member', err);
    res.status(500).json({ avatar: null, status: 'offline' });
  }
});

// Provide a consistent set of questions for each authenticated user
app.get('/api/questions', (req, res) => {
  if (!req.user) {
    return res.status(401).json({ questions: [] });
  }

  const type = req.query.type || 'whitelist';
  const key = `${req.user.id}:${type}`;
  const countMap = {
    whitelist: 5,
    checker: 5,
    moderator: 1,
    administrator: 3,
    developer: 3
  };
  const pool = (config.QUESTIONS && config.QUESTIONS[type]) || [];
  const count = countMap[type] || 5;

  if (!userQuestions.has(key)) {
    const shuffled = [...pool].sort(() => Math.random() - 0.5);
    userQuestions.set(key, shuffled.slice(0, count));
  }

  res.json({ questions: userQuestions.get(key) });
});

// Return application status for the logged in user
app.get('/api/status', (req, res) => {
  if (!req.user) {
    return res.json({ status: null });
  }

  const db = loadDb();
  autoArchiveOldApplications(db);
  const type = req.query.type || 'whitelist';
  const userApps = db.applications.filter(
    a => a.userId === req.user.id && (a.type || 'whitelist') === type && !a.archived
  );
  const appEntry = userApps.sort((a, b) => {
    const tsA = a.history && a.history[0] ? a.history[0].timestamp : Number(a.id);
    const tsB = b.history && b.history[0] ? b.history[0].timestamp : Number(b.id);
    return tsB - tsA;
  })[0];
  res.json({
    status: appEntry ? appEntry.status : null,
    rejectionReason: appEntry ? appEntry.rejectionReason || '' : '',
    history: appEntry ? appEntry.history || [] : [],
    archived: appEntry ? appEntry.archived || null : null,
    reapplyAfter: appEntry ? appEntry.reapplyAfter || null : null,
    baseCooldownHours:
      type === 'administrator' ||
      type === 'moderator' ||
      type === 'checker' ||
      type === 'developer'
        ? config.ADMIN_REAPPLY_COOLDOWN_DAYS * 24
        : config.REAPPLY_COOLDOWN_HOURS,
    extraCooldownHours: config.EXTRA_COOLDOWN_HOURS,
    recentRejections: appEntry
      ? appEntry.history.filter(
          h =>
            h.status === STATUS.REJECTED &&
            Date.now() - h.timestamp <=
              config.REJECTION_HISTORY_WINDOW_HOURS * 3600 * 1000
        ).length
      : 0,
    rejectionsBeforeExtra: config.REJECTIONS_BEFORE_EXTRA_COOLDOWN
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
    const appType = req.body.type || 'whitelist'
    const userApps = db.applications.filter(
      a => a.userId === req.user.id && a.type === appType
    )
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
      // Archive the previous rejected application
      if (!latest.archived) {
        latest.archived = { timestamp: Date.now(), by: req.user.username };
        latest.history = latest.history || [];
        latest.history.push({
          status: STATUS.ARCHIVED,
          timestamp: Date.now(),
          by: req.user.username
        });
      }
    }

    const newApp = {
      id: Date.now().toString(),
      userId: req.user.id,
      data: req.body,
      type: appType,
      status: STATUS.SENT,
      history: [
        {
          status: STATUS.SENT,
          timestamp: Date.now(),
          by: req.user.username
        }
      ]
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

  const { id, userId, status, rejectionReason, adminNotes, interviewNotes, type } =
    req.body || {};
  if ((!userId && !id) || !status) {
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
  let appEntry = null;
  if (id) {
    appEntry = db.applications.find(a => a.id === id);
  }
  if (!appEntry && userId) {
    appEntry = db.applications.find(a => {
      if (a.userId !== userId) return false;
      if (type) return (a.type || 'whitelist') === type;
      return true;
    });
  }
  if (!appEntry) {
    return res.status(404).json({ success: false });
  }

  appEntry.status = status;
  if (status === STATUS.REJECTED) {
    appEntry.rejectionReason = rejectionReason || '';
  } else {
    appEntry.rejectionReason = '';
  }
  if (adminNotes !== undefined) appEntry.adminNotes = adminNotes;
  if (interviewNotes !== undefined) appEntry.interviewNotes = interviewNotes;
  appEntry.history = appEntry.history || [];
  const idx = appEntry.history.findIndex(
    h => normalizeStatus(h.status) === status
  );
  const entry = { status, timestamp: Date.now(), by: req.user.username };
  if (idx >= 0) {
    appEntry.history[idx] = entry;
  } else {
    appEntry.history.push(entry);
  }

  if (status === STATUS.APPROVED) {
    appEntry.history = appEntry.history.filter(
      h => normalizeStatus(h.status) !== STATUS.REJECTED
    );
  }

  if (status === STATUS.REJECTED) {
    const base =
      appEntry.type === 'administrator' ||
      appEntry.type === 'moderator' ||
      appEntry.type === 'checker' ||
      appEntry.type === 'developer'
        ? config.ADMIN_REAPPLY_COOLDOWN_DAYS * 24
        : appEntry.type === 'unban'
          ? (appEntry.data.banDurationDays
              ? appEntry.data.banDurationDays * 24 * config.UNBAN_COOLDOWN_PERCENT
              : config.REAPPLY_COOLDOWN_HOURS)
          : config.REAPPLY_COOLDOWN_HOURS;
    appEntry.reapplyAfter = computeReapplyAfter(appEntry.history, base);
  } else {
    delete appEntry.reapplyAfter;
  }

  saveDb(db);

  if (process.env.DISCORD_BOT_TOKEN && process.env.DISCORD_GUILD_ID) {
    const rolesToUpdate = [];
    switch (appEntry.type) {
      case 'whitelist':
        if (process.env.PENDING_WHITELIST_ROLE_ID) {
          rolesToUpdate.push(process.env.PENDING_WHITELIST_ROLE_ID);
        }
        break;
      case 'checker':
        if (process.env.PENDING_ROLES_ROLE_ID) {
          rolesToUpdate.push(process.env.PENDING_ROLES_ROLE_ID);
        }
        if (process.env.PENDING_CHECKER_ROLE_ID) {
          rolesToUpdate.push(process.env.PENDING_CHECKER_ROLE_ID);
        }
        break;
      case 'moderator':
        if (process.env.PENDING_ROLES_ROLE_ID) {
          rolesToUpdate.push(process.env.PENDING_ROLES_ROLE_ID);
        }
        if (process.env.PENDING_MODERATOR_ROLE_ID) {
          rolesToUpdate.push(process.env.PENDING_MODERATOR_ROLE_ID);
        }
        break;
      case 'administrator':
        if (process.env.PENDING_ROLES_ROLE_ID) {
          rolesToUpdate.push(process.env.PENDING_ROLES_ROLE_ID);
        }
        if (process.env.PENDING_ADMIN_ROLE_ID) {
          rolesToUpdate.push(process.env.PENDING_ADMIN_ROLE_ID);
        }
        break;
      case 'developer':
        if (process.env.PENDING_ROLES_ROLE_ID) {
          rolesToUpdate.push(process.env.PENDING_ROLES_ROLE_ID);
        }
        if (process.env.PENDING_DEVELOPER_ROLE_ID) {
          rolesToUpdate.push(process.env.PENDING_DEVELOPER_ROLE_ID);
        }
        break;
    }

    for (const roleId of rolesToUpdate) {
      const roleUrl =
        `https://discord.com/api/guilds/${process.env.DISCORD_GUILD_ID}/members/${appEntry.userId}/roles/${roleId}`;
      try {
        await fetch(roleUrl, {
          method: status === STATUS.APPROVED ? 'PUT' : 'DELETE',
          headers: { Authorization: `Bot ${process.env.DISCORD_BOT_TOKEN}` }
        });
      } catch (err) {
        console.error(`Failed to update role ${roleId}`, err);
      }
    }
  }

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
  const type = req.query.type || 'whitelist';
  autoArchiveOldApplications(db);
  let filteredApps = db.applications;
  if (type && type !== 'all') {
    filteredApps = filteredApps.filter(
      a => (a.type || 'whitelist') === type
    );
  }
  const sorted = filteredApps
    .map(a => ({
      ...a,
      ts: a.history && a.history[0] ? a.history[0].timestamp : Number(a.id)
    }))
    .sort((a, b) => a.ts - b.ts);

  const counts = {};
  const result = sorted.map(a => {
    const typeKey = `${a.userId}:${a.type || 'whitelist'}`;
    counts[typeKey] = (counts[typeKey] || 0) + 1;
    return {
      id: a.id,
      userId: a.userId,
      discord: a.data?.ooc?.discord || a.data?.discord || '',
      status: a.status,
      timestamp: a.ts,
      number: counts[typeKey],
      archived: a.archived || null,
      type: a.type || 'whitelist'
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
  autoArchiveOldApplications(db);
  const appEntry = db.applications.find(a => a.id === req.params.id);
  if (!appEntry) {
    return res.status(404).json({ application: null });
  }

  res.json({ application: appEntry });
});

// Manually archive an application
app.post('/api/admin/archive/:id', async (req, res) => {
  if (!req.user) {
    return res.status(401).json({ success: false });
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
    return res.status(403).json({ success: false });
  }

  const db = loadDb();
  const appEntry = db.applications.find(a => a.id === req.params.id);
  if (!appEntry) {
    return res.status(404).json({ success: false });
  }
  if (!appEntry.archived) {
    appEntry.archived = { timestamp: Date.now(), by: req.user.username };
    appEntry.history = appEntry.history || [];
    appEntry.history.push({
      status: STATUS.ARCHIVED,
      timestamp: Date.now(),
      by: req.user.username
    });
    saveDb(db);
  }

  res.json({ success: true });
});

// Restore an archived application
app.post('/api/admin/unarchive/:id', async (req, res) => {
  if (!req.user) {
    return res.status(401).json({ success: false });
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
    return res.status(403).json({ success: false });
  }

  const db = loadDb();
  const appEntry = db.applications.find(a => a.id === req.params.id);
  if (!appEntry) {
    return res.status(404).json({ success: false });
  }
  if (appEntry.archived) {
    appEntry.archived = null;
    appEntry.history = (appEntry.history || []).filter(h => h.status !== STATUS.ARCHIVED);
    saveDb(db);
  }

  res.json({ success: true });
});

// Update or fetch notes about players
app.post('/api/admin/player-notes', async (req, res) => {
  if (!req.user) return res.status(401).json({ success: false });

  const { userId, notes } = req.body || {};
  if (!userId) return res.status(400).json({ success: false });

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
  if (!isAdmin) return res.status(403).json({ success: false });

  const db = loadDb();
  db.playerNotes[userId] = notes || '';
  saveDb(db);
  res.json({ success: true });
});

app.get('/api/admin/player-notes/:userId', async (req, res) => {
  if (!req.user) return res.status(401).json({ notes: '' });
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
  if (!isAdmin) return res.status(403).json({ notes: '' });

  const db = loadDb();
  res.json({ notes: db.playerNotes[req.params.userId] || '' });
});

// Fetch cooldown-related settings from config
app.get('/api/admin/witcher-settings', async (req, res) => {
  if (!req.user) return res.status(401).json({ settings: null });
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
  if (!isAdmin) return res.status(403).json({ settings: null });
  res.json({ settings: { ...config } });
});

// Update cooldown-related settings
app.post('/api/admin/witcher-settings', async (req, res) => {
  if (!req.user) return res.status(401).json({ success: false });
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
  if (!isAdmin) return res.status(403).json({ success: false });

  const allowedKeys = [
    'REAPPLY_COOLDOWN_HOURS',
    'EXTRA_COOLDOWN_HOURS',
    'REJECTION_HISTORY_WINDOW_HOURS',
    'REJECTIONS_BEFORE_EXTRA_COOLDOWN',
    'ADMIN_REAPPLY_COOLDOWN_DAYS',
    'UNBAN_COOLDOWN_PERCENT'
  ];

  for (const key of allowedKeys) {
    if (key in req.body) {
      const value = Number(req.body[key]);
      if (!Number.isNaN(value)) {
        config[key] = value;
      }
    }
  }

  const configPath = path.join(process.cwd(), 'config.js');
  const fileContent =
    'export default ' + JSON.stringify(config, null, 2) + '\n';
  fs.writeFileSync(configPath, fileContent);
  recomputeAllReapplyAfter();
  res.json({ success: true, settings: { ...config } });
});

// Fetch question pools
app.get('/api/admin/witcher-questions', async (req, res) => {
  if (!req.user) return res.status(401).json({ questions: null });
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
  if (!isAdmin) return res.status(403).json({ questions: null });
  res.json({ questions: { ...config.QUESTIONS } });
});

// Update question pools
app.post('/api/admin/witcher-questions', async (req, res) => {
  if (!req.user) return res.status(401).json({ success: false });
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
  if (!isAdmin) return res.status(403).json({ success: false });

  const allowed = ['whitelist', 'checker', 'moderator', 'administrator', 'developer'];
  for (const t of allowed) {
    if (Array.isArray(req.body[t])) {
      config.QUESTIONS[t] = req.body[t].map(q => String(q));
    }
  }

  const configPath = path.join(process.cwd(), 'config.js');
  const fileContent = 'export default ' + JSON.stringify(config, null, 2) + '\n';
  fs.writeFileSync(configPath, fileContent);
  userQuestions.clear();
  res.json({ success: true, questions: { ...config.QUESTIONS } });
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