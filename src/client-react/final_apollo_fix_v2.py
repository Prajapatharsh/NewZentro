import os
import re

root_dir = r"c:\Users\harsh\Desktop\e-commerse\src\client-react\src"

# Final Surgical Apollo Fix v2:
# Move EVERYTHING that fails to @apollo/client/index.js or /react/index.js
# ApolloError, ApolloProvider, useQuery, etc.

for root, dirs, files in os.walk(root_dir):
    for name in files:
        if name.endswith((".tsx", ".ts")):
            path = os.path.join(root, name)
            with open(path, 'r', encoding='utf-8') as f:
                content = f.read()
            
            new_content = content
            
            # If it imports ApolloError or hooks, use /react/index.js (which has most things)
            # Otherwise use /index.js
            problematic = ["ApolloError", "useQuery", "useMutation", "useSubscription", "useLazyQuery", "ApolloProvider"]
            
            if any(p in new_content for p in problematic):
                new_content = re.sub(r'from\s+["\']@apollo/client(?:/index\.js)?["\']', 'from "@apollo/client/react/index.js"', new_content)
            else:
                new_content = re.sub(r'from\s+["\']@apollo/client["\']', 'from "@apollo/client/index.js"', new_content)
            
            if new_content != content:
                print(f"Apollo v2 fix in: {path}")
                with open(path, 'w', encoding='utf-8') as f:
                    f.write(new_content)
