use crate::models::user::User;
use rocket::serde::json::{ Json, Value, serde_json::json }; 


pub fn register( user_data: Option<Json<User>> ) -> Value {
    match user_data {
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

pub fn login( user_data: Option<Json<User>> ) -> Value {
    match user_data {
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