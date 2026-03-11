'use server';

import { signIn, signOut } from '@/lib/auth';
import prisma from '@/lib/db';
import bcrypt from 'bcryptjs';
import { redirect } from 'next/navigation';

export async function loginAction(formData) {
  const email = formData.get('email');
  const password = formData.get('password');

  try {
    await signIn('credentials', {
      email,
      password,
      redirect: false,
    });
  } catch (error) {
    return { error: 'Invalid email or password' };
  }

  redirect('/');
}

export async function signupAction(formData) {
  const name = formData.get('name');
  const email = formData.get('email');
  const password = formData.get('password');
  const confirmPassword = formData.get('confirmPassword');

  if (password !== confirmPassword) {
    return { error: 'Passwords do not match' };
  }

  if (password.length < 6) {
    return { error: 'Password must be at least 6 characters' };
  }

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    return { error: 'Email already registered' };
  }

  const hashedPassword = await bcrypt.hash(password, 12);

  await prisma.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
    },
  });

  // Auto-create default categories for the new user
  const user = await prisma.user.findUnique({ where: { email } });

  const defaultCategories = [
    { name: 'Salary', type: 'income', icon: '💰', color: '#10b981' },
    { name: 'Freelance', type: 'income', icon: '💻', color: '#3b82f6' },
    { name: 'Bonus', type: 'income', icon: '🎉', color: '#f59e0b' },
    { name: 'Cashback', type: 'income', icon: '💸', color: '#8b5cf6' },
    { name: 'Rent', type: 'expense', icon: '🏠', color: '#ef4444' },
    { name: 'Groceries', type: 'expense', icon: '🛒', color: '#f97316' },
    { name: 'Transport', type: 'expense', icon: '🚗', color: '#06b6d4' },
    { name: 'Utilities', type: 'expense', icon: '⚡', color: '#eab308' },
    { name: 'Food & Dining', type: 'expense', icon: '🍕', color: '#ec4899' },
    { name: 'Entertainment', type: 'expense', icon: '🎬', color: '#a855f7' },
    { name: 'Shopping', type: 'expense', icon: '🛍️', color: '#14b8a6' },
    { name: 'Health', type: 'expense', icon: '🏥', color: '#f43f5e' },
    { name: 'Education', type: 'expense', icon: '📚', color: '#6366f1' },
    { name: 'Subscriptions', type: 'expense', icon: '📱', color: '#d946ef' },
    { name: 'Insurance', type: 'expense', icon: '🛡️', color: '#0ea5e9' },
    { name: 'EMI', type: 'expense', icon: '🏦', color: '#be123c' },
    { name: 'Transfer', type: 'transfer', icon: '🔄', color: '#64748b' },
    { name: 'Savings', type: 'savings', icon: '🐷', color: '#22c55e' },
    { name: 'Investment', type: 'savings', icon: '📈', color: '#0d9488' },
  ];

  await prisma.category.createMany({
    data: defaultCategories.map((cat) => ({
      userId: user.id,
      ...cat,
    })),
  });

  try {
    await signIn('credentials', {
      email,
      password,
      redirect: false,
    });
  } catch {}

  redirect('/');
}

export async function logoutAction() {
  await signOut({ redirect: false });
  redirect('/login');
}
