"""Import exactly the user's authoritative 30-item list; no inferred teacher topics."""
import json,re
from pathlib import Path
bank=json.loads(Path('bank.json').read_text(encoding='utf8'))
text=Path('teacher-provided.txt').read_text(encoding='utf-8-sig')
items=re.findall(r'問題 (\d+)：(.*?)\n─+\n答案：(.*?)\n─+\n解釋：(.*?)(?=\n=+|\Z)',text,re.S)
assert [int(x[0]) for x in items]==list(range(1,31))
specs=[
 ('What is the main character encoding used for Internet communication?',['UTF-8','UTF8'],52),
 ('What is the basic encoding unit of UTF-8?',['8 bits','8','8-bit','1 Byte','1 byte','8 位元','一個位元組'],6),
 ('What carries transmissions between the microprocessor and RAM?',['Bus','匯流排'],53),
 ('What core technology does EasyCard use?',['RFID','Radio Frequency Identification','Radio-Frequency Identification','無線射頻辨識','射頻辨識'],11),
 ('What algorithm underlies the TCP/IP Internet layer?',['Dijkstra','Dijkstra algorithm','Dijkstra 演算法','最短路徑演算法'],None),
 ('What is the core principle of TCP transport-layer congestion control?',['AIMD','Additive Increase Multiplicative Decrease','加性增加乘性減少'],None),
 ('Which network-model layer transmits packets?',['Network layer','Layer 3','3','網路層','第三層'],12),
 ('At which network-model layer does a router operate?',['Network layer','Layer 3','3','網路層','第三層'],14),
 ('In Taiwan Internet culture, what institution does an IP address beginning with 140 represent?',[],None),
 ('What service delivery method does YouTube use?',['Video streaming','Streaming','影音串流服務','影音串流','串流服務','串流'],None),
 ('What provider supplies Internet access to the public?',['ISP','Internet Service Provider','網際網路服務供應商','網際網路服務提供者'],None),
 ('Apart from blocking attacks, what are a firewall’s core basic functions?',['Packet filtering and access control','Packet filtering','Access control','封包過濾與存取控制','封包過濾','存取控制'],18),
 ('What core theoretical computing invention did Alan Turing introduce?',['Turing Machine','圖靈機'],0),
 ('Why does a 1 TB hard drive show about 931 GB in Windows?',['Decimal TB versus binary GiB','Decimal and binary units','Decimal binary unit difference','十進位 TB 與二進位 GiB 的計量差異','十進位與二進位的單位差異','十進位與二進位換算差異','1000 與 1024 的換算差異'],None),
 ('When were the world’s first commercial paid Internet services for the general public introduced?',[],None),
 ('Which early Microsoft operating system preceded widespread Windows use and underpinned early Windows?',['MS-DOS','MSDOS','Microsoft Disk Operating System','DOS','微軟磁碟作業系統'],41),
 ('Which Taiwanese semiconductor company attracted attention for building a US factory in 2022?',['TSMC','Taiwan Semiconductor Manufacturing Company','台積電','臺積電'],50),
 ('What was the first independent formal computing association?',['ACM','Association for Computing Machinery','資訊學會','美國計算機學會','計算機協會'],24),
 ('What core image-quality limitation can make an image look blurry?',['Low Image Resolution','Low resolution','Insufficient resolution','Resolution','影像解析度不足','解析度不足','解析度太低','解析度'],29),
 ('What character encoding is commonly used for WWW pages?',['UTF-8','UTF8'],52),
 ('What type of drive is commonly bought for modern computers?',['SSD','Solid-State Drive','Solid State Drive','固態硬碟'],9),
 ('What is starting a fully powered-off computer with the power button called?',['Cold Boot','Cold booting','冷開機','開機','Boot','Booting'],38),
 ('What type of address is used in operating-system memory mapping?',['Virtual Address','Logical Address','虛擬位址','邏輯位址','虚拟地址','逻辑地址'],39),
 ('At which network-model layer does a switch operate?',['Data Link Layer','Layer 2','2','資料鏈結層','資料連結層','第二層'],13),
 ('What are a mobile base station’s coverage area and the action of switching base stations called?',['Cell Handover','Cell Handoff','蜂巢區 交遞','小區 交接','細胞群 交遞'],None),
 ('What security tool checks whether data has been altered?',['Hash Function','Cryptographic hash function','雜湊函數','密碼學的雜湊函數'],46),
 ('Which command, other than ipconfig, looks up domain names and their corresponding IP addresses?',['nslookup'],44),
 ('What technology, purpose, and service are used when opening a web page?',['Web Browser HTTP WWW','Web Browser HTTPS WWW','瀏覽器 HTTP 全球資訊網','瀏覽器 HTTPS 全球資訊網'],None),
 ('What English service name refers to hosting code and collaborating through Git version control?',['GitHub'],None),
 ('When are keys used for digital signatures, and how does this differ from confidentiality encryption?',['Private key signs public key verifies','Sign with private key verify with public key','私鑰簽署公鑰驗證','私鑰簽章公鑰驗章','私密金鑰簽署公開金鑰驗證'],None)
]
new=[];manifest=[];zh={}
for (number,original,answer,explanation),(prompt,accepted,source_index) in zip(items,specs):
 n=int(number);identifier=f'provided-{n:02d}'
 source=f'Teacher-provided 30-question list, Q{n:02d}'
 if source_index is not None:source+='; Related textbook reference: '+bank[source_index]['source']
 q={'id':identifier,'kind':'fill','prompt':prompt,'accepted':accepted,'answer':answer.strip(),'explanation':explanation.strip(),'source':source,'chapter':{1:2,2:2,3:3,4:3,5:6,6:6,7:5,8:5,9:6,10:7,11:6,12:8,13:1,14:2,15:1,16:4,17:1,18:1,19:2,20:2,21:3,22:3,23:4,24:5,25:5,26:8,27:6,28:7,29:7,30:8}[n],'origin':'teacher-provided','group':identifier,'teacherNumber':n}
 if n in [5,9,15]:q['manualReview']=True
 if n==25:q['parts']=[['Cell','蜂巢區','小區','細胞群'],['Handover','Handoff','交遞','交接']]
 if n==28:q['parts']=[['Web Browser','Browser','瀏覽器'],['HTTP','HTTPS','HTTP HTTPS'],['WWW','World Wide Web','全球資訊網']]
 if n==30:q['parts']=[['Private key signs','Sign with private key','私鑰簽署','私鑰簽章','私密金鑰簽署'],['Public key verifies','Verify with public key','公鑰驗證','公鑰驗章','公開金鑰驗證']]
 new.append(q);manifest.append({'id':identifier,'status':'provided','number':n,'prompt':prompt,'originalPrompt':original.strip(),'source':source})
 zh[prompt]=original.strip()
Path('teacher-core.json').write_text(json.dumps(manifest,ensure_ascii=False,indent=2)+'\n',encoding='utf8')
Path('teacher-prompts-zh.json').write_text(json.dumps(zh,ensure_ascii=False,indent=2)+'\n',encoding='utf8')
script='// Exactly the 30 questions supplied by the user; no inference from the old recording.\n'
script+='const TEACHER_CORE='+json.dumps(manifest,ensure_ascii=False)+';\nBANK.push(...'+json.dumps(new,ensure_ascii=False)+');\n'
script+='const TEACHER_BY_ID=new Map(TEACHER_CORE.map(q=>[q.id,q]));\nfunction teacherInfo(q){return TEACHER_BY_ID.get(q.id)||null;}\n'
script+='const EXTRA_COUNT=30, ATTEMPT_SIZE=TEACHER_CORE.length+EXTRA_COUNT;\n'
Path('dist/teacher-core.js').write_text(script,encoding='utf8')
print('Exactly 30 supplied questions + 30 random extras = 60; Q5, Q9, Q15 retained unscored pending verification.')
