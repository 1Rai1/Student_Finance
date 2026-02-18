require('dotenv').config();

const key = process.env.FIREBASE_PRIVATE_KEY;

console.log('Raw value type:', typeof key);
console.log('Contains \\n literally:', key.includes('\\n'));
console.log('Contains real newline:', key.includes('\n'));

const parsed = key.replace(/\\n/g, '\n');
console.log('Starts with:', parsed.slice(0, 27));
console.log('Ends with:', parsed.slice(-26));
console.log('Line count:', parsed.split('\n').length);