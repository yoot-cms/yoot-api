use crate::services;


#[get("/register")]
pub fn register() -> &'static str {
    services::user::register()
}

#[get("/login")]
pub fn login() -> &'static str {
    services::user::login()
}