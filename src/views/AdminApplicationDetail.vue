<template>
  <main class="app-detail-page">
    <RouterLink :to="backPath" class="back-link">
      <i class="fa-solid fa-arrow-left"></i> Powrót
    </RouterLink>
    <div v-if="app" class="detail-container">
      <h1 class="detail-title">Podanie użytkownika <span class="logo-accent discord-name">{{ cleanDiscord(discordField) }}</span></h1>
      <table class="app-table">
        <tr>
          <th>Status</th>
          <td><span :class="['status-text', statusClass]">{{ app.status }}</span></td>
        </tr>
        <tr>
          <th>Data zgłoszenia</th>
          <td>{{ formatDate(ts) }}</td>
        </tr>
        <tr v-if="decisionInfo">
          <th>Decyzja</th>
          <td>{{ decisionInfo }}</td>
        </tr>
      </table>
      <template v-if="app.type === 'administrator'">
        <h2>Informacje OOC</h2>
        <table class="app-table">
          <tr><th>Nick Discord + ID</th><td>{{ discordField }}</td></tr>
          <tr>
            <th>Czy byłeś wcześniej adminem na serwerze RP lub społecznościowym?</th>
            <td>{{ app.data.previousAdmin }}</td>
          </tr>
          <tr>
            <th>Jakie obszary administracyjne Cię interesują?</th>
            <td>{{ app.data.adminAreas }}</td>
          </tr>
        </table>
        <h2>Sytuacje organizacyjne</h2>
        <table class="app-table">
          <template v-for="(qa, idx) in scenarioPairs" :key="idx">
            <tr>
              <th colspan="2" class="question-cell"><pre>{{ qa.question }}</pre></th>
            </tr>
            <tr>
              <td colspan="2" class="answer-cell"><pre>{{ qa.answer }}</pre></td>
            </tr>
          </template>
        </table>
        <h2>Zarządzanie</h2>
        <table class="app-table">
          <tr>
            <th colspan="2" class="question-cell">Co to jest zdrowa struktura administracyjna?</th>
          </tr>
          <tr>
            <td colspan="2" class="answer-cell">{{ app.data.healthyStructure }}</td>
          </tr>
          <tr>
            <th colspan="2" class="question-cell">Czy jesteś skory do współpracy z rolami wyżej? Jak to sobie wyobrażasz?</th>
          </tr>
          <tr>
            <td colspan="2" class="answer-cell">{{ app.data.cooperation }}</td>
          </tr>
          <tr>
            <th colspan="2" class="question-cell">Co Twoim zdaniem warto byłoby usprawnić w administracji?</th>
          </tr>
          <tr>
            <td colspan="2" class="answer-cell">{{ app.data.improvements }}</td>
          </tr>
        </table>
        <h2>Zgody</h2>
        <table class="app-table">
          <tr>
            <th>Zgoda na przetwarzanie danych (Discord ID)</th>
            <td>{{ app.data.consentData ? 'Tak' : 'Nie' }}</td>
          </tr>
          <tr>
            <th>Akceptuję obowiązki Administratora</th>
            <td>{{ app.data.consentDuties ? 'Tak' : 'Nie' }}</td>
          </tr>
          <tr>
            <th>Potwierdzam prawdziwość podanych informacji</th>
            <td>{{ app.data.consentTruth ? 'Tak' : 'Nie' }}</td>
          </tr>
        </table>
      </template>
      <template v-else-if="app.type === 'moderator'">
        <h2>Informacje OOC</h2>
        <table class="app-table">
          <tr><th>Nick Discord + ID</th><td>{{ discordField }}</td></tr>
          <tr><th>Wiek</th><td>{{ app.data.age }}</td></tr>
          <tr>
            <th>Od jak dawna jesteś na serwerze?</th>
            <td>{{ app.data.serverTime }}</td>
          </tr>
          <tr>
            <th>Ile czasu dziennie jesteś aktywny/a na Discordzie?</th>
            <td>{{ app.data.activeTime }}</td>
          </tr>
        </table>
        <h2>Doświadczenie i podejście</h2>
        <table class="app-table">
          <tr>
            <th colspan="2" class="question-cell">Czy pełniłaś/eś wcześniej funkcję moderatora? Gdzie i jak wyglądała ta rola?</th>
          </tr>
          <tr>
            <td colspan="2" class="answer-cell">{{ app.data.moderatorExp }}</td>
          </tr>
          <tr>
            <th colspan="2" class="question-cell">Dlaczego chcesz zostać Moderatorem u nas?</th>
          </tr>
          <tr>
            <td colspan="2" class="answer-cell">{{ app.data.motivation }}</td>
          </tr>
          <tr>
            <th colspan="2" class="question-cell">Jakie są Twoje mocne strony w kontakcie z ludźmi?</th>
          </tr>
          <tr>
            <td colspan="2" class="answer-cell">{{ app.data.strengths }}</td>
          </tr>
        </table>
        <h2>Sytuacje i zachowanie</h2>
        <table class="app-table">
          <tr>
            <th colspan="2" class="question-cell">Jak reagujesz, gdy użytkownik prowokuje innych, ale nie łamie regulaminu bezpośrednio?</th>
          </tr>
          <tr>
            <td colspan="2" class="answer-cell">{{ app.data.provocation }}</td>
          </tr>
          <tr>
            <th colspan="2" class="question-cell">Co robisz, jeśli ktoś wysyła zgłoszenie w stylu "XD lol" – bez konkretów?</th>
          </tr>
          <tr>
            <td colspan="2" class="answer-cell">{{ app.data.lolReport }}</td>
          </tr>
          <tr>
            <th colspan="2" class="question-cell">Jak rozpoznać, że zgłoszenie nie jest trollowaniem, tylko realnym problemem?</th>
          </tr>
          <tr>
            <td colspan="2" class="answer-cell">{{ app.data.realProblem }}</td>
          </tr>
          <tr>
            <th colspan="2" class="question-cell"><pre>{{ app.data.scenario }}</pre></th>
          </tr>
          <tr>
            <td colspan="2" class="answer-cell"><pre>{{ app.data.randomAnswer }}</pre></td>
          </tr>
        </table>
        <h2>Praca w zespole</h2>
        <table class="app-table">
          <tr>
            <th colspan="2" class="question-cell">Jak widzisz współpracę z innymi członkami zespołu, takimi jak Community Manager, Admin czy Developer?</th>
          </tr>
          <tr>
            <td colspan="2" class="answer-cell">{{ app.data.teamwork }}</td>
          </tr>
          <tr>
            <th colspan="2" class="question-cell">Jak rozumiesz swoją rolę w przekazywaniu zgłoszeń dalej? Kiedy decydujesz się rozwiązać coś samodzielnie, a kiedy informujesz innych członków zespołu?</th>
          </tr>
          <tr>
            <td colspan="2" class="answer-cell">{{ app.data.escalation }}</td>
          </tr>
          <tr>
            <th colspan="2" class="question-cell">Czy potrafisz pozostać neutralny, nawet gdy temat dotyczy znajomej osoby?</th>
          </tr>
          <tr>
            <td colspan="2" class="answer-cell">{{ app.data.neutrality }}</td>
          </tr>
        </table>
        <h2>Zgody</h2>
        <table class="app-table">
          <tr>
            <th>Zgoda na przetwarzanie danych (Discord ID)</th>
            <td>{{ app.data.consentData ? 'Tak' : 'Nie' }}</td>
          </tr>
          <tr>
            <th>Akceptuję obowiązki Moderatora</th>
            <td>{{ app.data.consentDuties ? 'Tak' : 'Nie' }}</td>
          </tr>
          <tr>
            <th>Potwierdzam prawdziwość podanych informacji</th>
            <td>{{ app.data.consentTruth ? 'Tak' : 'Nie' }}</td>
          </tr>
      </table>
      </template>
      <template v-else-if="app.type === 'checker'">
        <h2>Informacje OOC</h2>
        <table class="app-table">
          <tr><th>Nick Discord + ID</th><td>{{ discordField }}</td></tr>
          <tr>
            <th>Od jak dawna jesteś na naszym serwerze?</th>
            <td>{{ app.data.serverTime }}</td>
          </tr>
        </table>
        <h2>Doświadczenie i podejście</h2>
        <table class="app-table">
          <tr>
            <th colspan="2" class="question-cell">Czy miałeś styczność z weryfikacją lub selekcją graczy?</th>
          </tr>
          <tr>
            <td colspan="2" class="answer-cell">{{ app.data.verificationExp }}</td>
          </tr>
          <tr>
            <th colspan="2" class="question-cell">Jak rozpoznać gracza, który "tylko wypełnił, żeby wejść", od gracza z potencjałem?</th>
          </tr>
          <tr>
            <td colspan="2" class="answer-cell">{{ app.data.differentiate }}</td>
          </tr>
          <tr>
            <th colspan="2" class="question-cell">Na co zwracasz uwagę przy czytaniu podania na WL?</th>
          </tr>
          <tr>
            <td colspan="2" class="answer-cell">{{ app.data.reviewFocus }}</td>
          </tr>
          <tr>
            <th colspan="2" class="question-cell">Co Twoim zdaniem oznacza dobre RP i jakbyś je promował?</th>
          </tr>
          <tr>
            <td colspan="2" class="answer-cell">{{ app.data.goodRp }}</td>
          </tr>
        </table>
        <h2>Praca</h2>
        <table class="app-table">
          <tr>
            <th colspan="2" class="question-cell">Ile podań jesteś w stanie realnie sprawdzić dziennie / tygodniowo?</th>
          </tr>
          <tr>
            <td colspan="2" class="answer-cell">{{ app.data.workload }}</td>
          </tr>
          <tr>
            <th colspan="2" class="question-cell">Co robisz, jeśli masz wątpliwości co do kandydata?</th>
          </tr>
          <tr>
            <td colspan="2" class="answer-cell">{{ app.data.doubts }}</td>
          </tr>
          <tr>
            <th colspan="2" class="question-cell">Wolisz działać samodzielnie czy w parze z innym Checkerem?</th>
          </tr>
          <tr>
            <td colspan="2" class="answer-cell">{{ app.data.teamwork }}</td>
          </tr>
        </table>
        <h2>Zgody</h2>
        <table class="app-table">
          <tr>
            <th>Zgoda na przetwarzanie danych (Discord ID)</th>
            <td>{{ app.data.consentData ? 'Tak' : 'Nie' }}</td>
          </tr>
          <tr>
            <th>Akceptuję obowiązki Checkera</th>
            <td>{{ app.data.consentDuties ? 'Tak' : 'Nie' }}</td>
          </tr>
          <tr>
            <th>Potwierdzam prawdziwość podanych informacji</th>
            <td>{{ app.data.consentTruth ? 'Tak' : 'Nie' }}</td>
          </tr>
        </table>
      </template>
      <template v-else-if="app.type === 'developer'">
        <h2>Informacje OOC</h2>
        <table class="app-table">
          <tr><th>Nick Discord + ID</th><td>{{ discordField }}</td></tr>
        </table>
        <h2>Doświadczenie i umiejętności</h2>
        <table class="app-table">
          <tr>
            <th colspan="2" class="question-cell">Jakie języki programowania znasz?</th>
          </tr>
          <tr>
            <td colspan="2" class="answer-cell">{{ app.data.languages }}</td>
          </tr>
          <tr>
            <th colspan="2" class="question-cell">Czy pracowałeś wcześniej z zasobami FiveM? Jakimi?</th>
          </tr>
          <tr>
            <td colspan="2" class="answer-cell">{{ app.data.fivemExp }}</td>
          </tr>
          <tr>
            <th colspan="2" class="question-cell">Jak wygląda Twoja organizacja pracy przy większych zadaniach?</th>
          </tr>
          <tr>
            <td colspan="2" class="answer-cell">{{ app.data.workOrg }}</td>
          </tr>
          <tr>
            <th colspan="2" class="question-cell">Opisz projekt/skrypt, z którego jesteś najbardziej dumny/a.</th>
          </tr>
          <tr>
            <td colspan="2" class="answer-cell">{{ app.data.proudProject }}</td>
          </tr>
          <tr>
            <th colspan="2" class="question-cell">Jak reagujesz, gdy ktoś zgłasza błąd w Twoim kodzie?</th>
          </tr>
          <tr>
            <td colspan="2" class="answer-cell">{{ app.data.bugResponse }}</td>
          </tr>
          <tr>
            <th colspan="2" class="question-cell">Czy potrafisz kodować pod cudze wymagania?</th>
          </tr>
          <tr>
            <td colspan="2" class="answer-cell">{{ app.data.requirements }}</td>
          </tr>
          <tr>
            <th colspan="2" class="question-cell">Jakie obszary Cię najbardziej interesują? (UI, systemy RP, joby, zasoby)</th>
          </tr>
          <tr>
            <td colspan="2" class="answer-cell">{{ app.data.interests }}</td>
          </tr>
          <tr>
            <th colspan="2" class="question-cell">Czy potrafisz przeprowadzać testy jednostkowe i techniczne?</th>
          </tr>
          <tr>
            <td colspan="2" class="answer-cell">{{ app.data.testing }}</td>
          </tr>
          <tr>
            <th colspan="2" class="question-cell">🔗 Link do portfolio (GitHub, Discord bot, skrypt, demo)</th>
          </tr>
          <tr>
            <td colspan="2" class="answer-cell">{{ app.data.portfolio }}</td>
          </tr>
        </table>
        <h2>Zgody</h2>
        <table class="app-table">
          <tr>
            <th>Zgoda na przetwarzanie danych (Discord ID)</th>
            <td>{{ app.data.consentData ? 'Tak' : 'Nie' }}</td>
          </tr>
        <tr>
          <th>Akceptuję zakres obowiązków Developera</th>
          <td>{{ app.data.consentDuties ? 'Tak' : 'Nie' }}</td>
        </tr>
        <tr>
          <th>Potwierdzam prawdziwość podanych informacji</th>
          <td>{{ app.data.consentTruth ? 'Tak' : 'Nie' }}</td>
        </tr>
      </table>
      </template>
      <template v-else-if="app.type === 'unban'">
        <h2>Dane Gracza</h2>
        <table class="app-table">
          <tr><th>Nick Discord + ID</th><td>{{ discordField }}</td></tr>
          <tr><th>SteamID</th><td>{{ app.data.steamId }}</td></tr>
          <tr><th>Nick w momencie bana</th><td>{{ app.data.serverNick }}</td></tr>
          <tr><th>Data bana</th><td>{{ app.data.banDate }}</td></tr>
        </table>
        <h2>Szczegóły Bana</h2>
        <table class="app-table">
          <tr><th>Kto nałożył bana</th><td>{{ app.data.bannedBy }}</td></tr>
          <tr><th>Powód bana</th><td>{{ app.data.banReason }}</td></tr>
        </table>
        <h2>Wyjaśnienie</h2>
        <table class="app-table">
          <tr><th colspan="2" class="question-cell">Twoja wersja wydarzeń</th></tr>
          <tr><td colspan="2" class="answer-cell">{{ app.data.events }}</td></tr>
          <tr><th colspan="2" class="question-cell">Czy przyznajesz się do złamania zasad?</th></tr>
          <tr><td colspan="2" class="answer-cell">{{ app.data.admit }}</td></tr>
          <tr><th colspan="2" class="question-cell">Co zmieniło się od momentu bana?</th></tr>
          <tr><td colspan="2" class="answer-cell">{{ app.data.change }}</td></tr>
        </table>
        <h2>Dodatki</h2>
        <table class="app-table">
          <tr><th colspan="2" class="question-cell">Dowody/screeny/nagrania</th></tr>
          <tr><td colspan="2" class="answer-cell">{{ app.data.evidence }}</td></tr>
          <tr><th colspan="2" class="question-cell">Dodatkowe uwagi</th></tr>
          <tr><td colspan="2" class="answer-cell">{{ app.data.notes }}</td></tr>
        </table>
        <h2>Zgody</h2>
        <table class="app-table">
          <tr><th>Oświadczenie o prawdziwości danych</th><td>{{ app.data.consentTruth ? 'Tak' : 'Nie' }}</td></tr>
          <tr><th>Zapoznanie z regulaminem</th><td>{{ app.data.consentRules ? 'Tak' : 'Nie' }}</td></tr>
        </table>
      </template>
      <template v-else>
        <h2 v-if="app.data.ic">Informacje IC</h2>
        <table v-if="app.data.ic" class="app-table">
          <tr><th>Imię i nazwisko</th><td>{{ app.data.ic.name }}</td></tr>
          <tr><th>Wiek</th><td>{{ app.data.ic.age }}</td></tr>
          <tr><th>Historia</th><td>{{ app.data.ic.story }}</td></tr>
          <tr><th>Charakter</th><td>{{ app.data.ic.personality }}</td></tr>
          <tr><th>Umiejętności</th><td>{{ app.data.ic.skills }}</td></tr>
          <tr><th>Motywacja</th><td>{{ app.data.ic.motivation }}</td></tr>
        </table>
        <h2 v-if="app.data && (app.data.ooc || app.data.discord)">Informacje OOC</h2>
        <table v-if="app.data && (app.data.ooc || app.data.discord)" class="app-table">
          <tr><th>Nick Discord + ID</th><td>{{ discordField }}</td></tr>
          <template v-if="app.data.ooc">
            <tr>
              <th>Doświadczenie w RP</th>
              <td>{{ app.data.ooc.experience }}</td>
            </tr>
            <tr>
              <th>Zgoda na przetwarzanie danych (Discord ID)</th>
              <td>{{ app.data.consents.data ? 'Tak' : 'Nie' }}</td>
            </tr>
            <tr>
              <th>Znam zasady RP i Akceptuję regulamin serwera</th>
              <td>{{ app.data.consents.rules ? 'Tak' : 'Nie' }}</td>
            </tr>
            <tr>
              <th>Potwierdzam prawdziwość podanych informacji</th>
              <td>{{ app.data.consents.truth ? 'Tak' : 'Nie' }}</td>
            </tr>
          </template>
        </table>
        <h2>Pytania sytuacyjne</h2>
        <table class="app-table">
          <template v-for="(qa, idx) in scenarioPairs" :key="idx">
            <tr>
              <th colspan="2" class="question-cell"><pre>{{ qa.question }}</pre></th>
            </tr>
            <tr>
              <td colspan="2" class="answer-cell"><pre>{{ qa.answer }}</pre></td>
            </tr>
          </template>
        </table>
        <h2 v-if="app.data.extra">Dodatkowo</h2>
        <table v-if="app.data.extra" class="app-table">
          <tr><th>Portfolio</th><td>{{ app.data.extra.portfolio }}</td></tr>
          <tr><th>Frakcja</th><td>{{ app.data.extra.faction }}</td></tr>
        </table>
      </template>
      <div class="decision-box">
        <label for="status-select">Decyzja</label>
        <select id="status-select" v-model="selectedStatus">
          <option v-for="(label, key) in decisionOptions" :key="key" :value="label">
            {{ label }}
          </option>
        </select>
        <textarea
          v-if="selectedStatus === statuses.REJECTED"
          v-model="rejectionReason"
          placeholder="Powód odrzucenia"
          class="reason-input"
          required
        ></textarea>
        <button @click="updateStatus" class="update-btn">Zmień status</button>
        <button
          v-if="app && app.archived"
          @click="unarchive"
          class="archive-btn"
        >
          <i class="fa-solid fa-box-open"></i> Przywróć zgłoszenie
        </button>
        <p v-if="updateMessage" class="update-msg">{{ updateMessage }}</p>
      </div>
      <div v-if="app && app.status === statuses.APPROVED" class="notes-box">
        <h3>
          Notatki Administratora
          <span v-if="adminNotes && !editAdmin" class="edit-icon" @click="editAdmin = true">📝</span>
        </h3>
        <p v-if="adminNotes && !editAdmin" class="notes-text">{{ adminNotes }}</p>
        <textarea
          v-if="!adminNotes || editAdmin"
          v-model="adminNotes"
          class="notes-input"
          placeholder="(Opcjonalnie) Tutaj możesz wpisać swoje spostrzeżenia na temat podania gracza"
        ></textarea>
        <h3>
          Notatki po rozmowie
          <span v-if="interviewNotes && !editInterview" class="edit-icon" @click="editInterview = true">📝</span>
        </h3>
        <p v-if="interviewNotes && !editInterview" class="notes-text">{{ interviewNotes }}</p>
        <textarea
          v-if="!interviewNotes || editInterview"
          v-model="interviewNotes"
          class="notes-input"
          placeholder="(Opcjonalne) Tutaj możesz wpisać swoje spostrzeżenia po rozmowie rekrutacyjnej z graczem"
        ></textarea>
        <button
          v-if="editAdmin || editInterview || !adminNotes || !interviewNotes"
          class="save-notes-btn"
          @click="saveNotes"
        >
          Zapisz notatki
        </button>
      </div>
      <div v-if="app && app.archived" class="archive-extra">
        <p><b>Zarchiwizowane przez:</b> {{ app.archived.by }} - {{ formatDate(app.archived.timestamp) }}</p>
        <div v-if="app.rejectionReason" class="reason-box">
          <h3>Powód odrzucenia</h3>
          <p>{{ app.rejectionReason }}</p>
        </div>
        <div v-if="app.adminNotes" class="reason-box">
          <h3>Notatki Administratora</h3>
          <p class="notes-text">{{ app.adminNotes }}</p>
        </div>
        <div v-if="app.interviewNotes" class="reason-box">
          <h3>Notatki po rozmowie</h3>
          <p class="notes-text">{{ app.interviewNotes }}</p>
        </div>
      </div>
    </div>
    <p v-else>Ładowanie...</p>
  </main>
