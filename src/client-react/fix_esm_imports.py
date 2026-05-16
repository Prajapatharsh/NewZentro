import os
import re

root_dir = r"c:\Users\harsh\Desktop\e-commerse\src\client-react\src"

# Replace @apollo/client with @apollo/client/index.js
# This often fixes "does not provide an export" in Vite ESM
replacements = [
    (r'from ["\']@apollo/client["\']', 'from "@apollo/client/index.js"'),
    (r'from ["\']lucide-react["\']', 'from "lucide-react/dist/esm/lucide-react.js"'), # Another possible fix for lucide
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
                print(f"Fixing Apollo/Lucide in: {path}")
                with open(path, 'w', encoding='utf-8') as f:
                    f.write(new_content)
