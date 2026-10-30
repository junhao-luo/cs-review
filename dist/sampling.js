function shuffled(array,rng=Math.random){const a=array.slice();for(let i=a.length-1;i>0;i--){const j=Math.floor(rng()*(i+1));[a[i],a[j]]=[a[j],a[i]];}return a;}
function drawExam(bank,exposure={},rng=Math.random){
 const selected=TEACHER_CORE.map(entry=>{const q=bank.find(q=>q.id===entry.id);if(!q)throw Error('Missing teacher question '+entry.id);return JSON.parse(JSON.stringify(q));});
 const used=new Set(selected.map(q=>q.group)),prompts=new Set(selected.map(q=>q.prompt));
 function take(chapter,origin,kind){
  const pool=shuffled(bank.filter(q=>!teacherInfo(q)&&!used.has(q.group)&&!prompts.has(q.prompt)&&(!chapter||q.chapter===chapter)&&(!origin||q.origin===origin)&&(!kind||q.kind===kind)),rng);
  pool.sort((a,b)=>(exposure[a.group]||0)-(exposure[b.group]||0));if(!pool.length)return false;
  const q=pool[0];selected.push(JSON.parse(JSON.stringify(q)));used.add(q.group);prompts.add(q.prompt);return true;
 }
 for(const ch of shuffled([1,2,3,4,5,6,7,8],rng))if(!take(ch,'homework'))throw Error('Missing additional homework');
 for(const kind of ['mc','fill'])while(selected.slice(TEACHER_CORE.length).filter(q=>q.kind===kind).length<15){if(!take(null,null,kind))throw Error('Insufficient extras');}
 const result=[...shuffled(selected.filter(q=>q.kind==='mc'),rng),...shuffled(selected.filter(q=>q.kind==='fill'),rng)];
 result.forEach(q=>{if(q.kind==='mc'){const correct=q.options[q.correct];q.options=shuffled(q.options,rng);q.correct=q.options.indexOf(correct);}});return result;
}
