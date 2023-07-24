import { invoke } from "@tauri-apps/api/tauri";

import { Architecture } from "@/features/chat/types/architecture";

export async function getModels(): Promise<string[]> {
  return await invoke("get_models");
}

export async function loadModel(modelName: string, modelType: Architecture): Promise<boolean> {
  return await invoke("load_model", { modelName, modelType });
}

export async function infer(prompt: string): Promise<void> {
  return await invoke("infer", { prompt });
}

export async function stopInference(isStop: boolean): Promise<void> {
  return await invoke("stop_inference", { isStop });
}

export async function openModelsDir(): Promise<void> {
  return await invoke("open_models_dir");
}