</template>

<script setup lang="ts">
import { onMounted, ref, computed } from 'vue'
import { useRoute, RouterLink } from 'vue-router'

interface Application {
  id: string
  userId: string
  status: string
  data: any
  type?: string
  history?: { status: string; timestamp: number; by?: string }[]
  rejectionReason?: string
  adminNotes?: string
  interviewNotes?: string
  archived?: { by: string; timestamp: number } | null
}

const route = useRoute()
const app = ref<Application | null>(null)
const currentUser = ref<any>(null)

const backPath = computed(() => {
  const map: Record<string, string> = {
    whitelist: '/admin/applications',
    checker: '/admin/checker-applications',
    moderator: '/admin/moderator-applications',
    administrator: '/admin/administrator-applications',
    developer: '/admin/developer-applications',
    unban: '/admin/unban'
  }
  const type = (route.meta.type as string) || 'whitelist'
  return map[type] || '/admin/applications'
})

const selectedStatus = ref('')
const rejectionReason = ref('')
const adminNotes = ref('')
const interviewNotes = ref('')
const updateMessage = ref('')

const editAdmin = ref(false)
const editInterview = ref(false)

const statuses = {
  SENT: 'Wysłane',
  PENDING: 'Przyjęte, oczekuje na rozpatrzenie',
  IN_REVIEW: 'W trakcie rozpatrywania',
  APPROVED: 'Pozytywnie',
  REJECTED: 'Negatywnie',
  ARCHIVED: 'Zarchiwizowane'
}

