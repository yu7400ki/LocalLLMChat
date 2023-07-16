use llm::models::{Bloom, Gpt2, GptJ, GptNeoX, Llama, Mpt};
use llm::{InferenceSession, LoadError, Model, TokenizerSource};
use std::path::Path;
use std::sync::Mutex;

pub struct LoadedModel {
    pub name: Mutex<Option<String>>,
    pub model: Mutex<Option<Box<dyn Model>>>,
    pub session: Mutex<Option<InferenceSession>>,
}

fn load<M: llm::KnownModel + 'static, P: AsRef<Path>>(
    path: P,
    params: llm::ModelParameters,
) -> Result<Box<dyn Model>, LoadError> {
    let path = path.as_ref();
    let model = llm::load::<M>(path, TokenizerSource::Embedded, params, |_| {})?;
    Ok(Box::new(model))
}

#[tauri::command(async)]
pub fn load_model(
    loaded_model: tauri::State<LoadedModel>,
    models_dir: &Path,
    model_name: &str,
    model_type: &str,
) -> Result<bool, String> {
    {
        let loaded_model_name = loaded_model.name.lock().unwrap();
        if let Some(loaded_model_name) = &*loaded_model_name {
            if loaded_model_name == model_name {
                return Ok(false);
            }
        }
    }

    let load = match model_type {
        "bloom" => load::<Bloom, _>,
        "gpt2" => load::<Gpt2, _>,
        "gptj" => load::<GptJ, _>,
        "gptneox" => load::<GptNeoX, _>,
        "llama" => load::<Llama, _>,
        "mpt" => load::<Mpt, _>,
        _ => return Err(format!("Unknown model type: {}", model_type)),
    };

    let model_path = models_dir.join(model_name);
    let model = load(model_path, Default::default());

    match model {
        Ok(model) => {
            let session = model.start_session(Default::default());
            *loaded_model.name.lock().unwrap() = Some(model_name.to_string());
            *loaded_model.model.lock().unwrap() = Some(model);
            *loaded_model.session.lock().unwrap() = Some(session);
        }
        Err(e) => return Err(format!("Failed to load model: {}", e)),
    }

    Ok(true)
}
