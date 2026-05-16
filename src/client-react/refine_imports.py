import os
import re

root_dir = r"c:\Users\harsh\Desktop\e-commerse\src\client-react\src"

# Revert lucide-react guess and fix Apollo specifically
# ApolloProvider -> @apollo/client/react/index.js
# useQuery, useMutation, etc -> @apollo/client/index.js

for root, dirs, files in os.walk(root_dir):
    for name in files:
        if name.endswith((".tsx", ".ts")):
            path = os.path.join(root, name)
            with open(path, 'r', encoding='utf-8') as f:
                content = f.read()
            
            new_content = content
            
            # Fix Lucide back to normal (Vite should handle it if Apollo is fixed)
            new_content = new_content.replace('from "lucide-react/dist/esm/lucide-react.js"', 'from "lucide-react"')
            
            # Surgical Apollo fixes
            if 'ApolloProvider' in new_content:
                new_content = re.sub(r'import\s+\{\s*([^}]*ApolloProvider[^}]*)\s*\}\s+from\s+["\']@apollo/client(?:/index\.js)?["\']', r'import { \1 } from "@apollo/client/react/index.js"', new_content)
            
            new_content = re.sub(r'from\s+["\']@apollo/client["\']', 'from "@apollo/client/index.js"', new_content)
            
            if new_content != content:
                print(f"Refining imports in: {path}")
                with open(path, 'w', encoding='utf-8') as f:
                    f.write(new_content)
