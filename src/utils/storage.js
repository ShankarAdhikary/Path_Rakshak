import localforage from 'localforage'

localforage.config({ name: 'AcciGuardAI', storeName: 'acciguard' })

export async function setItem(key, value) {
  try { await localforage.setItem(key, value) } catch (e) { console.warn('storage setItem failed', e) }
}

export async function getItem(key) {
  try { return await localforage.getItem(key) } catch { return null }
}

export async function removeItem(key) {
  try { await localforage.removeItem(key) } catch {}
}
