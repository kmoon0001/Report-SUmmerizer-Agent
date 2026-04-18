import os
import re

def process_greedy(file_path, output_path, main_title):
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Extract strings that are at least 4 words long (simple proxy for clinical info)
    strings = re.findall(r"(?:'|\")((?:[\w,.]+\s+){4,}.*?)(?:'|\")", content, re.DOTALL)
    
    # Filter out code-looking strings
    clinical_strings = [s for s in strings if not any(x in s for x in ['{', '}', '=>', 'import ', ';'])]
    
    if clinical_strings:
        md = f"# {main_title}\n\n"
        for s in clinical_strings:
            md += f"- {s.strip()}\n"
        
        with open(output_path, 'w', encoding='utf-8') as f:
            f.write(md)
        return True
    return False

if __name__ == "__main__":
    src_dir = r"d:\my agents copilot studio\SLP-Portal-Clone\src\data"
    out_dir = r"d:\my agents copilot studio\SLP-Portal-Clone\knowledge-base"
    
    for filename in os.listdir(src_dir):
        if filename.endswith('.ts') and not filename.endswith('.test.ts'):
            path = os.path.join(src_dir, filename)
            title = filename.replace('-data.ts', '').replace('.ts', '').replace('-', ' ').title()
            out_file = filename.replace('.ts', '.md')
            process_greedy(path, os.path.join(out_dir, out_file), title)
            
    print("Final greedy extraction complete!")
