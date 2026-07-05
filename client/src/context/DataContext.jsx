import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { vaultStore, uid } from '../lib/store'
import { useAuth } from './AuthContext'

const DataContext = createContext(null)

export function DataProvider({ children }) {
  const { user } = useAuth()
  const [data, setData] = useState(null)

  useEffect(() => {
    if (user) setData(vaultStore.load(user.id))
    else setData(null)
  }, [user])

  const persist = (next) => {
    setData(next)
    if (user) vaultStore.save(user.id, next)
  }

  const logActivity = (base, type, text) => {
    const entry = { id: uid(), type, text, at: new Date().toISOString() }
    return { ...base, activity: [entry, ...(base.activity || [])].slice(0, 40) }
  }

  const api = useMemo(() => {
    if (!data) return null
    return {
      data,

      /* Documents */
      addDocument(doc) {
        const item = { id: uid(), createdAt: new Date().toISOString(), ...doc }
        let next = { ...data, documents: [item, ...data.documents] }
        next = logActivity(next, 'upload', `Uploaded “${item.title}”`)
        persist(next)
        return item
      },
      updateDocument(id, patch) {
        const next = { ...data, documents: data.documents.map((d) => (d.id === id ? { ...d, ...patch } : d)) }
        persist(next)
      },
      deleteDocument(id) {
        persist({ ...data, documents: data.documents.filter((d) => d.id !== id) })
      },

      /* Memories */
      addMemory(mem) {
        const item = { id: uid(), createdAt: new Date().toISOString(), ...mem }
        let next = { ...data, memories: [item, ...data.memories] }
        next = logActivity(next, 'memory', `Saved memory “${item.title}”`)
        persist(next)
        return item
      },
      updateMemory(id, patch) {
        persist({ ...data, memories: data.memories.map((m) => (m.id === id ? { ...m, ...patch } : m)) })
      },
      deleteMemory(id) {
        persist({ ...data, memories: data.memories.filter((m) => m.id !== id) })
      },

      /* Contacts */
      addContact(c) {
        const item = { id: uid(), createdAt: new Date().toISOString(), ...c }
        let next = { ...data, contacts: [item, ...data.contacts] }
        next = logActivity(next, 'contact', `Added trusted contact “${item.name}”`)
        persist(next)
        return item
      },
      updateContact(id, patch) {
        persist({ ...data, contacts: data.contacts.map((c) => (c.id === id ? { ...c, ...patch } : c)) })
      },
      deleteContact(id) {
        persist({ ...data, contacts: data.contacts.filter((c) => c.id !== id) })
      },

      /* Capsules */
      addCapsule(c) {
        const item = { id: uid(), createdAt: new Date().toISOString(), ...c }
        let next = { ...data, capsules: [item, ...data.capsules] }
        next = logActivity(next, 'capsule', `Created capsule “${item.title}”`)
        persist(next)
        return item
      },
      updateCapsule(id, patch) {
        persist({ ...data, capsules: data.capsules.map((c) => (c.id === id ? { ...c, ...patch } : c)) })
      },
      deleteCapsule(id) {
        persist({ ...data, capsules: data.capsules.filter((c) => c.id !== id) })
      },

      /* Emergency */
      updateEmergency(patch) {
        persist({ ...data, emergency: { ...data.emergency, ...patch } })
      },

      /* Maintenance */
      reseed() {
        if (user) persist(vaultStore.reseed(user.id))
      },
      resetAll() {
        if (user) persist(vaultStore.reset(user.id))
      },
    }
  }, [data, user]) // eslint-disable-line react-hooks/exhaustive-deps

  return <DataContext.Provider value={api}>{children}</DataContext.Provider>
}

// eslint-disable-next-line react-refresh/only-export-components
export const useData = () => useContext(DataContext)
