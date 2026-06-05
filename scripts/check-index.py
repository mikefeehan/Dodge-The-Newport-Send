from pathlib import Path
import re, subprocess, tempfile
html = Path('web/index.html').read_text()
scripts = re.findall(r'<script>(.*?)</script>', html, flags=re.S)
if not scripts:
    raise SystemExit('No inline scripts found in web/index.html')
with tempfile.NamedTemporaryFile('w', suffix='.js', delete=False) as f:
    f.write('\n;\n'.join(scripts))
    path = f.name
subprocess.run(['node', '--check', path], check=True)
print(f'Checked {len(scripts)} inline script block(s) from web/index.html')
