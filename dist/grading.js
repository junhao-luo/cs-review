// Local, deterministic grading: explicit equivalents, never arbitrary substrings.
function compact(value){return String(value??'').normalize('NFKC').toLowerCase().replace(/唯讀/g,'唯讀').replace(/[’']/g,'').replace(/[\s\p{P}\p{S}]/gu,'');}
function numericText(value){const supers='⁰¹²³⁴⁵⁶⁷⁸⁹';return String(value).replace(/(\d+)([⁰¹²³⁴⁵⁶⁷⁸⁹]+)/g,(_,n,e)=>n+'^'+[...e].map(c=>supers.indexOf(c)).join('')).normalize('NFKC').trim().replace(/−/g,'-');}
function numericAnswer(q,raw){
  let s=String(raw).normalize('NFKC').trim().replace(/−/g,'-');
  if(q.base){
    // Interpret only the requested base. Do not accept a different base's digit string.
    const suffix=q.base===2?'(?:₂|_2|\\(2\\)|\\(base\\s*2\\)|base\\s*2|binary)':q.base===16?'(?:₁₆|_16|\\(16\\)|\\(base\\s*16\\)|base\\s*16|hex(?:adecimal)?)':'(?:₈|_8|\\(8\\)|octal)';
    // Subscripts normalize to plain digits, so remove a subscript suffix before NFKC.
    s=String(raw).trim().replace(q.base===2?/₂$/:q.base===16?/₁₆$/:/₈$/,'').normalize('NFKC').toLowerCase();
    s=s.replace(new RegExp('\\s*'+suffix+'\\s*$','i'),'').trim();
    if(q.base===2)s=s.replace(/^0b/i,'');
    if(q.base===16)s=s.replace(/^0x/i,'');
    s=s.replace(/\s+/g,'');
    const valid=q.base===2?/^[01]+(?:\.[01]+)?$/:q.base===16?/^[0-9a-f]+(?:\.[0-9a-f]+)?$/:/^[0-7]+(?:\.[0-7]+)?$/;
    if(!valid.test(s))return false;
    if(q.width&&s.replace('.','').length!==q.width)return false;
    const canonical=v=>{const parts=v.toLowerCase().split('.');return (parts[0].replace(/^0+(?=.)/,'')||'0')+(parts[1]?.replace(/0+$/,'')?'.'+parts[1].replace(/0+$/,''):'');};
    return q.accepted.some(a=>canonical(String(a))===canonical(s));
  }
  if(q.numeric){s=numericText(raw);if(q.accepted.some(a=>numericText(a).toLowerCase()===s.toLowerCase()))return true;if(/^[-+]?\d{1,3}(?:,\d{3})+(?:\.\d+)?$/.test(s))s=s.replace(/,/g,'');const power=s.match(/^(\d+)\s*\^\s*(\d{1,2})$/);if(power){const result=Number(power[1])**Number(power[2]);return Number.isFinite(result)&&q.accepted.some(a=>Number(a)===result);}if(!/^[+-]?(?:\d+(?:\.\d*)?|\.\d+)$/.test(s))return false;return q.accepted.some(a=>Number(a)===Number(s));}
  return null;
}
function isEquivalent(q,value){
  if(value==null||!String(value).trim())return false;
  if(q.kind==='mc')return value===q.correct;
  if(q.literal)return q.accepted.some(a=>String(a).replace(/\s/g,'')===String(value).replace(/\s/g,''));
  const numeric=numericAnswer(q,value);if(numeric===true)return true;
  if(numeric===false&&(q.base||!/[\p{L}]/u.test(String(value))||/\d[.,]\d|^\s*[-−+]/.test(String(value))))return false;
  let raw=String(value).normalize('NFKC').trim();
  // Negation or alternatives containing another concept are not matching formats.
  raw=raw.replace(/^(?:the\s+answer\s+is|answer\s*[:：]|it\s+is|答案[是為为]?\s*[:：]?)\s*/i,'');
  const s=compact(raw),aliases=[...new Set(q.accepted.map(compact))].filter(Boolean).sort((a,b)=>b.length-a.length);
  if(!s)return false;
  if(aliases.includes(s))return true;
  if(/\b(?:not|isnt|isn't|rather than)\b|不是|並非|并非/i.test(raw))return false;
  if(q.parts){const entries=q.parts.flatMap((part,i)=>part.map(a=>[compact(a),1<<i])).sort((a,b)=>b[0].length-a[0].length),all=(1<<q.parts.length)-1,memo=new Map();
    function parts(pos,mask){if(pos===s.length)return mask===all;const key=pos+':'+mask;if(memo.has(key))return memo.get(key);memo.set(key,false);for(const [a,bit] of entries)if(s.startsWith(a,pos)&&parts(pos+a.length,mask|bit))return true;for(const join of ['and','or','及','和','與'])if(pos&&s.startsWith(join,pos)&&parts(pos+join.length,mask))return true;return false;}
    return parts(0,0);}
  if(q.ordered)return false;
  // Fully segment a bilingual / abbreviation combination into approved aliases.
  // Every character must be accounted for; ROM + RAM does not pass ROM grading.
  const connectors=['and','or','also','aka','也稱為','又稱','即','或','和','及'];
  const memo=new Map();
  function consume(pos,count){if(pos===s.length)return count>0;if(count>8)return false;const k=pos+':'+count;if(memo.has(k))return memo.get(k);let ok=false;
    for(const a of aliases){if(s.startsWith(a,pos)&&consume(pos+a.length,count+1)){ok=true;break;}}
    if(!ok&&count>0)for(const c of connectors){if(s.startsWith(c,pos)&&pos+c.length<s.length&&consume(pos+c.length,count)){ok=true;break;}}
    memo.set(k,ok);return ok;}
  return consume(0,0);
}
