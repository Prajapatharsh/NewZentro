import os
import re

root_dir = r"c:\Users\harsh\Desktop\e-commerse\src\client-react\src"

# Libraries and their types that need "import type"
library_types = {
    "react-hook-form": [
        "UseFormReturn", "Control", "FieldValues", "SubmitHandler", "FieldPath",
        "FieldErrors", "UseFormSetValue", "UseFormRegister", "RegisterOptions",
        "UseFormWatch", "UseFormHandleSubmit", "UseFieldArrayReturn"
    ],
    "@reduxjs/toolkit": ["PayloadAction", "AsyncThunkAction", "SerializedError"],
    "react-redux": ["TypedUseSelectorHook"],
}

def fix_imports(content):
    new_content = content
    for lib, types in library_types.items():
        # Find imports from this library
        pattern = rf'import\s+{{([^}}]+)}}\s+from\s+["\']{lib}["\']'
        matches = list(re.finditer(pattern, new_content))
        
        # Process from bottom to top to avoid offset issues
        for match in reversed(matches):
            full_import = match.group(0)
            items_str = match.group(1)
            items = [i.strip() for i in items_str.split(",") if i.strip()]
            
            non_types = [i for i in items if i not in types]
            import_types = [i for i in items if i in types]
            
            if not import_types:
                continue
            
            new_lines = []
            if non_types:
                new_lines.append(f'import {{ {", ".join(non_types)} }} from "{lib}";')
            if import_types:
                new_lines.append(f'import type {{ {", ".join(import_types)} }} from "{lib}";')
            
            replacement = "\n".join(new_lines)
            new_content = new_content.replace(full_import, replacement)
            
    # Cleanup double semicolons
    new_content = new_content.replace(";;", ";")
    return new_content

for root, dirs, files in os.walk(root_dir):
    for name in files:
        if name.endswith((".tsx", ".ts")):
            path = os.path.join(root, name)
            with open(path, 'r', encoding='utf-8') as f:
                content = f.read()
            
            new_content = fix_imports(content)
            
            if new_content != content:
                print(f"Applying thorough import type fix in: {path}")
                with open(path, 'w', encoding='utf-8') as f:
                    f.write(new_content)
