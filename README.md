Client logs in
→ server creates JWT with userId inside
→ JWT stored in cookie
→ client sends cookie on every request
→ userAuth middleware reads cookie
→ verifies token
→ extracts userId
→ attaches it to req.userId
→ next()
→ route handler can use req.userId