const decisionOptions = {
  PENDING: statuses.PENDING,
  IN_REVIEW: statuses.IN_REVIEW,
  APPROVED: statuses.APPROVED,
  REJECTED: statuses.REJECTED
}

onMounted(async () => {
  const userRes = await fetch('/api/user', { credentials: 'include' })
  if (userRes.ok) {
    const userData = await userRes.json()
    currentUser.value = userData.user
  }

  const res = await fetch(`/api/admin/applications/${route.params.id}`, { credentials: 'include' })
  if (res.ok) {
    const data = await res.json()
    app.value = data.application || null

    if (app.value) {
      selectedStatus.value = app.value.status
      rejectionReason.value = app.value.rejectionReason || ''
      adminNotes.value = app.value.adminNotes || ''
      interviewNotes.value = app.value.interviewNotes || ''
      editAdmin.value = !adminNotes.value
      editInterview.value = !interviewNotes.value

      if (app.value.status === statuses.SENT) {
        await updateStatusInternal(statuses.PENDING)
        selectedStatus.value = statuses.PENDING
      }
    }
  }
})

const ts = computed(() => {
  if (!app.value) return 0
  return app.value.history?.[0]?.timestamp || Number(app.value.id)
})

const scenarioPairs = computed(() => {
  if (!app.value) return []
  const qs: string[] = app.value.data.questions || []
  const ans: string[] = app.value.data.scenarios || []
  return qs.map((q, i) => ({ question: q, answer: ans[i] || '' }))
})

