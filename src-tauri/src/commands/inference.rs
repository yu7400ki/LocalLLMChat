use super::load_model::LoadedModel;
use llm::InferenceRequest;
use std::io::Write;

#[derive(Clone, serde::Serialize)]
struct Payload {
    token: String,
}

#[tauri::command(async)]
pub fn inference(
    window: tauri::Window,
    loaded_model: tauri::State<LoadedModel>,
    prompt: &str,
) -> Result<(), String> {
    let mut session_guard = loaded_model.session.lock().unwrap();
    let session = match session_guard.as_mut() {
        Some(session) => session,
        None => return Err("No model loaded".to_string()),
    };
    let model_guard = loaded_model.model.lock().unwrap();
    let model = match model_guard.as_ref() {
        Some(model) => model,
        None => return Err("No model loaded".to_string()),
    };
    session
        .infer::<std::convert::Infallible>(
            model.as_ref(),
            &mut rand::thread_rng(),
            &InferenceRequest {
                prompt: prompt.into(),
                parameters: &Default::default(),
                play_back_previous_tokens: false,
                maximum_token_count: Some(50),
            },
            &mut Default::default(),
            |t| {
                if let llm::InferenceResponse::PromptToken(token)
                | llm::InferenceResponse::InferredToken(token) = t
                {
                    window
                        .emit(
                            "inference",
                            Payload {
                                token: token.to_string(),
                            },
                        )
                        .unwrap();
                    std::io::stdout().flush().unwrap();
                }
                Ok(llm::InferenceFeedback::Continue)
            },
        )
        .map_err(|e| format!("Inference failed: {}", e))?;
    Ok(())
}
