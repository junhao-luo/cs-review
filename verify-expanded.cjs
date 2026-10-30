const fs=require('fs'),vm=require('vm');
const storage=new Map(),nodes=new Map();
const document={getElementById(id){if(!nodes.has(id))nodes.set(id,{});return nodes.get(id);}};
const context=vm.createContext({document,localStorage:{getItem:k=>storage.get(k)||null,setItem:(k,v)=>storage.set(k,v)},console});
for(const file of ['questions.js','teacher-core.js','grading.js','sampling.js','app.js'])vm.runInContext(fs.readFileSync('dist/'+file,'utf8'),context);
vm.runInContext(`
function check(ok,message){if(!ok)throw Error(message);}
const rom=BANK.find(q=>q.kind==='fill'&&q.accepted.includes('ROM'));
for(const a of ['Read Only Memory (唯讀記憶體)','Read-Only Memory','ROM','唯讀記憶體','ROM / Read Only Memory / 唯讀記憶體','The answer is Read Only Memory (唯讀記憶體)'])check(isEquivalent(rom,a),'ROM equivalent: '+a);
for(const a of ['RAM','RAM or ROM','not ROM','ROM is not RAM','ROM plus RAM','','Read Only Memory RAM'])check(!isEquivalent(rom,a),'Reject wrong/conflicting ROM: '+a);
for(const q of BANK){check(q.source&&q.chapter>=1&&q.chapter<=8,'Source and chapter');if(q.kind==='fill'){for(const a of q.accepted)check(isEquivalent(q,a),'Rejects own alias: '+q.id+' '+a);}else{check(q.options.length===new Set(q.options).size,'Duplicate MC options');check(isEquivalent(q,q.correct),'MC correct mapping');}check(!isEquivalent(q,null),'Blank answer marked correct');}
const binary=BANK.find(q=>q.id==='hw-sm-fill');
for(const a of ['10010110','1001 0110','0b10010110','10010110₂','10010110 (base 2)'])check(isEquivalent(binary,a),'Binary format: '+a);
check(!isEquivalent(binary,'1001011'),'Reject wrong width');check(!isEquivalent(binary,'10010110₂ RAM'),'Reject mixed numeric garbage');
const hex=BANK.find(q=>q.id==='hw-d7-fill');for(const a of ['D7','d7','0xD7','D7₁₆','D7 (16)'])check(isEquivalent(hex,a),'Hex format: '+a);
const kb=BANK.find(q=>q.accepted?.[0]==='1024');check(isEquivalent(kb,'1,024'),'Comma grouping');check(isEquivalent(kb,'1024.0'),'Equivalent number');check(!isEquivalent(kb,'102.4'),'Decimal punctuation must not be discarded');check(!isEquivalent(kb,'-1024'),'Sign must not be discarded');
const ieee=BANK.find(q=>q.id==='hw-ieeevalue-fill');check(isEquivalent(ieee,'−5.000'),'Negative numeric equivalent');check(!isEquivalent(ieee,'5'),'Wrong sign');
const layer=BANK.find(q=>q.id==='bridge-fill');check(isEquivalent(layer,'Layer 2 (資料連結層)'),'Bilingual layer');check(!isEquivalent(layer,'Layer 2 (網路層)'),'Conflicting layer');
const ordered=BANK.find(q=>q.id==='hw-unitorder-fill');check(isEquivalent(ordered,'KB < MB < GB < TB'),'Ordered format');check(!isEquivalent(ordered,'TB GB MB KB'),'Wrong order');
let seen={},sets=new Set();for(let n=0;n<100;n++){const exam=drawExam(BANK,seen);check(exam.length===ATTEMPT_SIZE,'Expanded attempt size');check(TEACHER_CORE.every(core=>exam.filter(q=>q.id===core.id).length===1),'Every core question exactly once');check(exam.filter(q=>!teacherInfo(q)).length===30,'30 extras');const extras=exam.filter(q=>!teacherInfo(q));check(extras.filter(q=>q.kind==='mc').length===15,'15 extra MC');check(extras.filter(q=>q.kind==='fill').length===15,'15 extra fill');check(new Set(extras.map(q=>q.group)).size===30,'No repeated extra concepts');check(new Set(exam.map(q=>q.id)).size===exam.length,'No repeated IDs');check(new Set(exam.map(q=>q.chapter)).size===8,'Every chapter covered');check(exam.filter(q=>q.origin==='homework').length>=5,'Homework minimum');sets.add(exam.map(q=>q.id).sort().join(','));exam.forEach(q=>seen[q.group]=(seen[q.group]||0)+1);let score=0;exam.forEach(q=>{if(isEquivalent(q,q.kind==='mc'?q.correct:q.accepted[0]))score+=2;});check(score===ATTEMPT_SIZE*2,'Perfect score after option shuffling');}
check(sets.size===100,'Fresh question sets');
for(let n=0;n<20;n++){const exam=drawExam(BANK);check(exam.filter(q=>q.origin==='homework').length>=8,'Eight homework questions');for(let ch=1;ch<=8;ch++)check(exam.some(q=>q.chapter===ch&&q.origin==='homework'),'Chapter '+ch+' homework represented');}
const memoryPair=BANK.find(q=>q.id==='h3-memorytypes-fill');check(isEquivalent(memoryPair,'ROM and RAM'),'Either-order multi-concept response');check(isEquivalent(memoryPair,'Random Access Memory (RAM) / 唯讀記憶體 (ROM)'),'Bilingual multi-concept response');check(!isEquivalent(memoryPair,'RAM'),'Reject missing component');
const brute=BANK.find(q=>q.id==='h8-bruteforce-fill');check(isEquivalent(brute,'26³'),'Superscript exponent');check(isEquivalent(brute,'26^3'),'Caret exponent');check(!isEquivalent(brute,'263'),'Superscript must not flatten to 263');
localStorage.setItem(KEY,JSON.stringify({version:1,answers:Array(50).fill(null),flags:Array(50).fill(false),submitted:true}));
const migrated=load();check(migrated.version===2&&migrated.questions.length===50,'Legacy migration');check(isEquivalent(migrated.questions[35],'Read Only Memory (唯讀記憶體)'),'Legacy ROM corrected');
state={version:3,questions:drawExam(BANK),answers:Array(ATTEMPT_SIZE).fill(null),flags:Array(ATTEMPT_SIZE).fill(false),overrides:{}};QUESTIONS=state.questions;state.answers[0]=0;save();const resumed=load();check(JSON.stringify(resumed.questions)===JSON.stringify(QUESTIONS),'Resume keeps exact questions and option order');check(resumed.answers[0]===0,'Resume keeps choice zero');
const fi=QUESTIONS.findIndex(q=>q.kind==='fill');state.answers[fi]='unlisted paraphrase';check(!correct(QUESTIONS[fi],state.answers[fi]),'Unknown paraphrase not falsely accepted');state.overrides[fi]=true;check(correct(QUESTIONS[fi],state.answers[fi]),'Self-assessment applied');state.overrides[fi]=false;check(!correct(QUESTIONS[fi],state.answers[fi]),'Self-assessment reversible');
state.flags[ATTEMPT_SIZE-1]=true;state.answers[ATTEMPT_SIZE-1]='tail answer';save();check(load().flags[ATTEMPT_SIZE-1]&&load().answers[ATTEMPT_SIZE-1]==='tail answer','Save and resume beyond old question limit');
console.log('PASS: '+BANK.length+' sourced questions; all accepted aliases; bilingual ROM regression; multi-part answers; base notation, signs and decimals; 100 fresh balanced exams; homework in all eight chapters; perfect grading; stable resume and legacy migration; reversible self-assessment.');
`,context);
