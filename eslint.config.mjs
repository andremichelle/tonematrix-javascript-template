import js from "@eslint/js"
import globals from "globals"

export default [
    js.configs.recommended,
    {
        // Modern ES modules across the whole project.
        languageOptions: {
            ecmaVersion: "latest",
            sourceType: "module"
        }
    },
    {
        // Browser code (main thread).
        files: ["src/**/*.js"],
        languageOptions: {globals: {...globals.browser}}
    },
    {
        // AudioWorklet global scope.
        files: ["src/processor.js"],
        languageOptions: {
            globals: {
                registerProcessor: "readonly",
                AudioWorkletProcessor: "readonly",
                sampleRate: "readonly",
                currentTime: "readonly",
                currentFrame: "readonly"
            }
        },
        rules: {
            // processor.js ships as a skeleton: the scaffolding (FREQUENCIES, the
            // private fields, the process() arguments) is intentionally unused until
            // you implement it. Don't flag it as an error in the template.
            "no-unused-vars": "off",
            "no-unused-private-class-members": "off"
        }
    },
    {
        // Node tooling.
        files: ["serve.mjs", "eslint.config.mjs"],
        languageOptions: {globals: {...globals.node}}
    }
]
