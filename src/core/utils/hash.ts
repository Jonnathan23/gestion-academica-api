// hash.ts
Bun.password.hash("Admin123!", { algorithm: "bcrypt", cost: 10 })
    .then(hash => console.log("Tu hash perfecto es:", hash));