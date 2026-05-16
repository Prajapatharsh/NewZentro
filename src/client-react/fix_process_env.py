import os
import re

root_dir = r"c:\Users\harsh\Desktop\e-commerse\src\client-react\src"

replacements = [
    (r'process\.env\.NODE_ENV\s*===\s*["\']production["\']', 'import.meta.env.MODE === "production"'),
    (r'process\.env\.NODE_ENV\s*===\s*["\']development["\']', 'import.meta.env.MODE === "development"'),
    (r'process\.env\.NEXT_PUBLIC_', 'import.meta.env.VITE_'),
    (r'process\.env\.', 'import.meta.env.VITE_'), # Fallback for other env vars
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
                print(f"Fixing process.env in: {path}")
                with open(path, 'w', encoding='utf-8') as f:
                    f.write(new_content)