const discordField = computed(() => {
  if (!app.value) return ''
  return app.value.data?.ooc?.discord || app.value.data?.discord || ''
})

const statusClass = computed(() => {
  if (!app.value) return ''
  switch (app.value.status) {
    case statuses.SENT: return 'gray'
    case statuses.PENDING: return 'orange'
    case statuses.IN_REVIEW: return 'blue'
    case statuses.APPROVED:
    case 'Rozpatrzone Pozytywnie': return 'green'
    case statuses.REJECTED:
    case 'Rozpatrzone negatywnie':
    case 'Negatywnie (Napisz nowe podanie w ciągu 24/48h)': return 'red'
    case statuses.ARCHIVED: return 'yellow'
    default: return ''
  }
})

function formatDate(t: number) {
  return new Date(t).toLocaleString()
}

function cleanDiscord(d: string) {
  return d.split('#')[0]
}

async function updateStatusInternal(newStatus: string) {
  if (!app.value) return

  await fetch('/api/admin/status', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({
      id: app.value.id,
      userId: app.value.userId,
      type: app.value.type,
      status: newStatus,
      rejectionReason: rejectionReason.value,
      adminNotes: adminNotes.value,
      interviewNotes: interviewNotes.value
    })
  })

  app.value.status = newStatus
  app.value.rejectionReason = newStatus === statuses.REJECTED ? rejectionReason.value : ''
  app.value.adminNotes = adminNotes.value
  app.value.interviewNotes = interviewNotes.value

  if (!app.value.history) app.value.history = []
  const idx = app.value.history.findIndex(h => h.status === newStatus)
  const entry = {
    status: newStatus,
    timestamp: Date.now(),
    by: currentUser.value?.username || 'Admin'
  }

  if (idx >= 0) {
    app.value.history[idx] = entry
  } else {
    app.value.history.push(entry)
  }

  if (newStatus === statuses.APPROVED) {
    app.value.history = app.value.history.filter(h => h.status !== statuses.REJECTED)
  }

  updateMessage.value = 'Status zaktualizowany pomyślnie'
  setTimeout(() => updateMessage.value = '', 3000)
}

