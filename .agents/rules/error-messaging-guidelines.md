---
trigger: manual
---

- **CRITICAL:** All error messages (whether in middlewares or thrown in services) MUST be brief, clear, and user-facing.
- Avoid technical jargon, database details, or developer-centric debugging information.
- Examples of good messages: `"User not found"`, `"User entity to create isn't valid"`, `"Email is already in use"`.