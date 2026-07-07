// hash.ts
/* global Bun */
const DEFAULT_ARGUMENT_INDEX: number = 2;
const password = Bun.argv[DEFAULT_ARGUMENT_INDEX];

if (!password) {
    console.error("Por favor, proporciona una contraseña como argumento.");
    console.info("Uso: bun run src/core/utils/hash.ts <password>");
    process.exit(1);
}

Bun.password.hash(password, { algorithm: "bcrypt", cost: 10 }).then((hash) => console.info("Tu hash perfecto es:", hash));