async function updateStatus() {
  if (!selectedStatus.value || !app.value) return

  if (selectedStatus.value !== app.value.status) {
    if (selectedStatus.value === statuses.REJECTED && !rejectionReason.value.trim()) {
      window.alert('Powód odrzucenia jest wymagany')
      return
    }

    await updateStatusInternal(selectedStatus.value)
    window.alert(`Status zmieniono na ${selectedStatus.value}`)
  }
}

async function saveNotes() {
  if (!app.value) return

  await updateStatusInternal(app.value.status)
  editAdmin.value = false
  editInterview.value = false
  updateMessage.value = 'Notatki zapisane'
  setTimeout(() => updateMessage.value = '', 3000)
}


async function unarchive() {
  if (!app.value) return
  await fetch(`/api/admin/unarchive/${app.value.id}`, {
    method: 'POST',
    credentials: 'include'
  })
  app.value.archived = null
  if (app.value.history) {
    app.value.history = app.value.history.filter(h => h.status !== statuses.ARCHIVED)
  }
}

const decisionInfo = computed(() => {
  if (!app.value?.history) return ''
  const latest = [...app.value.history].reverse()
    .find(h => h.status === statuses.APPROVED || h.status === statuses.REJECTED)

  if (!latest) return ''
  const date = new Date(latest.timestamp).toLocaleString()
  return `${latest.status} przez ${latest.by || 'Admin'} - ${date}`
})
</script>

