// hash.ts
const password = Bun.argv[2];

if (!password) {
    console.error("Por favor, proporciona una contraseña como argumento.");
    console.log("Uso: bun run src/core/utils/hash.ts <password>");
    process.exit(1);
}

Bun.password.hash(password, { algorithm: "bcrypt", cost: 10 })
    .then(hash => console.log("Tu hash perfecto es:", hash));