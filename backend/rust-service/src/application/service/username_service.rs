pub fn generate_base_username(email: &str) -> String {
    email
        .split('@')
        .next()
        .unwrap_or("user")
        .to_lowercase()
        .replace(|c: char| !c.is_ascii_alphanumeric(), "")
}

const BASE62: &[u8] = b"0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";

fn to_base62(mut num: u64) -> String {
    if num == 0 {
        return "0".to_string();
    }

    let mut buf = Vec::new();

    while num > 0 {
        buf.push(BASE62[(num % 62) as usize]);
        num /= 62;
    }

    buf.reverse();
    String::from_utf8(buf).unwrap()
}

pub fn generate_username(email: &str, user_id: i64) -> String {
    let base = generate_base_username(email);

    let suffix = to_base62(user_id as u64);

    format!("{}_{}", base, suffix)
}
