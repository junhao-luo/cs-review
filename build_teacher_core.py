"""Curated coverage of the instructor's recorded exam briefing, not an exam key."""
import json
from pathlib import Path
bank=json.loads(Path('bank.json').read_text(encoding='utf8'))
indices=[1,2,3,4,5,6,7,8,10,11,12,14,15,18,20,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,42,43,44,46,47,48,49,50,51,52,53,54,55,56,58,60,61,64,65,66,67,68,69,70,71,72,73,74,75,76,77,78,21,22,23,40,41,45,257,258,259,282,284,286,365]
# Exact events, wording, variants, or checked table rows were not recoverable.
unclear={10,21,22,23,40,41,45,50,52,54,61,64,74,75,76,77,78,365}
manifest=[]
for i in indices:
    q=bank[i]
    manifest.append({'id':q['id'],'status':'unclear' if i in unclear else 'mentioned','prompt':q['prompt'],'source':q['source']})
new=[]
for source_index,identifier,prompt,accepted in [
    (0,'teacher-turing-fill','What is the hypothetical computing machine proposed by Alan Turing called?',['Turing Machine','Turing machine','圖靈機']),
    (9,'teacher-ssd-fill','What does SSD stand for?',['Solid-State Drive','Solid State Drive','SSD','固態硬碟']),
    (13,'teacher-switch-fill','At which OSI layer does a switch operate in the textbook?',['2','Layer 2','Data link layer','資料連結層','第二層']),
    (14,'teacher-router-fill','At which OSI layer does a router operate?',['3','Layer 3','Network layer','網路層','第三層'])]:
    original=bank[source_index]
    q={**original,'id':identifier,'kind':'fill','prompt':prompt,'accepted':accepted,'group':identifier}
    q.pop('options',None);q.pop('correct',None)
    new.append(q);manifest.append({'id':identifier,'status':'mentioned','prompt':prompt,'source':q['source']})
Path('teacher-core.json').write_text(json.dumps(manifest,ensure_ascii=False,indent=2)+'\n',encoding='utf8')
script='// Fixed reconstructions mapped to the teacher briefing; exact exam wording is not guaranteed.\n'
script+='const TEACHER_CORE='+json.dumps(manifest,ensure_ascii=False)+';\n'
script+='BANK.push(...'+json.dumps(new,ensure_ascii=False)+');\n'
script+='const TEACHER_BY_ID=new Map(TEACHER_CORE.map(q=>[q.id,q]));\n'
script+='function teacherInfo(q){return TEACHER_BY_ID.get(q.id)||null;}\n'
script+='const EXTRA_COUNT=30, ATTEMPT_SIZE=TEACHER_CORE.length+EXTRA_COUNT;\n'
Path('dist/teacher-core.js').write_text(script,encoding='utf8')
print(f'{len(manifest)} fixed questions ({sum(q["status"]=="mentioned" for q in manifest)} clear, {sum(q["status"]=="unclear" for q in manifest)} unclear) + 30 random extras = {len(manifest)+30}')
