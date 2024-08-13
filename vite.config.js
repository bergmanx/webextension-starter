import { defineConfig } from "vite";
import zipPack from "vite-plugin-zip-pack";
import webExtension, { readJsonFile } from "vite-plugin-web-extension";
import preact from "@preact/preset-vite";

const target = process.env.TARGET || "firefox";
const template = process.env.TEMPLATE || "false";

function generateManifest() {
    let fileName = `manifest.${target}.json`;
    if (template == "true") {
        fileName = "manifest.json";
    }
    const pkg = readJsonFile("package.json");
    const manifest = readJsonFile("src/" + fileName);
    return {
        name: pkg.name,
        description: pkg.description,
        version: pkg.version,
        ...manifest
    };
}

// https://vitejs.dev/config/
export default defineConfig({
    define: {
        __BROWSER__: JSON.stringify(target)
    },
    plugins: [
        preact(),
        webExtension({
            browser: target,
            manifest: generateManifest
        }),
        zipPack({
            inDir: "dist",
            outDir: "dist-zip",
            outFileName: `${target}_extension.zip`
        })
    ]
});
