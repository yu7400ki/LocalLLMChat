import { invoke } from "@tauri-apps/api/tauri";

export async function getModels(modelsDir: string) {
  return await invoke("get_models", { modelsDir });
}

export async function loadModel(
  modelsDir: string,
  modelName: string,
  modelType: "bloom" | "gpt2" | "gptj" | "gptneox" | "llama" | "mpt",
) {
  return await invoke("load_model", { modelsDir, modelName, modelType });
}

export async function inference(prompt: string) {
  return await invoke("inference", { prompt });
}
