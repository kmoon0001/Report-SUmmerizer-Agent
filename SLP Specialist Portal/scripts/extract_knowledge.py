import os
import re

def parse_ts_file(content):
    # This is a yolo regex to extract sections from the Ensign SLP data
    # It looks for patterns like { id: '...', title: '...', sections: [...] }
    
    entries = []
    # Find objects in the array
    # This identifies the title and items
    items = re.findall(r'\{\s*id:\s*\'(.*?)\',\s*title:\s*\'(.*?)\'.*?sections:\s*\[(.*?)\]\s*\}', content, re.DOTALL)
    
    for entry_id, title, sections_raw in items:
        # Extract sections
        sections = re.findall(r'\{\s*title:\s*\'(.*?)\',.*?content:\s*(.*?)\s*\}', sections_raw, re.DOTALL)
        parsed_sections = []
        for s_title, s_content in sections:
            # Clean up content (remove quotes, brackets, etc.)
            clean_content = s_content.strip()
            if clean_content.startswith('['):
                # List
                bullets = re.findall(r'\'(.*?)\'', clean_content)
                parsed_sections.append({'title': s_title, 'content': bullets, 'type': 'list'})
            else:
                # Text
                text = clean_content.strip("'").strip('"')
                parsed_sections.append({'title': s_title, 'content': text, 'type': 'text'})
        
        entries.append({'title': title, 'sections': parsed_sections})
    
    return entries

def convert_to_md(entries, main_title):
    md = f"# {main_title}\n\n"
    for entry in entries:
        md += f"## {entry['title']}\n\n"
        for section in entry['sections']:
            md += f"### {section['title']}\n"
            if section['type'] == 'list':
                for item in section['content']:
                    md += f"- {item}\n"
            else:
                md += f"{section['content']}\n"
            md += "\n"
        md += "---\n\n"
    return md

def process_file(file_path, output_path, title):
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    entries = parse_ts_file(content)
    if not entries:
        # Fallback: just dump the file as code block if regex fails
        # but for yolo mode we want better
        print(f"Warning: No entries found for {file_path}")
        return
        
    md = convert_to_md(entries, title)
    with open(output_path, 'w', encoding='utf-8') as f:
        f.write(md)
    print(f"Created {output_path}")

if __name__ == "__main__":
    src_dir = r"d:\my agents copilot studio\SLP-Portal-Clone\src\data"
    out_dir = r"d:\my agents copilot studio\SLP-Portal-Clone\knowledge-base"
    os.makedirs(out_dir, exist_ok=True)
    
    # Process main files
    process_file(os.path.join(src_dir, 'ensign-slp-data.ts'), 
                 os.path.join(out_dir, 'Ensign_SLP_Guidelines.md'), 
                 "Ensign SLP Guidelines")
    
    # We can add more generic ones if needed
    print("Yolo extraction complete!")
