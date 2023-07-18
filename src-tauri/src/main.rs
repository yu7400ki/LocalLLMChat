// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

mod commands;

use commands::{get_models, inference, load_model, stop_inference, LoadedModel, StopInference};
use std::sync::Mutex;
use tauri::Manager;

fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![
            get_models,
            load_model,
            inference,
            stop_inference
        ])
        .setup(|app| {
            let loaded_model = LoadedModel {
                name: Mutex::new(None),
                model: Mutex::new(None),
                session: Mutex::new(None),
            };
            let stop_inference = StopInference(Mutex::new(true));
            app.manage(loaded_model);
            app.manage(stop_inference);
            Ok(())
        })
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
