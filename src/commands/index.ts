import { invoke } from "@tauri-apps/api/tauri";

export async function getModels(modelsDir: string) {
  return await invoke("get_models", { modelsDir });
}
