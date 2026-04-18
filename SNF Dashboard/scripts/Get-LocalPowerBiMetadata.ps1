Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"

$python = Get-Command python -ErrorAction SilentlyContinue
if ($null -eq $python) {
  throw "Python is required to read the local Chrome history database."
}

$script = @'
import os
import re
import shutil
import sqlite3
import tempfile

src = os.path.expandvars(r'%LOCALAPPDATA%\Google\Chrome\User Data\Default\History')
if not os.path.exists(src):
    print('Chrome history database not found.')
    raise SystemExit(1)

fd, dst = tempfile.mkstemp(suffix='.sqlite')
os.close(fd)
shutil.copy2(src, dst)

conn = sqlite3.connect(dst)
cur = conn.cursor()
rows = cur.execute("""
select url, title, last_visit_time
from urls
where url like '%app.powerbi.com%'
order by last_visit_time desc
limit 100
""").fetchall()

report_hits = []
seen = set()
for url, title, _ in rows:
    report_match = re.search(r'/groups/([0-9a-fA-F-]+)/reports/([0-9a-fA-F-]+)', url)
    dataset_match = re.search(r'/onelake/details/([0-9a-fA-F-]+)/dataset/([0-9a-fA-F-]+)', url)

    if report_match:
        record = (
            report_match.group(1),
            report_match.group(2),
            title or '',
            url
        )
        if record not in seen:
            seen.add(record)
            report_hits.append({
                'kind': 'report',
                'workspace_id': report_match.group(1),
                'item_id': report_match.group(2),
                'title': title or '',
                'url': url,
            })

    if dataset_match:
        record = (
            dataset_match.group(1),
            dataset_match.group(2),
            title or '',
            url
        )
        if record not in seen:
            seen.add(record)
            report_hits.append({
                'kind': 'dataset',
                'workspace_id': dataset_match.group(1),
                'item_id': dataset_match.group(2),
                'title': title or '',
                'url': url,
            })

conn.close()
os.remove(dst)

if not report_hits:
    print('No recent Power BI URLs found in local Chrome history.')
    raise SystemExit(0)

for hit in report_hits:
    print(f"KIND={hit['kind']}")
    print(f"WORKSPACE_ID={hit['workspace_id']}")
    if hit['kind'] == 'report':
        print(f"REPORT_ID={hit['item_id']}")
    else:
        print(f"DATASET_ID={hit['item_id']}")
    print(f"TITLE={hit['title']}")
    print(f"URL={hit['url']}")
    print()
'@

$script | python -
