import json
from pathlib import Path
exec(Path('translate_bank.py').read_text(encoding='utf8'))
def pairs(name):
    return dict(line.split('|',1) for line in Path(name).read_text(encoding='utf8').splitlines() if line)
terms=pairs('terms-zh.txt')
ui=pairs('ui-zh.txt')
prompts.update({'What is the hypothetical computing machine proposed by Alan Turing called?':'Alan Turing 提出的假想計算機器稱為什麼？'})
ui.update(json.loads(Path('teacher-ui-zh.json').read_text(encoding='utf8')))
out='const ZH_PROMPTS='+json.dumps(prompts,ensure_ascii=False)+';\nconst ZH_TERMS='+json.dumps(terms,ensure_ascii=False)+';\nconst ZH_UI='+json.dumps(ui,ensure_ascii=False)+';\n'
Path('dist/localization.js').write_text(out,encoding='utf8')
Path('dist/zh-prompts.json').unlink(missing_ok=True)
page=Path('dist/index.html')
html=page.read_text(encoding='utf8')
if 'src="preferences.js"' not in html:
    html=html.replace('<script src="app.js"></script>','<script src="localization.js"></script><script src="app.js"></script><script src="preferences.js"></script>')
    page.write_text(html,encoding='utf8')
if '// Apply the saved palette' not in html:
    html=html.replace('<link rel="stylesheet"','<script src="'+('boot.js')+'"></script><link rel="stylesheet"')
    # The bootstrap itself must resolve correctly even without a trailing slash.
    html=html.replace('<script src="boot.js"></script>', '<script>'+Path('dist/boot.js').read_text(encoding='utf8')+'</script>')
    page.write_text(html,encoding='utf8')
print(f'Localized {len(prompts)} unique question prompts and {len(terms)} terms.')
