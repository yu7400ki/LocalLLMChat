use std::fs::{create_dir, read_dir};

#[tauri::command]
pub fn get_models(app: tauri::AppHandle) -> Result<Vec<String>, String> {
    let mut ret = Vec::new();
    let local_data_dir = app
        .path_resolver()
        .app_local_data_dir()
        .ok_or("Failed to get local data dir".to_string())?;
    let models_dir = local_data_dir.join("models");
    if !models_dir.exists() {
        create_dir(&models_dir).map_err(|e| e.to_string())?;
        return Ok(ret);
    }
    let dir = read_dir(&models_dir).map_err(|e| e.to_string())?;
    for entry in dir {
        let entry = match entry {
            Ok(entry) => entry,
            Err(_) => continue,
        };
        let path = entry.path();
        if path.is_file() {
            let file_name = path.file_name().unwrap().to_str().unwrap();
            if file_name.ends_with(".bin") {
                let model_name = file_name.trim_end_matches(".bin");
                ret.push(model_name.to_string());
            }
        }
    }
    Ok(ret)
}
