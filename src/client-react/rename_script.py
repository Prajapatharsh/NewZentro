import os

root_dir = r"c:\Users\harsh\Desktop\e-commerse\src\client-react\src\pages"

for root, dirs, files in os.walk(root_dir, topdown=False):
    for name in dirs:
        if any(c in name for c in "[]()"):
            new_name = name.translate({ord(c): None for c in "[]()"})
            old_path = os.path.join(root, name)
            new_path = os.path.join(root, new_name)
            print(f"Renaming dir: {old_path} -> {new_path}")
            os.rename(old_path, new_path)
    for name in files:
        if any(c in name for c in "[]()"):
            new_name = name.translate({ord(c): None for c in "[]()"})
            old_path = os.path.join(root, name)
            new_path = os.path.join(root, new_name)
            print(f"Renaming file: {old_path} -> {new_path}")
            os.rename(old_path, new_path)
