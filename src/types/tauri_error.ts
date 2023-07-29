import { $object, $string } from "lizod";
import type { Infer } from "lizod";

export const tauriErrorValidator = $object({
  error: $string,
  message: $string,
});

export type TauriError = Infer<typeof tauriErrorValidator>;
