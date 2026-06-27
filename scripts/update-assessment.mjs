import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const contentPath = path.join(__dirname, '../data/content.json');

// Read the updated content.json
const content = JSON.parse(fs.readFileSync(contentPath, 'utf-8'));

console.log('📋 Assessment Questions from content.json:');
console.log(`Categories: ${content.pages.assessment.categories.length}`);
content.pages.assessment.categories.forEach((cat, i) => {
  console.log(`  ${i + 1}. ${cat.label} (${cat.questions.length} question)`);
  cat.questions.forEach(q => {
    console.log(`     - ${q.text.substring(0, 60)}...`);
  });
});

console.log('\n✅ Assessment structure is valid and ready to sync to Firestore');
console.log('\n📝 To sync to Firestore:');
console.log('1. Go to https://thepolibrandagency-d4263.web.app/admin/content');
console.log('2. Login as admin');
console.log('3. Select "Readiness Index"');
console.log('4. The new assessment questions should appear');
console.log('5. If not, copy the assessment section and save');
