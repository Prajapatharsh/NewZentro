import os
import re

root_dir = r"c:\Users\harsh\Desktop\e-commerse\src\client-react\src"

# Replace @/(public)/ and @/(private)/ with correct paths
# Since we removed the (group) folders, we should point to @/pages/public/ or @/pages/private/

replacements = [
    (r'@/\(public\)/', '@/pages/public/'),
    (r'@/\(private\)/', '@/pages/private/'),
]

for root, dirs, files in os.walk(root_dir):
    for name in files:
        if name.endswith((".tsx", ".ts")):
            path = os.path.join(root, name)
            with open(path, 'r', encoding='utf-8') as f:
                content = f.read()
            
            new_content = content
            for pattern, replacement in replacements:
                new_content = re.sub(pattern, replacement, new_content)
            
            if new_content != content:
                print(f"Updating paths in: {path}")
                with open(path, 'w', encoding='utf-8') as f:
                    f.write(new_content)
