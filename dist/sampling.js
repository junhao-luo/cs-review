function shuffled(array,rng=Math.random){const a=array.slice();for(let i=a.length-1;i>0;i--){const j=Math.floor(rng()*(i+1));[a[i],a[j]]=[a[j],a[i]];}return a;}
function drawExam(bank,exposure={},rng=Math.random){
  const selected=[],used=new Set();
  function candidates(kind,chapter,origin){return bank.filter(q=>q.kind===kind&&(!chapter||q.chapter===chapter)&&(!origin||q.origin===origin)&&!used.has(q.group));}
  function take(kind,chapter,origin){let pool=shuffled(candidates(kind,chapter,origin),rng);if(!pool.length)return false;
    // Prefer less-seen concepts, with a little randomness within exposure tiers.
    pool.sort((a,b)=>(exposure[a.group]||0)-(exposure[b.group]||0));
    const q=pool[0];selected.push(JSON.parse(JSON.stringify(q)));used.add(q.group);return true;}
  // Guarantee at least one homework-derived item from each chapter.
  for(const ch of shuffled([1,2,3,4,5,6,7,8],rng)){
    const kind=ch%2?'mc':'fill';
    if(!take(kind,ch,'homework'))if(!take(kind==='mc'?'fill':'mc',ch,'homework'))throw Error('Missing chapter homework');
  }
  for(const ch of shuffled([1,2,3,4,5,6,7,8],rng))for(const kind of ['mc','fill']){
    const quota=kind==='mc'?2:3;
    while(selected.filter(q=>q.kind===kind&&q.chapter===ch).length<quota){if(!take(kind,ch))break;}
  }
  for(const [kind,total] of [['mc',20],['fill',30]])while(selected.filter(q=>q.kind===kind).length<total){if(!take(kind))throw Error('Insufficient distinct questions');}
  const result=[...shuffled(selected.filter(q=>q.kind==='mc'),rng),...shuffled(selected.filter(q=>q.kind==='fill'),rng)];
  result.forEach(q=>{if(q.kind==='mc'){const correct=q.options[q.correct];q.options=shuffled(q.options,rng);q.correct=q.options.indexOf(correct);}});
  return result;
}
