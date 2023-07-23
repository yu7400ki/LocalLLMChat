use super::load_model::LoadedModel;
use super::stop_inference::StopInference;
use llm::InferenceRequest;

#[derive(Clone, serde::Serialize)]
struct Payload {
    token: String,
}

#[tauri::command(async)]
pub fn infer(
    window: tauri::Window,
    loaded_model: tauri::State<LoadedModel>,
    stop_inference: tauri::State<StopInference>,
    prompt: &str,
) -> Result<(), String> {
    let model_guard = loaded_model.model.lock().unwrap();
    let model = match model_guard.as_ref() {
        Some(model) => model,
        None => return Err("No model loaded".to_string()),
    };
    let mut session = model.start_session(Default::default());
    print!("{}", prompt);
    session
        .infer::<std::convert::Infallible>(
            model.as_ref(),
            &mut rand::thread_rng(),
            &InferenceRequest {
                prompt: prompt.into(),
                parameters: &Default::default(),
                play_back_previous_tokens: false,
                maximum_token_count: Some(2048),
            },
            &mut Default::default(),
            |t| {
                {
                    let stop_guard = stop_inference.0.lock().unwrap();
                    if *stop_guard {
                        return Ok(llm::InferenceFeedback::Halt);
                    }
                }
                match t {
                    llm::InferenceResponse::PromptToken(token) => {
                        println!("prompt: {}", token);
                        Ok(llm::InferenceFeedback::Continue)
                    }
                    llm::InferenceResponse::InferredToken(token) => {
                        println!("infer: {}", token);
                        window
                            .emit(
                                "inference",
                                Payload {
                                    token: token.to_string(),
                                },
                            )
                            .unwrap();
                        Ok(llm::InferenceFeedback::Continue)
                    }
                    llm::InferenceResponse::EotToken => Ok(llm::InferenceFeedback::Halt),
                    _ => Ok(llm::InferenceFeedback::Continue),
                }
            },
        )
        .map_err(|e| format!("Inference failed: {}", e))?;
    println!("done");
    Ok(())
}
