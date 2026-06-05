---
trigger: always_on
---

You MUST adhere strictly to the following rules:

1. **Naming & Style:** Follow the Kernighan and Ritchie (K&R) style. Write all code (variables, functions, classes) in English. Use full, descriptive names without abbreviations. Use `camelCase` for variables and methods, and `PascalCase` for classes, types, and interfaces.
2. **Preserve Existing Code:** If you are modifying existing files, you are STRICTLY FORBIDDEN from changing the names of existing variables, functions, or classes unless explicitly instructed to do so by the user.
3. **Comments:** Code comments may be written in either Spanish or English.
4. **No 'any' Allowed:** You are STRICTLY FORBIDDEN from using the `any` type under any circumstances. If a type cannot be determined ahead of time, you MUST use `unknown` and properly narrow it down.
5. **String Literal Types:** Do not use generic `string` types for properties or variables that only accept a specific set of allowed values. You MUST create a union of string literals to enforce strict typing (e.g., `type State = "Active" | "Block";`).