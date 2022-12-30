use rocket::serde::json::{Value, Json, serde_json::json};
use crate::models::user::User;

#[post("/register", format="json", data="<user>")]
pub fn register( user: Option<Json<User>> ) -> Value {
    match user {
        Some(user)=>{
            let new_user = User{
                email: user.email.to_string(),
                password: user.password.to_string()
            };
            json!(new_user)
        },
        None=>{
            json!({
                "code":400,
                "message":"Deserialization failed"
            })
        }
    }
}

#[post("/login", format="json", data="<user>")]
pub fn login( user: Option<Json<User>> ) -> Value {
    match user {
        Some(user)=>{
            let new_user = User{
                email: user.email.to_string(),
                password: user.password.to_string()
            };
            json!(new_user)
        },
        None=>{
            json!({
                "code":400,
                "message":"Deserialization failed"
            })
        }
    }
}