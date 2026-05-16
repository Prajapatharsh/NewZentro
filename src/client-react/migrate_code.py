import os
import re

root_dir = r"c:\Users\harsh\Desktop\e-commerse\src\client-react\src"

replacements = [
    (r'import\s+\{\s*(.*?)\s*\}\s+from\s+["\']next/navigation["\']', 
     lambda m: f'import {{ {m.group(1).replace("useRouter", "useNavigate").replace("usePathname", "useLocation").replace("useSearchParams", "useSearchParams")} }} from "react-router-dom"'),
    
    (r'import\s+dynamic\s+from\s+["\']next/dynamic["\']', 
     'import { lazy, Suspense } from "react"'),
    
    (r'const\s+router\s*=\s*useRouter\(\)', 'const navigate = useNavigate()'),
    (r'const\s+pathname\s*=\s*usePathname\(\)', 'const { pathname } = useLocation()'),
    (r'router\.push\(', 'navigate('),
    (r'router\.replace\(', 'navigate('),
    (r'router\.back\(', 'navigate(-1)'),
    
    (r'const\s+params\s*=\s*useParams\(\)', 'const params = useParams()'), # useParams is same name
    
    (r'const\s+searchParams\s*=\s*useSearchParams\(\)', 'const [searchParams] = useSearchParams()'),
    
    (r'<Image', '<img'),
    (r'href=', 'to='),
]

for root, dirs, files in os.walk(root_dir):
    for name in files:
        if name.endswith((".tsx", ".ts")):
            path = os.path.join(root, name)
            with open(path, 'r', encoding='utf-8') as f:
                content = f.read()
            
            new_content = content
            for pattern, replacement in replacements:
                if callable(replacement):
                    new_content = re.sub(pattern, replacement, new_content)
                else:
                    new_content = re.sub(pattern, replacement, new_content)
            
            if new_content != content:
                print(f"Updating: {path}")
                with open(path, 'w', encoding='utf-8') as f:
                    f.write(new_content)
