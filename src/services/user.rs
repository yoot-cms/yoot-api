use crate::models::user::User;
use crate::utils::{generate_auth_token};
use crate::models::user;
use rocket::serde::json::{ Json, Value, serde_json::json }; 
use rocket::State;
use mongodb::{Database, Collection};


pub async fn register(  db: &State<Database>, user_data: Option<Json<User>> ) -> Value {
    let users_collection : Collection<user::User> = db.collection("users");
    match user_data {
        Some(user)=>{
            let new_user = User{
                email: user.email.to_string(),
                password: user.password.to_string()
            };
            let insertion_result = users_collection.insert_one(&new_user, None).await;
            match insertion_result {
                Ok(_)=>{
                    
                },
                Err(error)=>{
                    println!("{}", error);
                    return json!({
                        "status":500,
                        "message":"Registration failed. Please try again or contact support"
                    })
                }
            }
            let auth_token = generate_auth_token(&new_user.email);
            match auth_token {
                Some(token)=>{
                    json!({
                        "status":201,
                        "token": token
                    })
                },
                None=>{
                    json!({
                        "status":500,
                        "message":"Registration failed. Please try again or contact support"
                    })
                }
            }
        },
        None=>{
            json!({
                "code":400,
                "message":"Deserialization failed"
            })
        }
    }
    
}

pub async fn login( user_data: Option<Json<User>> ) -> Value {
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