import re,sys
def hex2rgb(h):
    h=h.lstrip('#'); return tuple(int(h[i:i+2],16)/255 for i in (0,2,4))
def lum(h):
    r,g,b=[c/12.92 if c<=0.03928 else ((c+0.055)/1.055)**2.4 for c in hex2rgb(h)]
    return 0.2126*r+0.7152*g+0.0722*b
def cr(a,b):
    la,lb=lum(a),lum(b); hi,lo=max(la,lb),min(la,lb); return (hi+0.05)/(lo+0.05)
css=open(sys.argv[1]).read()
blocks={}
for m in re.finditer(r'(:root,\s*\.light|\.dark)\s*\{(.*?)\n\}', css, re.S):
    d={}
    for k,v in re.findall(r'(--[\w-]+)\s*:\s*([^;]+);', m.group(2)):
        d[k]=v.strip()
    blocks['light' if 'root' in m.group(1) else 'dark']=d
def get(d,k):
    v=d.get(k,'');
    m=re.match(r'var\((--[\w-]+)\)',v)
    return get(d,m.group(1)) if m else v
for mode,d in blocks.items():
    print(f'\n### {mode}')
    canvas=get(d,'--canvas'); sidebar=get(d,'--sidebar') or canvas; pop=get(d,'--popover') or canvas
    rec=get(d,'--surface-recessed-solid') or canvas
    rows=[('ink/canvas','--ink',canvas),('ink/sidebar','--ink',sidebar),('ink/popover','--ink',pop),('ink/recessed','--ink',rec),
          ('muted-fg/canvas','--muted-foreground',canvas),('muted-fg/sidebar','--muted-foreground',sidebar),
          ('readback/canvas','--readback-foreground',canvas),('subtle/canvas','--subtle-foreground',canvas),('subtle/sidebar','--subtle-foreground',sidebar),
          ('primary/canvas','--primary',canvas),('primary-fg/primary','--primary-foreground',get(d,'--primary')),
          ('timeline/canvas','--timeline-accent',canvas),('file-accent/canvas','--file-accent',canvas),
          ('destructive-text/canvas','--destructive-text',canvas),('destructive-fg/destructive','--destructive-foreground',get(d,'--destructive')),
          ('warning-text/canvas','--warning-text',canvas),('warning/canvas','--warning',canvas),('attention/canvas','--attention',canvas),
          ('success/canvas','--success',canvas),('diff-added/canvas','--diff-added',canvas),('diff-removed/canvas','--diff-removed',canvas),('pr-merged/canvas','--pr-merged',canvas),
          ('border/canvas','--border',canvas),('border-seam/canvas','--border-seam',canvas),('input/canvas','--input',canvas),('sidebar-border/sidebar','--sidebar-border',sidebar)]
    for label,tok,bg in rows:
        fg=get(d,tok)
        if fg.startswith('#') and bg.startswith('#'):
            print(f'{label:28s} {fg} on {bg}  {cr(fg,bg):5.2f}')
    print('-- ansi on canvas / companion fg on ansi')
    for i in range(16):
        c=get(d,f'--ansi-{i}'); f=get(d,f'--ansi-bg-fg-{i}')
        if c.startswith('#'):
            print(f'ansi-{i:<2} {c} on canvas {cr(c,canvas):5.2f}   bg-fg {f} on ansi {cr(f,c):5.2f}')
