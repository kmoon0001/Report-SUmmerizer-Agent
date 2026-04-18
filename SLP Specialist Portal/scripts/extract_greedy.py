import os
import re

def extract_clinical_info(content):
    # Find all strings that look like titles or descriptions
    # Find patterns like title: '...', name: '...', description: '...'
    results = []
    
    # Extract names/titles
    names = re.findall(r"(?:name|title|whatItIs|clinicalPearl):\s*(?:'|\")(.*?)(?:'|\")", content, re.DOTALL)
    
    # Extract descriptions
    descriptions = re.findall(r"description:\s*(?:'|\")(.*?)(?:'|\")", content, re.DOTALL)
    
    return names, descriptions

def process_greedy(file_path, output_path, main_title):
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    names, desc = extract_clinical_info(content)
    
    md = f"# {main_title}\n\n"
    md += "## Clinical Entities Identified\n\n"
    for n in names:
        md += f"### {n}\n"
        # Find if there's a description matching or nearby (this is rough but works for yolo)
        md += "\n"
        
    if desc:
        md += "## Detailed Descriptions\n\n"
        for d in desc:
            md += f"- {d}\n\n"
            
    with open(output_path, 'w', encoding='utf-8') as f:
        f.write(md)

if __name__ == "__main__":
    src_dir = r"d:\my agents copilot studio\SLP-Portal-Clone\src\data"
    out_dir = r"d:\my agents copilot studio\SLP-Portal-Clone\knowledge-base"
    
    files = {
        'subspecialty-data.ts': 'Clinical Subspecialties',
        'medicare-knowledge-base.ts': 'Medicare Guidelines',
        'slp-data.ts': 'General SLP Data',
        'ensign-slp-data.ts': 'Ensign SLP Guidelines',
        'pathways-data.ts': 'Clinical Pathways'
    }
    
    for filename, title in files.items():
        path = os.path.join(src_dir, filename)
        if os.path.exists(path):
            process_greedy(path, os.path.join(out_dir, f"{filename.replace('.ts', '.md')}"), title)
            
    print("Greedy extraction complete!")
