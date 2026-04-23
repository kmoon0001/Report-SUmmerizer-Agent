import os
import re

def extract_subspecialty(content):
    # More specific regex for subspecialty data
    # Matches 'key': { id: '...', title: '...', overview: { ... }, assessments: [ ... ], treatments: [ ... ] }
    sub_data = []
    
    # Find top level blocks
    blocks = re.findall(r"'(.*?)': \{\s*id: '.*?',\s*title: '(.*?)',", content, re.DOTALL)
    
    for key, title in blocks:
        # Extract overview whatItIs
        what_it_is = re.search(rf"'{key}':.*?whatItIs: '(.*?)'", content, re.DOTALL)
        pearl = re.search(rf"'{key}':.*?clinicalPearl: '(.*?)'", content, re.DOTALL)
        
        # Assessments
        # This is a bit tricky with regex, but let's try to get names
        assessments = re.findall(rf"'{key}':.*?assessments: \[(.*?)\]", content, re.DOTALL)
        ass_list = []
        if assessments:
            ass_names = re.findall(r"name: '(.*?)'", assessments[0])
            ass_list = ass_names

        # Treatments
        treatments = re.findall(rf"'{key}':.*?treatments: \[(.*?)\]", content, re.DOTALL)
        treat_list = []
        if treatments:
            treat_names = re.findall(r"name: '(.*?)'", treatments[0])
            treat_list = treat_names
            
        sub_data.append({
            'title': title,
            'what_it_is': what_it_is.group(1) if what_it_is else "N/A",
            'pearl': pearl.group(1) if pearl else "N/A",
            'assessments': ass_list,
            'treatments': treat_list
        })
    return sub_data

def process_subspecialty(file_path, output_path):
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    data = extract_subspecialty(content)
    md = "# Clinical Subspecialties Guidelines\n\n"
    for item in data:
        md += f"## {item['title']}\n\n"
        md += f"### Overview\n{item['what_it_is']}\n\n"
        md += f"**Clinical Pearl**: {item['pearl']}\n\n"
        
        md += "### Key Assessments\n"
        for a in item['assessments']: md += f"- {a}\n"
        md += "\n"
        
        md += "### Key Treatments\n"
        for t in item['treatments']: md += f"- {t}\n"
        md += "\n---\n\n"
        
    with open(output_path, 'w', encoding='utf-8') as f:
        f.write(md)

# Process other files
def process_simple(file_path, output_path, title):
    # Just dump significant strings if they look like knowledge
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()
    strings = re.findall(r"'(.*?)'", content)
    # Filter for long strings (> 20 chars)
    long_strings = [s for s in strings if len(s) > 30]
    
    md = f"# {title}\n\n"
    for s in long_strings:
        if len(s) < 300: # avoid code blocks or too long text
            md += f"- {s}\n"
    
    if long_strings:
        with open(output_path, 'w', encoding='utf-8') as f:
            f.write(md)

if __name__ == "__main__":
    src_dir = r"d:\my agents copilot studio\SLP-Portal-Clone\src\data"
    out_dir = r"d:\my agents copilot studio\SLP-Portal-Clone\knowledge-base"
    
    # Ensign SLP
    # (Already handled, but let's re-run or keep)
    
    # Subspecialty
    process_subspecialty(os.path.join(src_dir, 'subspecialty-data.ts'), 
                         os.path.join(out_dir, 'Clinical_Subspecialties.md'))
    
    # Medicare
    process_simple(os.path.join(src_dir, 'medicare-knowledge-base.ts'),
                   os.path.join(out_dir, 'Medicare_Guidelines.md'),
                   "Medicare Guidelines & Knowledge")
    
    print("Yolo extraction phase 2 complete!")