<style scoped>
.app-detail-page {
  padding: 2rem;
  min-height: 100vh;
  background: linear-gradient(135deg, #1b1032 0%, #0a0a1a 100%);
  color: #fff;
}

.back-link {
  display: inline-flex;
  align-items: center;
  gap: 0.3rem;
  margin-bottom: 1rem;
  padding: 0.3rem 0.6rem;
  color: #fff;
  background: var(--gradient-accent);
  border-radius: 4px;
  text-decoration: none;
}

.detail-title {
  margin-top: 0;
  margin-bottom: 1rem;
  font-size: 1.6rem;
}

.status-text {
  font-weight: bold;
}

.detail-container {
  max-width: 800px;
  margin: 0 auto;
  background: rgba(0, 0, 0, 0.6);
  padding: 1rem;
  border-radius: 1rem;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.5);
}

.app-table {
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 1rem;
  background: rgba(255, 255, 255, 0.05);
}
.app-table th,
.app-table td {
  border: 1px solid rgba(255, 255, 255, 0.2);
  padding: 0.5rem;
  vertical-align: top;
  word-wrap: break-word;
  white-space: pre-wrap;
}
.app-table th {
  color: #5bc0de;
}
.gray {
  color: gray;
}
.orange {
  color: orange;
}
.blue {
  color: #00aaff;
}
.green {
  color: #00aa00;
}
.red {
  color: #dd0000;
}

