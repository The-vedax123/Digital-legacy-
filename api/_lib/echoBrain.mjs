/**
 * EchoBrain v2 — a smart, offline, rule-based assistant that reasons over the
 * user's vault when no LLM provider is configured. It uses lightweight token
 * search + intent detection to feel genuinely helpful and warm, so EchoVault
 * works well out-of-the-box with zero API keys.
 */

const STOP = new Set([
  'the', 'a', 'an', 'my', 'me', 'is', 'are', 'am', 'do', 'does', 'i', 'of', 'to', 'in', 'on', 'for', 'with',
  'where', 'what', 'who', 'when', 'which', 'how', 'show', 'find', 'list', 'get', 'give', 'tell', 'can', 'could',
  'you', 'please', 'and', 'or', 'have', 'has', 'about', 'all', 'any', 'it', 'that', 'this', 'need',
])

const tokenize = (s) =>
  (s || '')
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .split(/\s+/)
    .filter(Boolean)

const keywords = (s) => tokenize(s).filter((t) => t.length > 1 && !STOP.has(t))

const daysUntil = (dateStr) => {
  if (!dateStr) return null
  const d = new Date(dateStr)
  if (isNaN(d)) return null
  return Math.ceil((d - new Date()) / (1000 * 60 * 60 * 24))
}

const fmtDate = (dateStr) => {
  const d = new Date(dateStr)
  if (isNaN(d)) return dateStr
  return d.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
}

const scoreText = (tokens, text) => {
  const hay = (text || '').toLowerCase()
  let score = 0
  for (const t of tokens) {
    if (hay.includes(t)) score += t.length >= 4 ? 3 : 1
  }
  return score
}

const search = (query, items, fields) => {
  const tokens = keywords(query)
  if (!tokens.length) return []
  return items
    .map((it) => ({ it, s: scoreText(tokens, fields.map((f) => it[f]).join(' ')) }))
    .filter((x) => x.s > 0)
    .sort((a, b) => b.s - a.s)
    .map((x) => x.it)
}

const has = (q, ...words) => words.some((w) => q.includes(w))

