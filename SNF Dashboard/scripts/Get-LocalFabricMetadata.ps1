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
where url like '%app.fabric.microsoft.com%' or url like '%app.powerbi.com/onelake/details/%'
order by last_visit_time desc
limit 200
""").fetchall()

hits = []
seen = set()

patterns = [
    ('fabric_lakehouse', re.compile(r'/groups/([0-9a-fA-F-]+)/lakehouses/([0-9a-fA-F-]+)', re.I)),
    ('fabric_eventhouse', re.compile(r'/groups/([0-9a-fA-F-]+)/eventhouses?/([0-9a-fA-F-]+)', re.I)),
    ('fabric_kql_database', re.compile(r'/groups/([0-9a-fA-F-]+)/kqldatabases?/([0-9a-fA-F-]+)', re.I)),
    ('fabric_kql_database', re.compile(r'/groups/([0-9a-fA-F-]+)/databases?/([0-9a-fA-F-]+)', re.I)),
    ('onelake_lakehouse', re.compile(r'/onelake/details/([0-9a-fA-F-]+)/lakehouse/([0-9a-fA-F-]+)', re.I)),
    ('onelake_eventhouse', re.compile(r'/onelake/details/([0-9a-fA-F-]+)/eventhouse/([0-9a-fA-F-]+)', re.I)),
    ('onelake_kql_database', re.compile(r'/onelake/details/([0-9a-fA-F-]+)/kqldatabase/([0-9a-fA-F-]+)', re.I)),
]

for url, title, _ in rows:
    for kind, pattern in patterns:
        m = pattern.search(url)
        if not m:
            continue
        workspace_id = m.group(1)
        item_id = m.group(2)
        key = (kind, workspace_id, item_id, url)
        if key in seen:
            continue
        seen.add(key)
        hits.append({
            'kind': kind,
            'workspace_id': workspace_id,
            'item_id': item_id,
            'title': title or '',
            'url': url
        })

conn.close()
os.remove(dst)

if not hits:
    print('No recent Fabric item URLs found in local Chrome history.')
    raise SystemExit(0)

for hit in hits:
    print(f"KIND={hit['kind']}")
    print(f"WORKSPACE_ID={hit['workspace_id']}")
    print(f"ITEM_ID={hit['item_id']}")
    print(f"TITLE={hit['title']}")
    print(f"URL={hit['url']}")
    print()
'@

$script | python -