.decision-box {
  margin-top: 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  align-items: center;
}
.reason-input {
  width: 100%;
  min-height: 80px;
  border-radius: 6px;
  padding: 0.4rem;
}

#status-select {
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: #ccc;
  border-radius: 6px;
  padding: 0.4rem;
  width: 100%;
}
.update-msg {
  color: #00ff7f;
}
.notes-box {
  margin-top: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}
.edit-icon {
  cursor: pointer;
  margin-left: 0.5rem;
}
.notes-text {
  white-space: pre-wrap;
  background: rgba(255, 255, 255, 0.05);
  padding: 0.4rem;
  border-radius: 6px;
}
.notes-input {
  width: 100%;
  min-height: 80px;
  border-radius: 6px;
  padding: 0.4rem;
}
.save-notes-btn {
  padding: 0.4rem 0.8rem;
  border: 1px solid transparent;
  background: var(--gradient-accent);
  color: #fff;
  border-radius: 4px;
  cursor: pointer;
  align-self: flex-start;
}

.update-btn {
  padding: 0.4rem 0.8rem;
  border: 1px solid transparent;
  background: var(--gradient-accent);
  color: #fff;
  cursor: pointer;
  border-radius: 4px;
}

.archive-btn {
  padding: 0.4rem 0.8rem;
  border: 1px solid transparent;
  background: rgba(255, 165, 0, 0.3);
  color: #fff;
  cursor: pointer;
  border-radius: 4px;
}
.archive-btn.top-right {
  position: absolute;
  top: 0;
  right: 0;
  margin: 0;
}

.archive-extra {
  margin-top: 1.5rem;
}
.archive-extra p {
  margin: 0.2rem 0 1rem;
  color: #ffd700;
}

.archive-btn:hover {
  background: rgba(255, 165, 0, 0.5);
}

.question-cell {
  font-weight: 600;
  white-space: pre-wrap;
}

.question-cell pre,
.answer-cell pre {
  margin: 0;
  white-space: pre-wrap;
  word-break: break-word;
  font-family: inherit;
}

.answer-cell {
  white-space: pre-wrap;
  word-break: break-word;
}
</style>