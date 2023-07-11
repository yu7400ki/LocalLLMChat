// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

mod commands;

use commands::get_models;

fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![get_models])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
