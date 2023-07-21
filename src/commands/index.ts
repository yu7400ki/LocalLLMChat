import { invoke } from "@tauri-apps/api/tauri";

export async function getModels(): Promise<string[]> {
  return await invoke("get_models");
}

export async function loadModel(
  modelsDir: string,
  modelName: string,
  modelType: "bloom" | "gpt2" | "gptj" | "gptneox" | "llama" | "mpt",
): Promise<boolean> {
  return await invoke("load_model", { modelsDir, modelName, modelType });
}

export async function inference(prompt: string): Promise<void> {
  return await invoke("inference", { prompt });
}

export async function stopInference(isStop: boolean): Promise<void> {
  return await invoke("stop_inference", { isStop });
}
