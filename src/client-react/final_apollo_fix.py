import os
import re

root_dir = r"c:\Users\harsh\Desktop\e-commerse\src\client-react\src"

# Final Surgical Apollo Fix:
# Hooks (useQuery, useMutation, useSubscription, useLazyQuery) -> @apollo/client/react/index.js
# Client/Cache/Links (ApolloClient, InMemoryCache, HttpLink, from, gql) -> @apollo/client/index.js

for root, dirs, files in os.walk(root_dir):
    for name in files:
        if name.endswith((".tsx", ".ts")):
            path = os.path.join(root, name)
            with open(path, 'r', encoding='utf-8') as f:
                content = f.read()
            
            new_content = content
            
            # If the file contains hooks, split or move them to /react/index.js
            hooks = ["useQuery", "useMutation", "useSubscription", "useLazyQuery", "useApolloClient", "useReactiveVar"]
            
            # This is complex to do via regex perfectly, so I'll try to just move EVERYTHING to /react/index.js if it contains hooks, 
            # because /react/index.js usually re-exports core things too.
            # OR just move everything to /react/index.js for Apollo imports in components.
            
            if any(hook in new_content for hook in hooks):
                new_content = re.sub(r'from\s+["\']@apollo/client(?:/index\.js)?["\']', 'from "@apollo/client/react/index.js"', new_content)
            else:
                new_content = re.sub(r'from\s+["\']@apollo/client["\']', 'from "@apollo/client/index.js"', new_content)
            
            if new_content != content:
                print(f"Final Apollo fix in: {path}")
                with open(path, 'w', encoding='utf-8') as f:
                    f.write(new_content)
