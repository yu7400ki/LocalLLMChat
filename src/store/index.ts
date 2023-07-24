import { Store } from "tauri-plugin-store-api";

export const settingsStore = new Store(".settings.json");
export const conversionStore = new Store(".conversion.json");
