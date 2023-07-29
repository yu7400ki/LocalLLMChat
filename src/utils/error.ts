import { tauriErrorValidator } from "@/types/tauri_error";
import type { TauriError } from "@/types/tauri_error";

export const toTauriError = (error: unknown): TauriError => {
  if (tauriErrorValidator(error)) {
    return error;
  } else if (error instanceof Error) {
    return {
      error: error.name,
      message: error.message,
    };
  } else if (typeof error === "string") {
    return {
      error: "Unknown Error",
      message: error,
    };
  } else {
    return {
      error: "Unknown Error",
      message: "an unknown error occurred",
    };
  }
};
