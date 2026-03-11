'use server';

import db from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';
import { revalidatePath } from 'next/cache';
import { promises as fs } from 'fs';
import path from 'path';

const ALLOWED_LEARNING_EMAILS = [
  'srirubankumar@gmail.com',
  // Add more emails here to grant learning access
];

// Helper: Check if user is allowed to access learning
export async function isLearningAllowed() {
  const user = await getCurrentUser();
  if (!user) return false;
  return ALLOWED_LEARNING_EMAILS.includes(user.email);
}

// Helper: Seed learning tasks from db.json if empty
export async function seedLearningTasksIfEmpty(userId) {
  const uid = parseInt(userId);
  const existingCount = await db.learningTask.count({
    where: { userId: uid }
  });

  if (existingCount === 0) {
    const BUNDLED_DB = path.join(process.cwd(), 'data/db.json');
    try {
      const fileData = await fs.readFile(BUNDLED_DB, 'utf8');
      const baseTasks = JSON.parse(fileData);
      
      const tasksToCreate = baseTasks.map(task => ({
        userId: uid,
        lessonId: task.lessonId || task.id,
        phase: task.phase || null,
        topic: task.topic,
        status: task.status || "⬜ To-Do",
        date: task.date || null
      }));

      await db.learningTask.createMany({ data: tasksToCreate });
    } catch (error) {
      console.error("Failed to seed learning tasks:", error);
    }
  }
}

// Get User's Learning Tasks
export async function getLearningTasks() {
  const user = await getCurrentUser();
  if (!user) return [];
  if (!ALLOWED_LEARNING_EMAILS.includes(user.email)) return [];

  await seedLearningTasksIfEmpty(user.id);

  return db.learningTask.findMany({
    where: { userId: parseInt(user.id) },
    orderBy: { lessonId: 'asc' }
  });
}

// Create a new task
export async function createEntry(formData) {
  const user = await getCurrentUser();
  if (!user || !ALLOWED_LEARNING_EMAILS.includes(user.email)) throw new Error("Unauthorized");

  const maxLesson = await db.learningTask.findFirst({
    where: { userId: parseInt(user.id) },
    orderBy: { lessonId: 'desc' }
  });
  
  const nextLessonId = maxLesson && maxLesson.lessonId ? maxLesson.lessonId + 1 : 1;

  await db.learningTask.create({
    data: {
      userId: parseInt(user.id),
      lessonId: nextLessonId,
      phase: "Custom",
      topic: formData.get('topic'),
      status: "⬜ To-Do",
      date: new Date().toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })
    }
  });

  revalidatePath('/learn');
}

// Toggle task status
export async function toggleStatus(id) {
  const user = await getCurrentUser();
  if (!user || !ALLOWED_LEARNING_EMAILS.includes(user.email)) throw new Error("Unauthorized");

  const taskId = parseInt(id);
  const task = await db.learningTask.findUnique({ where: { id: taskId } });
  if (!task || task.userId !== parseInt(user.id)) throw new Error("Not found");

  let newStatus = "⬜ To-Do";
  if (task.status === "⬜ To-Do") newStatus = "🚀 In Progress";
  else if (task.status === "🚀 In Progress") newStatus = "✅ Done";
  else if (task.status === "✅ Done") newStatus = "🚩 Review Needed";

  await db.learningTask.update({
    where: { id: taskId },
    data: { status: newStatus }
  });

  revalidatePath('/learn');
}

// Delete a task
export async function deleteTask(id) {
  const user = await getCurrentUser();
  if (!user || !ALLOWED_LEARNING_EMAILS.includes(user.email)) throw new Error("Unauthorized");

  const taskId = parseInt(id);
  const task = await db.learningTask.findUnique({ where: { id: taskId } });
  if (!task || task.userId !== parseInt(user.id)) throw new Error("Not found");

  await db.learningTask.delete({ where: { id: taskId } });
  revalidatePath('/learn');
}

// Update task topic
export async function updateTopic(id, formData) {
  const user = await getCurrentUser();
  if (!user || !ALLOWED_LEARNING_EMAILS.includes(user.email)) throw new Error("Unauthorized");

  const taskId = parseInt(id);
  const task = await db.learningTask.findUnique({ where: { id: taskId } });
  if (!task || task.userId !== parseInt(user.id)) throw new Error("Not found");

  const newTopic = formData.get('topic');
  if (!newTopic) throw new Error("Topic is required");

  await db.learningTask.update({
    where: { id: taskId },
    data: { topic: newTopic }
  });

  revalidatePath('/learn');
}

// Reset all progress
export async function resetTracker() {
  const user = await getCurrentUser();
  if (!user || !ALLOWED_LEARNING_EMAILS.includes(user.email)) throw new Error("Unauthorized");

  await db.learningTask.updateMany({
    where: { userId: parseInt(user.id) },
    data: { status: "⬜ To-Do", date: null }
  });

  revalidatePath('/learn');
}

// Set start date (Tomorrow)
export async function setStartDate() {
  const user = await getCurrentUser();
  if (!user || !ALLOWED_LEARNING_EMAILS.includes(user.email)) throw new Error("Unauthorized");

  const tasks = await db.learningTask.findMany({
    where: { userId: parseInt(user.id) },
    orderBy: { lessonId: 'asc' }
  });

  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);

  const updatePromises = tasks.map((task, index) => {
    const itemDate = new Date(tomorrow);
    itemDate.setDate(tomorrow.getDate() + index);
    const dateString = itemDate.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
    
    return db.learningTask.update({
      where: { id: task.id },
      data: { date: dateString }
    });
  });

  await db.$transaction(updatePromises);
  revalidatePath('/learn');
}