export function echoAnswer(question, context = {}) {
  const raw = (question || '').trim()
  const q = raw.toLowerCase()
  const documents = context.documents || []
  const memories = context.memories || []
  const contacts = context.contacts || []
  const capsules = context.capsules || []

  // — Greetings —
  if (/^(hi|hey|hello|yo|hiya|good (morning|afternoon|evening)|greetings)\b/.test(q)) {
    return {
      text: `Hi there — I'm Echo, your legacy assistant. 🌿\n\nI can help you find documents, track what's expiring, summarize your memories, review who you trust, or keep your vault organized. What would you like to do?`,
    }
  }

  // — Thanks —
  if (has(q, 'thank', 'thanks', 'appreciate', 'cheers')) {
    return { text: `You're very welcome. Protecting what matters to you is exactly what I'm here for. 💚` }
  }

  // — Help / capabilities —
  if (has(q, 'help', 'what can you do', 'capabilities', 'commands', 'how do you work')) {
    return {
      text:
        `Here's how I can help you protect your legacy:\n\n` +
        `• Find things — "Where is my passport?"\n` +
        `• Track expiries — "What expires next year?"\n` +
        `• Browse by type — "Show my business documents"\n` +
        `• Reflect — "Summarize my memories"\n` +
        `• Plan — "Who should be a beneficiary?"\n` +
        `• Tidy up — "Organize my vault"\n\n` +
        `Right now you have ${documents.length} documents, ${memories.length} memories, ${contacts.length} trusted contacts and ${capsules.length} time capsules.`,
    }
  }

  // — Counts / status —
  if (has(q, 'how many', 'count', 'overview', 'status', 'summary of my vault', 'what do i have')) {
    return {
      text:
        `Here's a snapshot of your vault:\n\n` +
        `• 📄 ${documents.length} documents\n• 🖼️ ${memories.length} memories\n• 👥 ${contacts.length} trusted contacts\n• ⏳ ${capsules.length} time capsules\n\n` +
        `Everything is encrypted and stored securely. Ask me about any of these anytime.`,
    }
  }

  // — Expiries / renewals —
  if (has(q, 'expire', 'expiry', 'expiring', 'renew', 'renewal', 'due', 'lapse')) {
    const expiring = documents
      .filter((d) => d.expiryDate)
      .map((d) => ({ ...d, days: daysUntil(d.expiryDate) }))
      .filter((d) => d.days !== null)
      .sort((a, b) => a.days - b.days)
    if (!expiring.length) {
      return { text: `Good news — none of your documents have an expiry date set. Add expiry dates to passports, licenses or insurance policies and I'll warn you before they lapse.` }
    }
    return {
      text:
        `Here's what needs attention, soonest first:\n\n` +
        expiring
          .map((d) => {
            const when = d.days < 0 ? `⚠️ expired ${Math.abs(d.days)} days ago` : d.days <= 60 ? `⏰ in ${d.days} days (${fmtDate(d.expiryDate)})` : `in ${d.days} days (${fmtDate(d.expiryDate)})`
            return `• ${d.title} — ${when}`
          })
          .join('\n') +
        `\n\nWant me to remind a trusted contact about any of these?`,
      refs: expiring.map((d) => d.id),
    }
  }

  // — Organize —
  if (has(q, 'organize', 'organise', 'tidy', 'clean up', 'improve', 'what should i do', 'next steps', 'suggest')) {
    const tips = []
    const noBenef = documents.filter((d) => !d.beneficiary).length
    const noExpiry = documents.filter((d) => ['Passport', 'Insurance', 'National ID'].includes(d.category) && !d.expiryDate).length
    if (!documents.length) tips.push('Upload your first document — a passport, ID or insurance policy is a great start.')
    if (noBenef) tips.push(`Assign beneficiaries to ${noBenef} document${noBenef > 1 ? 's' : ''} so the right people inherit access.`)
    if (noExpiry) tips.push(`Add expiry dates to ${noExpiry} time-sensitive document${noExpiry > 1 ? 's' : ''} so I can remind you.`)
    if (!contacts.length) tips.push('Add at least one Trusted Contact for emergencies.')
    if (!capsules.length) tips.push('Create a Time Capsule — a message for someone you love in the future.')
    if (!memories.length) tips.push('Preserve a memory — a photo, a letter, or a voice note.')
    if (!tips.length) tips.push('Your vault is beautifully organized. 🌟 Consider recording a short voice note for your family, or reviewing beneficiaries once a year.')
    return { text: `Here's how we can make your legacy even stronger:\n\n` + tips.map((s) => `• ${s}`).join('\n') }
  }

  // — Memories / summarize —
  if (has(q, 'summar', 'memories', 'memory', 'photos', 'letters', 'stories', 'voice note')) {
    if (!memories.length) return { text: `Your Memory Vault is empty for now. Add photos, letters, voice notes or stories and I'll weave them into a warm summary you can pass on.` }
    const types = [...new Set(memories.map((m) => m.type))]
    return {
      text:
        `You've preserved ${memories.length} ${memories.length === 1 ? 'memory' : 'memories'} across ${types.length} type${types.length > 1 ? 's' : ''} (${types.join(', ')}).\n\n` +
        `A few highlights:\n` +
        memories.slice(0, 5).map((m) => `• ${m.title}${m.summary ? ` — ${m.summary}` : ''}`).join('\n') +
        `\n\nThese are the moments your loved ones will treasure most. 💚`,
      refs: memories.slice(0, 5).map((m) => m.id),
    }
  }

  // — Beneficiary suggestions —
  if (has(q, 'beneficiar', 'who should', 'inherit', 'leave to', 'give to')) {
    if (!contacts.length) return { text: `Add people to your Trusted Circle first, then I can suggest who's best placed to inherit each asset.` }
    const family = contacts.filter((c) => ['Family', 'Administrator'].includes(c.permission))
    const lawyer = contacts.find((c) => c.permission === 'Lawyer')
    const lines = []
    if (family.length) lines.push(...family.map((c) => `• ${c.name} (${c.relationship}) — well suited for personal & financial documents`))
    if (lawyer) lines.push(`• ${lawyer.name} (${lawyer.relationship}) — ideal for legal & estate documents`)
    if (!lines.length) lines.push(...contacts.map((c) => `• ${c.name} (${c.relationship})`))
    return { text: `Based on your Trusted Circle, here's what I'd suggest:\n\n${lines.join('\n')}` }
  }

  // — Trusted circle / contacts —
  if (has(q, 'trusted', 'contact', 'lawyer', 'family', 'who can', 'who has access', 'circle', 'partner')) {
    if (!contacts.length) return { text: `You haven't added anyone to your Trusted Circle yet. Add the people you trust most and assign each a permission level.` }
    const matches = search(raw, contacts, ['name', 'relationship', 'permission', 'email'])
    const list = matches.length ? matches : contacts
    return {
      text:
        `${matches.length ? 'Here’s who matches' : 'Your Trusted Circle'} (${list.length}):\n\n` +
        list.map((c) => `• ${c.name} — ${c.relationship} · ${c.permission}${c.phone ? ` · ${c.phone}` : ''}`).join('\n'),
      refs: list.map((c) => c.id),
    }
  }

  // — Capsules —
  if (has(q, 'capsule', 'time capsule', 'unlock', 'open in', 'future message', 'birthday message')) {
    if (!capsules.length) return { text: `You have no time capsules yet. Create one to leave a message that unlocks on a birthday, an anniversary, after graduation, or a date you choose.` }
    return {
      text:
        `Your time capsules (${capsules.length}):\n\n` +
        capsules
          .map((c) => {
            const d = daysUntil(c.unlockDate)
            const when = c.unlockType === 'manual' ? 'manual unlock' : d != null && d > 0 ? `unlocks in ${d} days (${fmtDate(c.unlockDate)})` : 'ready to open ✨'
            return `• ${c.title} — for ${c.recipient || 'the future'}, ${when}`
          })
          .join('\n'),
      refs: capsules.map((c) => c.id),
    }
  }

  // — Security / storage —
  if (has(q, 'secure', 'security', 'safe', 'encrypt', 'privacy', 'protected')) {
    return { text: `Your vault is protected with encrypted storage and strict access controls — only the people in your Trusted Circle can reach what you allow, at the permission level you set. You're in control of everything. 🔒` }
  }
  if (has(q, 'storage', 'space', 'how much room', 'full')) {
    return { text: `You're using a small fraction of your secure storage across ${documents.length} documents, ${memories.length} memories and ${capsules.length} capsules. Plenty of room to keep preserving what matters.` }
  }

  // — Category browse —
  const categoryMap = [
    ['passport', 'Passport'],
    ['business', 'Business Documents'],
    ['property', 'Property Documents'],
    ['insurance', 'Insurance'],
    ['medical', 'Medical Records'],
    ['crypto', 'Crypto Information'],
    ['wallet', 'Crypto Information'],
    ['certificate', 'Certificates'],
    ['national id', 'National ID'],
  ]
  const cat = categoryMap.find(([k]) => q.includes(k))
  if (cat && has(q, 'show', 'list', 'my', 'all', 'find', cat[0])) {
    const list = documents.filter((d) => d.category === cat[1] || (d.title + d.description).toLowerCase().includes(cat[0]))
    if (list.length) {
      return {
        text:
          `${cat[1]} (${list.length}):\n\n` +
          list.map((d) => `• ${d.title}${d.beneficiary ? ` — beneficiary: ${d.beneficiary}` : ''}${d.expiryDate ? ` · expires ${fmtDate(d.expiryDate)}` : ''}`).join('\n'),
        refs: list.map((d) => d.id),
      }
    }
    return { text: `You don't have any ${cat[1]} saved yet. Upload one in the Digital Vault and I'll keep track of it for you.` }
  }

  // — General fuzzy search across everything (e.g. "where is my ___") —
  const docHits = search(raw, documents, ['title', 'category', 'description', 'beneficiary'])
  if (docHits.length) {
    const top = docHits.slice(0, 5)
    return {
      text:
        `I found ${docHits.length} document${docHits.length > 1 ? 's' : ''} that might be what you're looking for:\n\n` +
        top
          .map((d) => `• ${d.title} — ${d.category}${d.beneficiary ? ` (beneficiary: ${d.beneficiary})` : ''}${d.description ? `\n  ${d.description}` : ''}`)
          .join('\n'),
      refs: top.map((d) => d.id),
    }
  }
  const memHits = search(raw, memories, ['title', 'description', 'summary', 'type'])
  if (memHits.length) {
    return {
      text: `From your memories:\n\n` + memHits.slice(0, 5).map((m) => `• ${m.title}${m.summary ? ` — ${m.summary}` : ''}`).join('\n'),
      refs: memHits.slice(0, 5).map((m) => m.id),
    }
  }
  const conHits = search(raw, contacts, ['name', 'relationship', 'permission'])
  if (conHits.length) {
    return {
      text: `From your Trusted Circle:\n\n` + conHits.slice(0, 5).map((c) => `• ${c.name} — ${c.relationship} · ${c.permission}`).join('\n'),
      refs: conHits.slice(0, 5).map((c) => c.id),
    }
  }

  // — "Where is" with no match —
  if (has(q, 'where', 'find', 'locate')) {
    return {
      text: `I couldn't find that in your vault yet. Try uploading it in the Digital Vault so I can keep track of it — then ask me again and I'll point you right to it.`,
    }
  }

  // — Fallback —
  return {
    text:
      `I'm here to help you protect and organize your digital legacy. Try asking me:\n\n` +
      `• "Where is my passport?"\n• "What expires next year?"\n• "Show my business documents"\n• "Summarize my memories"\n• "Who should be a beneficiary?"\n• "Organize my vault"\n\n` +
      `You currently have ${documents.length} documents, ${memories.length} memories, ${contacts.length} trusted contacts and ${capsules.length} time capsules.`,
  }
}

