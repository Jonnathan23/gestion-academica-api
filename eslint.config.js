import eslintJs from "@eslint/js";
import typescriptEslintPlugin from "@typescript-eslint/eslint-plugin";
import typescriptParser from "@typescript-eslint/parser";
import eslintPluginPrettierRecommended from "eslint-plugin-prettier/recommended";
import globals from "globals";

/** @type {import('eslint').Linter.Config[]} */
const eslintConfiguration = [
    eslintJs.configs.recommended,
    eslintPluginPrettierRecommended,
    {
        ignores: ["eslint.config.js", "prettier.config.mjs", "lint-staged.config.js", "dist/**", "node_modules/**"],
    },

    {
        files: ["**/*.ts"],
        languageOptions: {
            globals: {
                ...globals.node,
                ...globals.es2021,
            },
            parser: typescriptParser,
            parserOptions: {
                ecmaVersion: "latest",
                sourceType: "module",
            },
        },
        plugins: {
            "@typescript-eslint": typescriptEslintPlugin,
        },
        rules: {
            ...typescriptEslintPlugin.configs.recommended.rules,

            "no-console": ["warn", { allow: ["warn", "error", "info"] }],
            "@typescript-eslint/no-unused-vars": ["error", { argsIgnorePattern: "^_" }],

            "@typescript-eslint/naming-convention": [
                "error",
                {
                    selector: "default",
                    format: ["camelCase"],
                    leadingUnderscore: "allow",
                },
                {
                    selector: "variable",
                    format: ["camelCase", "UPPER_CASE"],
                    leadingUnderscore: "allow",
                },
                {
                    selector: "import",
                    format: ["camelCase", "PascalCase"],
                    leadingUnderscore: "allow",
                },
                {
                    selector: ["class", "interface", "typeAlias", "enum", "typeParameter"],
                    format: ["PascalCase"],
                },
                {
                    selector: "property",
                    format: ["camelCase", "PascalCase"],
                    leadingUnderscore: "allow",
                },
                {
                    selector: "parameter",
                    format: ["camelCase"],
                    leadingUnderscore: "allow",
                },
            ],
        },
    },

    // 3. Primer bloque de excepciones (Archivos de dominio, datos e infraestructura)
    {
        files: [
            "**/*.dto.ts",
            "**/*.mapper.ts",
            "**/*.mappers.ts",
            //"**/*.datasource.ts",
            "**/*.datasource.impl.ts",
            "**/*.datasources.ts",
            "**/*.model.ts",
            "**/*.models.ts",
            "**/*.entity.ts",
            "**/*.entities.ts",
            "**/*.error.ts",
            "**/*.integration.test.ts",
            "**/__tests__/**/*.ts",
        ],
        rules: {
            // Apagamos la advertencia de interfaces vacías (Muy común en Sequelize)
            "@typescript-eslint/no-empty-object-type": "off",
            "@typescript-eslint/naming-convention": [
                "error",
                {
                    selector: "default",
                    format: ["camelCase", "snake_case"],
                    leadingUnderscore: "allow",
                },
                {
                    selector: "variable",
                    // AÑADIDO: PascalCase para permitir export const UserMapper
                    format: ["camelCase", "UPPER_CASE", "snake_case", "PascalCase"],
                    leadingUnderscore: "allow",
                },
                {
                    selector: "import",
                    format: ["camelCase", "PascalCase"],
                    leadingUnderscore: "allow",
                },
                {
                    selector: ["class", "interface", "typeAlias", "enum", "typeParameter"],
                    format: ["PascalCase"],
                },
                {
                    selector: "property",
                    // AÑADIDO: UPPER_CASE para permitir ACADEMIC_DIRECTOR en Modelos
                    format: ["camelCase", "PascalCase", "snake_case", "UPPER_CASE"],
                    leadingUnderscore: "allow",
                },
                {
                    selector: "parameter",
                    format: ["camelCase", "snake_case"],
                    leadingUnderscore: "allow",
                },
            ],
        },
    },

    // 4. Segundo bloque de excepciones (Desactivar tipo 'any' explícito)
    {
        files: [
            "**/*.dto.ts",
            "**/*.dtos.ts",
            "**/*.mapper.ts",
            "**/*.mappers.ts",
            "**/*.test.ts",
            "**/*.error.ts",
            "**/*.datasource.impl.ts", // AÑADIDO: Para permitir 'any' en los datasources
        ],
        rules: {
            "@typescript-eslint/no-explicit-any": "off",
        },
    },

    // 5. Reglas estrictas exclusivas para diccionarios de constantes (Permisos)
    {
        files: ["**/Permissions.ts", "**/*.permissions.ts"],
        rules: {
            "@typescript-eslint/naming-convention": [
                "error",
                {
                    selector: "variable",
                    modifiers: ["exported", "const"],
                    format: ["camelCase"],
                },
                {
                    selector: "property",
                    format: ["UPPER_CASE"],
                },
                {
                    // AÑADIDO: Permitir PascalCase para los Types/Interfaces en este archivo
                    selector: "typeLike",
                    format: ["PascalCase"],
                },
                {
                    selector: "default",
                    format: ["camelCase", "UPPER_CASE"],
                },
            ],
        },
    },
];

export default eslintConfiguration;
