use std::fs::create_dir;

use crate::shared::{Error, Result};
use tauri::api::shell;
use tauri::Manager;

#[tauri::command]
pub fn open_models_dir(app: tauri::AppHandle) -> Result<()> {
    let error = "Open Directory Error";
    let local_data_dir = app
        .path_resolver()
        .app_local_data_dir()
        .ok_or(Error::new(error, "Failed to get local data dir"))?;
    let models_dir = local_data_dir.join("models");
    if !models_dir.exists() {
        create_dir(&models_dir).map_err(|e| Error::new(error, e.to_string()))?;
    }
    let path = models_dir.to_str().unwrap();
    shell::open::<&str>(&app.shell_scope(), path, None)
        .map_err(|e| Error::new(error, e.to_string()))?;
    Ok(())
}
