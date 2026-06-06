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
            "**/*.datasource.ts",
            "**/*.datasource.impl.ts",
            "**/*.datasources.ts",
            "**/*.model.ts",
            "**/*.models.ts",
            "**/*.entity.ts",
            "**/*.entities.ts",
            "**/*.error.ts",
            "**/*.integration.test.ts",
            "**/Permissions.ts",
        ],
        rules: {
            "@typescript-eslint/naming-convention": [
                "error",
                {
                    selector: "default",
                    format: ["camelCase", "snake_case"],
                    leadingUnderscore: "allow",
                },
                {
                    selector: "variable",
                    format: ["camelCase", "UPPER_CASE", "snake_case"],
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
                    format: ["camelCase", "PascalCase", "snake_case"],
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
        files: ["**/*.dto.ts", "**/*.dtos.ts", "**/*.mapper.ts", "**/*.mappers.ts", "**/*.test.ts", "**/*.error.ts"],
        rules: {
            "@typescript-eslint/no-explicit-any": "off",
        },
    },
];

export default eslintConfiguration;
