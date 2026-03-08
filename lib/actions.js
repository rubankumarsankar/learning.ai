'use server';
import { promises as fs } from 'fs';
import { revalidatePath } from 'next/cache';
import path from 'path';

const DB_PATH = path.join(process.cwd(), 'data/db.json');

// Helper: Read the local JS/JSON file
async function getRawData() {
  try {
    const file = await fs.readFile(DB_PATH, 'utf8');
    return JSON.parse(file || '[]');
  } catch (error) {
    if (error.code === 'ENOENT') {
      return [];
    }
    throw error;
  }
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
  await fs.writeFile(DB_PATH, JSON.stringify(data, null, 2));
  revalidatePath('/'); // Modern Next.js: Updates UI without refresh
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
  await fs.writeFile(DB_PATH, JSON.stringify(updated, null, 2));
  revalidatePath('/');
}

// Module: Reset all progress
export async function resetTracker() {
  const data = await getRawData();
  const updated = data.map(item => ({
    ...item,
    status: "⬜ To-Do",
    date: "" // Clear dates
  }));
  await fs.writeFile(DB_PATH, JSON.stringify(updated, null, 2));
  revalidatePath('/');
}

// Module: Set start date (Tomorrow)
export async function setStartDate() {
  const data = await getRawData();
  
  // Calculate tomorrow's date
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  
  // Iterate through all items and assign sequential dates
  const updated = data.map((item, index) => {
    const itemDate = new Date(tomorrow);
    itemDate.setDate(tomorrow.getDate() + index); // Day 1 is tomorrow, Day 2 is next day, etc.
    return {
      ...item,
      date: itemDate.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })
    };
  });
  
  await fs.writeFile(DB_PATH, JSON.stringify(updated, null, 2));
  revalidatePath('/');
}
