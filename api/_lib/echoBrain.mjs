/**
 * EchoBrain — a lightweight, rule-based fallback "AI" that reasons over the
 * user's vault context when the Gemini API is not configured.
 *
 * It is intentionally friendly, concise and demo-ready so EchoVault feels
 * complete even without external API keys.
 */

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

export function echoAnswer(question, context = {}) {
  const q = (question || '').toLowerCase().trim()
  const documents = context.documents || []
  const memories = context.memories || []
  const contacts = context.contacts || []
  const capsules = context.capsules || []

  const matchDocs = (terms) =>
    documents.filter((d) => {
      const hay = `${d.title || ''} ${d.category || ''} ${d.description || ''}`.toLowerCase()
      return terms.some((t) => hay.includes(t))
    })

  // Where is my <thing>?
  if (q.includes('where') || q.includes('find') || q.includes('locate')) {
    const keywords = ['passport', 'id', 'insurance', 'property', 'business', 'certificate', 'medical', 'crypto', 'wallet', 'will', 'deed', 'license']
    const hit = keywords.find((k) => q.includes(k))
    if (hit) {
      const found = matchDocs([hit, hit === 'wallet' ? 'crypto' : hit])
      if (found.length) {
        return {
          text:
            `I found ${found.length} item${found.length > 1 ? 's' : ''} matching "${hit}":\n\n` +
            found
              .map(
                (d) =>
                  `• ${d.title} — ${d.category}${d.beneficiary ? ` (Beneficiary: ${d.beneficiary})` : ''}${
                    d.description ? `\n  ${d.description}` : ''
                  }`,
              )
              .join('\n'),
          refs: found.map((d) => d.id),
        }
      }
      return {
        text: `I couldn't find anything tagged "${hit}" in your vault yet. Try uploading it in the Digital Vault so I can keep track of it and remind you when it matters.`,
      }
    }
  }

  // What expires next year / soon?
  if (q.includes('expire') || q.includes('renew') || q.includes('expiry')) {
    const expiring = documents
      .filter((d) => d.expiryDate)
      .map((d) => ({ ...d, days: daysUntil(d.expiryDate) }))
      .filter((d) => d.days !== null)
      .sort((a, b) => a.days - b.days)
    if (!expiring.length) {
      return { text: 'None of your documents have an expiry date set. Add expiry dates to passports, licenses or insurance and I will remind you before they lapse.' }
    }
    return {
      text:
        `Here's what needs attention, soonest first:\n\n` +
        expiring
          .map((d) => {
            const when = d.days < 0 ? `expired ${Math.abs(d.days)} days ago` : `in ${d.days} days (${fmtDate(d.expiryDate)})`
            return `• ${d.title} — ${when}`
          })
          .join('\n'),
      refs: expiring.map((d) => d.id),
    }
  }

  // Show business / category documents
  if (q.includes('business') || q.includes('show') || q.includes('list')) {
    const catMap = ['business', 'property', 'insurance', 'medical', 'crypto', 'certificate', 'personal', 'passport']
    const cat = catMap.find((c) => q.includes(c))
    const list = cat ? matchDocs([cat]) : documents
    if (!list.length) return { text: `You don't have any ${cat || ''} documents stored yet.` }
    return {
      text:
        `${cat ? cat[0].toUpperCase() + cat.slice(1) : 'All'} documents (${list.length}):\n\n` +
        list.map((d) => `• ${d.title} — ${d.category}`).join('\n'),
      refs: list.map((d) => d.id),
    }
  }

  // Summarize memories
  if (q.includes('summar') || q.includes('memories') || q.includes('memory')) {
    if (!memories.length) return { text: 'Your Memory Vault is empty. Add photos, letters, voice notes or stories and I will weave them into a summary.' }
    const types = [...new Set(memories.map((m) => m.type))]
    return {
      text:
        `You've preserved ${memories.length} memories across ${types.length} type${types.length > 1 ? 's' : ''} (${types.join(', ')}).\n\n` +
        `Highlights:\n` +
        memories.slice(0, 4).map((m) => `• ${m.title}${m.summary ? ` — ${m.summary}` : ''}`).join('\n') +
        `\n\nThese are the moments your loved ones will treasure most.`,
    }
  }

  // Organize vault
  if (q.includes('organize') || q.includes('organise') || q.includes('clean')) {
    const suggestions = []
    const missingBenef = documents.filter((d) => !d.beneficiary).length
    const missingExpiry = documents.filter((d) => ['Passport', 'Insurance', 'National ID'].includes(d.category) && !d.expiryDate).length
    if (missingBenef) suggestions.push(`Assign beneficiaries to ${missingBenef} document${missingBenef > 1 ? 's' : ''} so the right people inherit access.`)
    if (missingExpiry) suggestions.push(`Add expiry dates to ${missingExpiry} time-sensitive document${missingExpiry > 1 ? 's' : ''}.`)
    if (!contacts.length) suggestions.push('Add at least one Trusted Contact so someone can access your vault in an emergency.')
    if (!capsules.length) suggestions.push('Create your first Time Capsule — a message for someone you love in the future.')
    if (!suggestions.length) suggestions.push('Your vault is beautifully organized. Consider recording a voice note for your family.')
    return { text: `Here's how we can make your legacy even stronger:\n\n` + suggestions.map((s) => `• ${s}`).join('\n') }
  }

  // Beneficiary suggestion
  if (q.includes('beneficiar') || q.includes('who should')) {
    if (!contacts.length) return { text: 'Add people to your Trusted Circle first, then I can suggest who should inherit each asset.' }
    const family = contacts.filter((c) => ['Family', 'Administrator'].includes(c.permission))
    return {
      text:
        `Based on your Trusted Circle, I'd suggest:\n\n` +
        (family.length
          ? family.map((c) => `• ${c.name} (${c.relationship}) — great fit for personal & financial documents`).join('\n')
          : contacts.map((c) => `• ${c.name} (${c.relationship})`).join('\n')),
    }
  }

  // Greeting / fallback
  if (q.includes('hello') || q.includes('hi ') || q === 'hi' || q.includes('hey')) {
    return {
      text: `Hi, I'm Echo — your personal legacy assistant. I can help you find documents, track what's expiring, summarize your memories, and keep your vault organized. What would you like to do?`,
    }
  }

  return {
    text:
      `I'm here to help you protect and organize your digital legacy. Try asking me things like:\n\n` +
      `• "Where is my passport?"\n• "What expires next year?"\n• "Show my business documents"\n• "Summarize my memories"\n• "Organize my vault"\n\n` +
      `You currently have ${documents.length} documents, ${memories.length} memories, ${contacts.length} trusted contacts and ${capsules.length} time capsules.`,
  }
}

