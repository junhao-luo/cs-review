const fs=require('fs'),vm=require('vm'),assert=require('assert');
const storage=new Map(),document={documentElement:{dataset:{}}};
const c=vm.createContext({document,localStorage:{getItem:k=>storage.get(k),setItem:(k,v)=>storage.set(k,v)},window:{matchMedia:()=>({matches:true})},console});
for(const name of ['questions.js','teacher-core.js','grading.js','localization.js'])vm.runInContext(fs.readFileSync('dist/'+name,'utf8'),c);
vm.runInContext(fs.readFileSync('dist/preferences.js','utf8').replace('setupPreferences();',''),c);
vm.runInContext(`
if(preferences.theme!=='dark')throw Error('Follow system theme');
preferences.language='zh-Hant';persistPreferences();
for(const q of BANK){
 if(!ZH_PROMPTS[q.prompt]||!/[\\u3400-\\u9fff]/.test(translated(q.prompt)))throw Error('Missing translated prompt '+q.id);
 if(q.options&&new Set(q.options.map(translated)).size!==q.options.length)throw Error('Translated option collision '+q.id);
}
if(translated('QUESTION 02 / 2 POINTS')!=='第 02 題／2 分')throw Error('Question label');
if(translated('23 / 50 answered')!=='已作答 23 / 50 題')throw Error('Progress');
const q=BANK.find(q=>q.kind==='fill'&&q.answer==='Keywords');
if(!isEquivalent(q,'關鍵字'))throw Error('Chinese answer equivalent');
if(isEquivalent(q,'網路釣魚'))throw Error('Wrong Chinese answer');
if(translated('30 teacher-provided questions + 30 randomized extra questions on every new attempt.')!=='每次新練習皆包含 30 題老師提供題＋30 題隨機延伸題。')throw Error('Core intro');
if(translated('110 / 110 answered')!=='已作答 110 / 110 題')throw Error('Expanded progress');
if(translated('Part 2 · 81 questions · 162 points')!=='第 2 部分 · 81 題 · 162 分')throw Error('Expanded section');
preferences.language='en';
if(translated('Flag for review')!=='Flag for review')throw Error('English restoration');
`,c);
assert.equal(JSON.parse(storage.get('cs-midterm-preferences-v1')).language,'zh-Hant');
console.log('PASS: all 434 prompts localized; translated choices stay distinct; system dark mode; saved preferences; Chinese grading and English restoration.');
