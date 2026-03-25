// hash.ts
Bun.password.hash("advisor_123", { algorithm: "bcrypt", cost: 10 })
    .then(hash => console.log("Tu hash perfecto es:", hash));