/** Auto-suggest a category from a document title. */
export function suggestCategory(title = '') {
  const t = title.toLowerCase()
  const rules = [
    [['passport'], 'Passport'],
    [['national id', 'id card', 'nid', 'identity'], 'National ID'],
    [['insurance', 'policy', 'cover'], 'Insurance'],
    [['property', 'deed', 'title', 'house', 'land', 'mortgage'], 'Property Documents'],
    [['business', 'company', 'invoice', 'contract', 'incorporation'], 'Business Documents'],
    [['certificate', 'diploma', 'degree', 'award'], 'Certificates'],
    [['medical', 'health', 'prescription', 'report', 'vaccine'], 'Medical Records'],
    [['crypto', 'wallet', 'bitcoin', 'ethereum', 'seed', 'ledger'], 'Crypto Information'],
  ]
  for (const [keys, cat] of rules) {
    if (keys.some((k) => t.includes(k))) return cat
  }
  return 'Personal Documents'
}

export function summarizeText(title = '', description = '', type = '') {
  const base = description || title
  if (!base) return 'A cherished memory preserved in your vault.'
  const trimmed = base.length > 140 ? base.slice(0, 137) + '…' : base
  const prefix =
    type === 'photo' ? 'A captured moment: ' : type === 'letter' ? 'A heartfelt letter: ' : type === 'voice' ? 'A voice recording: ' : 'A memory: '
  return prefix + trimmed
}