/** Auto-suggest a category from a document title. */
export function suggestCategory(title = '') {
  const t = title.toLowerCase()
  const rules = [
    [['passport'], 'Passport'],
    [['national id', 'id card', 'nid', 'identity', 'voter'], 'National ID'],
    [['insurance', 'policy', 'cover', 'assurance'], 'Insurance'],
    [['property', 'deed', 'title', 'house', 'land', 'mortgage', 'lease', 'rent'], 'Property Documents'],
    [['business', 'company', 'invoice', 'contract', 'incorporation', 'tax', 'payroll', 'llc'], 'Business Documents'],
    [['certificate', 'diploma', 'degree', 'award', 'license', 'licence', 'transcript'], 'Certificates'],
    [['medical', 'health', 'prescription', 'report', 'vaccine', 'lab', 'scan', 'doctor'], 'Medical Records'],
    [['crypto', 'wallet', 'bitcoin', 'ethereum', 'seed', 'ledger', 'metamask', 'private key'], 'Crypto Information'],
  ]
  for (const [keys, category] of rules) if (keys.some((k) => t.includes(k))) return category
  return 'Personal Documents'
}

export function summarizeText(title = '', description = '', type = '') {
  const base = description || title
  if (!base) return 'A cherished memory preserved in your vault.'
  const trimmed = base.length > 150 ? base.slice(0, 147) + '…' : base
  const prefix =
    type === 'photo'
      ? 'A captured moment: '
      : type === 'letter'
        ? 'A heartfelt letter: '
        : type === 'voice'
          ? 'A voice recording: '
          : type === 'video'
            ? 'A treasured video: '
            : type === 'achievement'
              ? 'A proud achievement: '
              : 'A memory to keep: '
  return prefix + trimmed
}
