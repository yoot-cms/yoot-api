use crate::services;
use rocket::serde::json::{Value, Json};
use crate::models::user::User;

#[post("/register", format="json", data="<user>")]
pub fn register( user: Option<Json<User>> ) -> Value {
    services::user::register(user)
}

#[post("/login", format="json", data="<user>")]
pub fn login( user: Option<Json<User>> ) -> Value {
    services::user::login(user)
}