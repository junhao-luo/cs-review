// Apply the saved palette before the stylesheet paints, including at /cs-review.
try{const p=JSON.parse(localStorage.getItem('cs-midterm-preferences-v1'))||{};document.documentElement.dataset.theme=p.theme|| (window.matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light');}catch{}
if(location.pathname==='/cs-review'||location.pathname.startsWith('/cs-review/')){const base=document.createElement('base');base.href='/cs-review/';document.head.append(base);}
