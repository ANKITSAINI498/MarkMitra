export function downloadText(name,text,type='text/plain'){const blob=new Blob([text],{type});const a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download=name;a.click();setTimeout(()=>URL.revokeObjectURL(a.href),1000)}
export function safeName(name){return (name||'document').replace(/[^a-z0-9._-]+/gi,'-').replace(/^-+|-+$/g,'')||'document'}
