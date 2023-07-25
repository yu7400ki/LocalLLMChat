// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

mod commands;

use commands::{
    get_models, infer, load_model, open_models_dir, stop_inference, LoadedModel, StopInference,
};
use std::fs::create_dir_all;
use std::sync::Mutex;
use tauri::Manager;

fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![
            get_models,
            load_model,
            infer,
            stop_inference,
            open_models_dir,
        ])
        .setup(|app| {
            let local_data_dir = app
                .path_resolver()
                .app_local_data_dir()
                .ok_or("Failed to get local data dir")?;
            let models_dir = local_data_dir.join("models");
            create_dir_all(&models_dir)
                .map_err(|e| format!("Failed to create directory: {}", e))?;

            let loaded_model = LoadedModel {
                name: Mutex::new(None),
                model: Mutex::new(None),
            };
            let stop_inference = StopInference(Mutex::new(true));
            app.manage(loaded_model);
            app.manage(stop_inference);
            Ok(())
        })
        .plugin(tauri_plugin_store::Builder::default().build())
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
