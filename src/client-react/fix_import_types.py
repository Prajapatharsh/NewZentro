import os
import re

root_dir = r"c:\Users\harsh\Desktop\e-commerse\src\client-react\src"

# Regex to find imports from files ending in Types or specifically authTypes/productTypes
pattern = re.compile(r'import\s+\{\s*([^}]+)\s*\}\s+from\s+["\']([^"\']*(?:Types|authTypes|productTypes))["\']', re.IGNORECASE)

for root, dirs, files in os.walk(root_dir):
    for name in files:
        if name.endswith((".tsx", ".ts")):
            path = os.path.join(root, name)
            with open(path, 'r', encoding='utf-8') as f:
                content = f.read()
            
            new_content = pattern.sub(r'import type { \1 } from "\2"', content)
            
            if new_content != content:
                print(f"Converting to import type in: {path}")
                with open(path, 'w', encoding='utf-8') as f:
                    f.write(new_content)
