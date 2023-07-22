use llm::models::{Bloom, Gpt2, GptJ, GptNeoX, Llama, Mpt};
use llm::{LoadError, Model, TokenizerSource};
use std::fs::create_dir;
use std::path::Path;
use std::sync::Mutex;

pub struct LoadedModel {
    pub name: Mutex<Option<String>>,
    pub model: Mutex<Option<Box<dyn Model>>>,
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
    app: tauri::AppHandle,
    loaded_model: tauri::State<LoadedModel>,
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

    let local_data_dir = app
        .path_resolver()
        .app_local_data_dir()
        .ok_or("Failed to get local data dir".to_string())?;
    let models_dir = local_data_dir.join("models");
    if !models_dir.exists() {
        create_dir(&models_dir).map_err(|e| e.to_string())?;
    }
    let model_path = models_dir.join(format!("{}.bin", model_name));
    let model = load(model_path, Default::default());

    match model {
        Ok(model) => {
            *loaded_model.name.lock().unwrap() = Some(model_name.to_string());
            *loaded_model.model.lock().unwrap() = Some(model);
        }
        Err(e) => return Err(format!("Failed to load model: {}", e)),
    }

    Ok(true)
}
