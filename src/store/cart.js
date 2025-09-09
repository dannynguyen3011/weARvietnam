import { create } from 'zustand'

export const useCart = create((set, get) => ({
  items: [],
  add(item) {
    const exists = get().items.find(i => i.id === item.id)
    if (exists) {
      set({ items: get().items.map(i => i.id === item.id ? { ...i, qty: i.qty + (item.qty || 1) } : i) })
    } else {
      set({ items: [...get().items, { ...item, qty: item.qty || 1 }] })
    }
  },
  remove(id) { set({ items: get().items.filter(i => i.id !== id) }) },
  updateQty(id, qty) { set({ items: get().items.map(i => i.id === id ? { ...i, qty } : i) }) },
  clear() { set({ items: [] }) },
  total() { return get().items.reduce((s, i) => s + i.price * i.qty, 0) }
}))