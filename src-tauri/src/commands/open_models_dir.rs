use std::fs::create_dir;

use tauri::api::shell;
use tauri::Manager;

#[tauri::command]
pub fn open_models_dir(app: tauri::AppHandle) -> Result<(), String> {
    let local_data_dir = app
        .path_resolver()
        .app_local_data_dir()
        .ok_or("Failed to get local data dir".to_string())?;
    let models_dir = local_data_dir.join("models");
    if !models_dir.exists() {
        create_dir(&models_dir).map_err(|e| e.to_string())?;
    }
    let path = models_dir.to_str().unwrap();
    shell::open::<&str>(&app.shell_scope(), path, None).map_err(|e| e.to_string())?;
    Ok(())
}
