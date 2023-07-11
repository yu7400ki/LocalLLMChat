use regex::Regex;
use std::fs::read_dir;
use std::path::Path;

fn check_file_exists<P: AsRef<Path>>(path: P, file: Regex) -> bool {
    let path = path.as_ref();
    if !path.is_dir() {
        return false;
    }
    let dir = read_dir(path).unwrap();
    for entry in dir {
        let entry = match entry {
            Ok(entry) => entry,
            Err(_) => continue,
        };
        let path = entry.path();
        if path.is_file() {
            let file_name = path.file_name().unwrap().to_str().unwrap();
            if file.is_match(file_name) {
                return true;
            }
        }
    }
    false
}

#[tauri::command]
pub fn get_models(models_dir: &str) -> Result<Vec<String>, String> {
    let path = Path::new(models_dir);
    if !path.is_dir() {
        return Err(format!("{} is not a directory", models_dir));
    };
    let mut ret = Vec::new();
    let dir = read_dir(models_dir).unwrap();
    let config_file = Regex::new(r"^config\.json$").unwrap();
    let ggml_file = Regex::new(r"^ggml-model.*\.bin$").unwrap();
    for entry in dir {
        let entry = match entry {
            Ok(entry) => entry,
            Err(_) => continue,
        };
        let path = entry.path();
        if path.is_dir() {
            if check_file_exists(&path, config_file.clone())
                && check_file_exists(&path, ggml_file.clone())
            {
                let dir_name = path.file_name().unwrap().to_str().unwrap();
                ret.push(dir_name.to_string());
            }
        }
    }
    Ok(ret)
}
