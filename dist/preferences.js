// Presentation preferences are independent of saved exams and never reshuffle them.
const PREF_KEY='cs-midterm-preferences-v1';
let preferences;
try { preferences=JSON.parse(localStorage.getItem(PREF_KEY))||{}; } catch { preferences={}; }
preferences.language=preferences.language==='zh-Hant'?'zh-Hant':'en';
preferences.theme=['dark','light'].includes(preferences.theme)?preferences.theme:(window.matchMedia?.('(prefers-color-scheme: dark)').matches?'dark':'light');
document.documentElement.dataset.theme=preferences.theme;
document.documentElement.lang=preferences.language;
function persistPreferences(){try{localStorage.setItem(PREF_KEY,JSON.stringify(preferences));}catch{}}
const originalText=new WeakMap(), originalAttributes=new WeakMap();
function translated(text){
 if(preferences.language!=='zh-Hant')return text;
 const space=text.match(/^(\s*)([\s\S]*?)(\s*)$/), s=space[2];
 let z=ZH_PROMPTS[s]||ZH_TERMS[s]||ZH_UI[s];
 if(!z){
  z=s.replace(/^(\d+) \/ (\d+) answered$/,'已作答 $1 / $2 題')
   .replace(/^★ Teacher-provided Q(\d+) · Always included$/,'★ 老師提供 Q$1 · 每次必含')
   .replace(/^Question (\d+) · Teacher-provided Q(\d+)$/,'第 $1 題 · 老師提供 Q$2')
   .replace(/^(\d+) teacher-provided questions \+ (\d+) randomized extra questions on every new attempt\.$/,'每次新練習皆包含 $1 題老師提供題＋$2 題隨機延伸題。')
   .replace(/^(\d+) source-verification questions are excluded from scoring\.$/,'$1 題待核對來源，暫不計分。')
   .replace(/^QUESTION (\d+) \/ UNSCORED — VERIFY SOURCE$/,'第 $1 題／不計分，待核對來源')
   .replace(/^Question (\d+)$/,'第 $1 題')
   .replace(/^QUESTION (\d+) \/ 2 POINTS$/,'第 $1 題／2 分')
   .replace(/^(\d+) questions in the bank · Textbook \+ Chapters 1–8 homework$/,'題庫共 $1 題 · 課本與第 1–8 章作業')
   .replace(/^Multiple choice: (\d+)\/(\d+) · Fill in the blank: (\d+)\/(\d+)$/,'選擇題：$1/$2 · 填充題：$3/$4')
   .replace(/^Teacher core: (\d+)\/(\d+) · Extra practice: (\d+)\/(\d+)$/,'老師重點：$1/$2 · 延伸練習：$3/$4')
   .replace(/^(\d+) fixed teacher-core questions \+ (\d+) randomized extra questions on every new attempt\.$/,'每次新練習皆包含 $1 題固定老師重點＋$2 題隨機延伸題。')
   .replace(/^Part (\d+) · (\d+) questions · (\d+) points$/,'第 $1 部分 · $2 題 · $3 分')
   .replace(/^All (\d+) questions are answered\. Submit and reveal your score and textbook sources\?$/,'$1 題皆已作答。確定交卷並顯示成績與課本來源？')
   .replace(/^Question (\d+) · Teacher-mentioned$/,'第 $1 題 · 老師提到的重點')
   .replace(/^Question (\d+) · Briefing unclear$/,'第 $1 題 · 錄音內容不明確')
   .replace(/^Layer (\d+)$/,'第 $1 層').replace(/^(\d+) bits$/,'$1 位元').replace(/^(\d+) years?$/,'$1 年')
   .replace(/^(\d+) minutes$/,'$1 分鐘')
   .replace(/^You have (\d+) unanswered questions?\. Blank answers receive zero points\. Submit and reveal the answer key\?$/,'還有 $1 題未作答。空白答案為零分。確定交卷並顯示解答？');
  if(s.startsWith('Textbook answer: ')){
   const answer=s.slice(17);z='課本答案：'+(ZH_TERMS[answer]||answer.replace(/\bbytes\b/g,'位元組').replace(/\bbits\b/g,'位元').replace(/\blayers\b/g,'層'));
  }
  if(s.startsWith('Provided answer: '))z='提供的答案：'+s.slice(17);
  // Keep original page numbers and filenames intact for precise source lookup.
  z=z.replace(/Textbook /g,'課本 ').replace(/Homework /g,'作業 ').replace(/PDF p\./g,'PDF 頁').replace(/PDF pp\./g,'PDF 頁').replace(/printed /g,'印刷頁 ').replace(/short answer /g,'簡答題 ').replace(/true\/false /g,'是非題 ').replace(/fill Q/g,'填充題 Q').replace(/MC Q/g,'選擇題 Q').replace(/, adapted/g,'，改編');
 }
 return space[1]+z+space[3];
}
function translatePage(){
 const walker=document.createTreeWalker(document.body,NodeFilter.SHOW_TEXT);
 let n;while(n=walker.nextNode()){
  if(n.parentElement?.closest('script,style,[data-no-translate]'))continue;
  let record=originalText.get(n);
  if(!record||n.nodeValue!==record.rendered)record={source:n.nodeValue};
  const value=translated(record.source);if(n.nodeValue!==value)n.nodeValue=value;
  record.rendered=value;originalText.set(n,record);
 }
 document.querySelectorAll('[placeholder],[title],[aria-label]').forEach(el=>{
  let attrs=originalAttributes.get(el)||{};
  for(const key of ['placeholder','title','aria-label'])if(el.hasAttribute(key)){
   let r=attrs[key];const current=el.getAttribute(key);
   if(!r||current!==r.rendered)r={source:current};
   r.rendered=translated(r.source);if(current!==r.rendered)el.setAttribute(key,r.rendered);attrs[key]=r;
  }
  originalAttributes.set(el,attrs);
 });
}
function setupPreferences(){
 const controls=document.createElement('div');controls.className='preferences';controls.dataset.noTranslate='';
 const language=document.createElement('select');language.id='language';language.setAttribute('aria-label','Language / 語言');
 for(const [value,label] of [['en','English'],['zh-Hant','繁體中文']]){const o=document.createElement('option');o.value=value;o.textContent=label;language.append(o);}
 language.value=preferences.language;
 const theme=document.createElement('button');theme.id='themeToggle';theme.type='button';
 function labels(){const zh=preferences.language==='zh-Hant',dark=preferences.theme==='dark';theme.textContent=dark?(zh?'☀ 淺色模式':'☀ Light mode'):(zh?'☾ 深色模式':'☾ Dark mode');theme.setAttribute('aria-label',zh?'切換深色或淺色模式':'Toggle dark or light mode');theme.setAttribute('aria-pressed',String(dark));}
 language.onchange=()=>{preferences.language=language.value;document.documentElement.lang=language.value;persistPreferences();labels();translatePage();};
 theme.onclick=()=>{preferences.theme=preferences.theme==='dark'?'light':'dark';document.documentElement.dataset.theme=preferences.theme;persistPreferences();labels();};
 controls.append(language,theme);document.querySelector('header').append(controls);labels();translatePage();
 // Only observe application content. Translating an existing text node is idempotent.
 new MutationObserver(translatePage).observe(document.body,{childList:true,subtree:true,characterData:true});
 const nativeConfirm=window.confirm.bind(window);window.confirm=message=>nativeConfirm(translated(message));
}
// Chinese equivalents for translated terms are accepted alongside the existing aliases.
const baseEquivalent=isEquivalent;
isEquivalent=function(q,value){
 if(baseEquivalent(q,value))return true;
 if(q.kind!=='fill'||typeof value!=='string')return false;
 const translatedAliases=(q.accepted||[]).map(a=>ZH_TERMS[a]).filter(Boolean);
 return translatedAliases.some(a=>baseEquivalent({...q,accepted:[a]},value));
};
setupPreferences();
