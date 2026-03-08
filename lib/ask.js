"use server";

import { promises as fs } from 'fs';
import path from 'path';

export async function handleAsk(query) {
  if (!query || typeof query !== 'string') return [];

  // 1. Basic Tokenization: Lowercase, remove punctuation, keep words > 2 chars
  const queryWords = query
    .toLowerCase()
    .replace(/[^\w\s]/g, '')
    .split(/\s+/)
    .filter(w => w.length > 2);

  if (queryWords.length === 0) return [];

  const results = [];
  const cwd = process.cwd();

  // Helper function to scan a directory of JSONs
  async function scanDirectory(dirPath, typePrefix) {
    try {
      const files = await fs.readdir(dirPath);
      for (const file of files) {
        if (!file.endsWith('.json')) continue;

        try {
          const rawData = await fs.readFile(path.join(dirPath, file), 'utf8');
          const data = JSON.parse(rawData);
          
          let score = 0;
          const titleText = (data.title || '').toLowerCase();
          const contentText = (data.content || '').toLowerCase();
          
          // Boost score if keyword in title vs content
          for (const word of queryWords) {
            if (titleText.includes(word)) score += 5;
            if (contentText.includes(word)) score += 1;
            
            // Plural/singular fuzzy match naive approach
            if (word.endsWith('s')) {
              const singular = word.slice(0, -1);
              if (titleText.includes(singular)) score += 3;
              if (contentText.includes(singular)) score += 1;
            }
          }

          if (score > 0) {
            const id = file.replace('.json', '');
            let url = '';
            let displayType = '';
            
            if (typePrefix === 'day') {
              url = `/day/${id}`;
              displayType = `Day ${id} Lesson`;
            } else if (typePrefix === 'resources') {
              url = `/resources/${id}`;
              displayType = 'Library Resource';
            }

            // Generate a clean text excerpt
            let cleanDesc = '';
            if (data.content) {
              cleanDesc = data.content.replace(/[#*`\n\\]/g, ' ').substring(0, 160).trim() + '...';
            }

            results.push({
              id,
              type: displayType,
              title: data.title || 'Untitled',
              url,
              score,
              excerpt: cleanDesc
            });
          }
        } catch (e) {
          // Skip malformed JSONs quietly
          continue;
        }
      }
    } catch (e) {
      console.warn(`Could not read directory ${dirPath}`);
    }
  }

  // 2. Scan both databases
  await scanDirectory(path.join(cwd, 'data', 'lessons'), 'day');
  await scanDirectory(path.join(cwd, 'data', 'resources'), 'resources');

  // 3. Sort by relevance descending, limit to top 5
  results.sort((a, b) => b.score - a.score);
  return results.slice(0, 5);
}
