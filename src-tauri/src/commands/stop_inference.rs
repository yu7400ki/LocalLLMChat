use std::sync::Mutex;

pub struct StopInference(pub Mutex<bool>);

#[tauri::command]
pub fn stop_inference(
    stop_inference: tauri::State<StopInference>,
    is_stop: bool,
) -> Result<(), String> {
    let mut stop_state = stop_inference.0.lock().unwrap();
    println!("stop inference {} => {}", *stop_state, is_stop);
    *stop_state = is_stop;
    Ok(())
}
