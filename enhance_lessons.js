const fs = require('fs');
const path = require('path');

const lessonsDir = path.join(__dirname, 'data', 'lessons');

const getKeywords = (text, title) => {
    // 1. Extract bold words (often core concepts)
    const boldMatches = [...text.matchAll(/\*\*([^*]+)\*\*/g)];
    let keywords = boldMatches.map(m => m[1].replace(':', '').trim()).filter(k => k.length > 2 && k.length < 25 && k.toLowerCase() !== 'theory' && k.toLowerCase() !== 'setup steps');
    
    // 2. Supplement with major words from the title
    if (keywords.length < 3) {
        const titleWords = title.split(' ').map(w => w.replace(/[^a-zA-Z]/g, '')).filter(w => w.length > 3);
        keywords = [...keywords, ...titleWords];
    }
    
    // De-dupe and strictly limit to top 4 badges
    return [...new Set(keywords)].slice(0, 4);
};

const getTakeaways = (text) => {
    // 1. Extract natural markdown bullet points 
    const bulletMatches = [...text.matchAll(/-\s+(.*)/g)];
    let bullets = bulletMatches.map(m => m[1].replace(/\*\*/g, '').trim());
    
    // 2. If no bullet points exist, safely extract the first few sentences
    if (bullets.length === 0) {
        const cleanText = text.replace(/#+.*\n/g, '').replace(/\*\*/g, ''); // Strip headers and bold marks
        const sentences = cleanText.split(/[.?!]\s/).filter(s => s.length > 25 && s.length < 120);
        bullets = sentences.slice(0, 3).map(s => s.trim() + (s.endsWith('.') ? '' : '.'));
    }
    
    return bullets.slice(0, 3);
}

let enhancedCount = 0;

for (let i = 1; i <= 240; i++) {
    const file = path.join(lessonsDir, `${i}.json`);
    if (fs.existsSync(file)) {
        let content = fs.readFileSync(file, 'utf8');
        try {
            let data = JSON.parse(content);
            
            // Only generate if not already fully enhanced, or overwrite to standardize
            const extractedKeywords = getKeywords(data.content || "", data.title || "");
            const extractedTakeaways = getTakeaways(data.content || "");
            
            data.keywords = extractedKeywords.length > 0 ? extractedKeywords : ["Daily Concept", "Core Theory"];
            data.keyTakeaways = extractedTakeaways.length > 0 ? extractedTakeaways : [
                "Review the provided code sandbox to understand execution flow.", 
                "Attempt all practice questions without looking at the answers.",
                "Reference the Crack the Interview library for deeper technical syntax."
            ];
            
            fs.writeFileSync(file, JSON.stringify(data, null, 2));
            enhancedCount++;
        } catch (e) {
            console.error(`Failed to parse JSON for Day ${i}: ${e.message}`);
        }
    }
}

console.log(`Successfully enhanced ${enhancedCount} lessons with dynamic Keywords and TL;DR Key Takeaways!`);
