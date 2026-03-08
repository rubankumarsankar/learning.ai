'use server';
import { promises as fs } from 'fs';
import { revalidatePath } from 'next/cache';
import path from 'path';

// Bundled read-only data (always available)
const BUNDLED_DB = path.join(process.cwd(), 'data/db.json');
// Writable path: /tmp on Vercel, local file otherwise
const WRITABLE_DB = process.env.VERCEL ? '/tmp/db.json' : BUNDLED_DB;

// Helper: Ensure writable copy exists (Vercel only)
async function ensureWritable() {
  if (!process.env.VERCEL) return;
  try {
    await fs.access(WRITABLE_DB);
  } catch {
    // First request: copy bundled data to /tmp
    const data = await fs.readFile(BUNDLED_DB, 'utf8');
    await fs.writeFile(WRITABLE_DB, data);
  }
}

// Helper: Read the data
async function getRawData() {
  await ensureWritable();
  try {
    const file = await fs.readFile(WRITABLE_DB, 'utf8');
    return JSON.parse(file || '[]');
  } catch (error) {
    if (error.code === 'ENOENT') {
      return [];
    }
    throw error;
  }
}

// Helper: Write data
async function saveData(data) {
  await ensureWritable();
  await fs.writeFile(WRITABLE_DB, JSON.stringify(data, null, 2));
  revalidatePath('/');
}

// Module: Add a new entry
export async function createEntry(formData) {
  const data = await getRawData();
  const newEntry = {
    id: Date.now(),
    topic: formData.get('topic'),
    status: "⬜ To-Do",
    date: new Date().toLocaleDateString()
  };

  data.push(newEntry);
  await saveData(data);
}

// Module: Update status
export async function toggleStatus(id) {
  const data = await getRawData();
  const updated = data.map(item => {
    if (item.id === id) {
      if (item.status === "⬜ To-Do") return { ...item, status: "🚀 In Progress" };
      if (item.status === "🚀 In Progress") return { ...item, status: "✅ Done" };
      if (item.status === "✅ Done") return { ...item, status: "🚩 Review Needed" };
      return { ...item, status: "⬜ To-Do" };
    }
    return item;
  });
  await saveData(updated);
}

// Module: Reset all progress
export async function resetTracker() {
  const data = await getRawData();
  const updated = data.map(item => ({
    ...item,
    status: "⬜ To-Do",
    date: "" // Clear dates
  }));
  await saveData(updated);
}

// Module: Set start date (Tomorrow)
export async function setStartDate() {
  const data = await getRawData();

  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);

  const updated = data.map((item, index) => {
    const itemDate = new Date(tomorrow);
    itemDate.setDate(tomorrow.getDate() + index);
    return {
      ...item,
      date: itemDate.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })
    };
  });

  await saveData(updated);
}
