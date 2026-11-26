// RumahHitung — state: muat data contoh, simpan perubahan di localStorage,
// dan hitung SEMUA total dari transaksi. Tidak ada total yang disimpan:
// setiap angka di layar adalah hasil hitung ulang dari data mentah.

import { SEED } from "./data.js";

const KEY = "rumahhitung-v1";

export function rupiah(n) {
  return "Rp " + Math.round(n).toLocaleString("id-ID");
}

export function loadState() {
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed && Array.isArray(parsed.transactions) && Array.isArray(parsed.categories)) return parsed;
    }
  } catch (_) { /* rusak: jatuh ke data contoh */ }
  return structuredClone(SEED);
}

export function saveState(state) {
  try { localStorage.setItem(KEY, JSON.stringify(state)); } catch (_) { /* mode privat: tetap jalan */ }
}

export function resetState() {
  try { localStorage.removeItem(KEY); } catch (_) {}
  return structuredClone(SEED);
}

// --- Hitungan turunan: satu-satunya tempat total dihitung. ---
export function spentByCategory(state) {
  const out = {};
  for (const c of state.categories) out[c.id] = 0;
  for (const [/* day */, /* merchant */, cat, amount] of state.transactions) {
    if (out[cat] === undefined) out[cat] = 0;
    out[cat] += amount;
  }
  return out;
}

export function totals(state) {
  const spent = spentByCategory(state);
  const byGroup = { needs: { budgeted: 0, spent: 0 }, wants: { budgeted: 0, spent: 0 }, save: { budgeted: 0, spent: 0 } };
  for (const c of state.categories) {
    byGroup[c.group].budgeted += c.budgeted;
    byGroup[c.group].spent += spent[c.id] || 0;
  }
  const budgeted = byGroup.needs.budgeted + byGroup.wants.budgeted + byGroup.save.budgeted;
  const spentTotal = byGroup.needs.spent + byGroup.wants.spent + byGroup.save.spent;
  const unassigned = state.income - budgeted;
  const over = Math.max(0, spentTotal - budgeted);
  const cashLeft = state.income - spentTotal;
  const unpaidBills = state.bills.filter((b) => !b.paid).reduce((s, b) => s + b.amount, 0);
  const safeToSpend = cashLeft - unpaidBills;
  const overCats = state.categories
    .map((c) => ({ ...c, spent: spent[c.id] || 0 }))
    .filter((c) => c.spent > c.budgeted);
  return { spent, byGroup, budgeted, spentTotal, unassigned, over, cashLeft, unpaidBills, safeToSpend, overCats };
}

// Tagihan 1–15 Desember (bulan depan, jumlah sama, tanggal sama).
export function decemberBills(state) {
  return state.bills.filter((b) => b.day <= 15).reduce((s, b) => s + b.amount, 0);
}

// --- Aksi pengguna: semuanya mengubah data lalu menyimpan. ---
export function addTransaction(state, day, merchant, cat, amount) {
  state.transactions.push([day, merchant, cat, amount]);
  state.transactions.sort((a, b) => a[0] - b[0]);
  saveState(state);
  return state;
}

export function moveMoney(state, fromId, toId, amount) {
  const from = state.categories.find((c) => c.id === fromId);
  const to = state.categories.find((c) => c.id === toId);
  if (!from || !to || fromId === toId || amount <= 0) return false;
  const moved = Math.min(amount, from.budgeted);
  from.budgeted -= moved;
  to.budgeted += moved;
  saveState(state);
  return moved;
}

export function toggleBill(state, index) {
  const bill = state.bills[index];
  if (!bill) return false;
  bill.paid = !bill.paid;
  saveState(state);
  return true;
}

// --- Utang: simulasi pelunasan bulan demi bulan. ---
// Tiap bulan: bunga berjalan, bayar minimum semua utang, sisa uang
// (sampai Rp 1.000.000/bulan) dilempar ke utang pertama sesuai urutan.
// Snowball = saldo terkecil dulu; avalanche = bunga tertinggi dulu.
export function payoffSimulation(state, method) {
  const debts = state.debts.map((d) => ({ ...d }));
  debts.sort((a, b) => (method === "snowball" ? a.balance - b.balance : b.rate - a.rate));
  let months = 0;
  let interest = 0;
  const monthly = state.debtMonthly;
  while (debts.some((d) => d.balance > 0) && months < 600) {
    months += 1;
    for (const d of debts) {
      if (d.balance <= 0) continue;
      const i = (d.balance * d.rate) / 12;
      d.balance += i;
      interest += i;
    }
    let budget = monthly;
    for (const d of debts) {
      if (d.balance <= 0 || budget <= 0) continue;
      const pay = Math.min(d.minPayment, d.balance, budget);
      d.balance -= pay;
      budget -= pay;
    }
    for (const d of debts) {
      if (d.balance <= 0 || budget <= 0) continue;
      const pay = Math.min(d.balance, budget);
      d.balance -= pay;
      budget -= pay;
    }
  }
  return { months, interest: Math.round(interest), order: debts.map((d) => d.name) };
}

export function monthsToGoal(goal) {
  if (goal.monthly <= 0) return null;
  return Math.ceil((goal.target - goal.saved) / goal.monthly);
}

export function toCSV(state) {
  const lines = ["tanggal,penjual,kategori,jumlah_rp"];
  const names = Object.fromEntries(state.categories.map((c) => [c.id, c.name]));
  for (const [day, merchant, cat, amount] of state.transactions) {
    const safe = '"' + String(merchant).replace(/"/g, '""') + '"';
    lines.push(`${day},${safe},"${names[cat] || cat}",${amount}`);
  }
  return lines.join("\n");
}
