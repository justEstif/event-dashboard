1. the contrast on the navbar when you switch to is wrong

- After you delete an event: it should redirect to the home page

Example:

```
 POST /events/[id]/edit 200 in 405ms (next.js: 32ms, proxy.ts: 3ms, generate-params: 31ms, application-code: 370ms)
  └─ ƒ deleteEvent("6b4b6b02-a7dd-4708-9f28-1fa665e21edb") in 363ms actions/events/deleteEvent.ts
 POST /dashboard 200 in 419ms (next.js: 2ms, proxy.ts: 5ms, application-code: 412ms)
 GET /dashboard 200 in 16ms (next.js: 3ms, proxy.ts: 6ms, application-code: 7ms)
 GET /dashboard 200 in 859ms (next.js: 1882µs, proxy.ts: 3ms, application-code: 854ms)
```

chec the next js skill -> this seems like a bug

I like how when you update an event it stays on the same event


Why is it saying email rate limit exceeded? I think I need to disable the requiring supabase email verification?

---

also confirming google sign in works

---

1. need to update to tailwind v4
2. clean up the template files
3. do we need the supabase folder?
