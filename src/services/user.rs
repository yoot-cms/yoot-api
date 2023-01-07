use crate::models::user::User;
use crate::utils::{generate_auth_token};
use rocket::serde::json::{ Json, Value, serde_json::json }; 
use rocket::State;
use mongodb::Database;


pub async fn register(  _db: &State<Database>, user_data: Option<Json<User>> ) -> Value {
    // let test = db.list_collection_names(None).await;
    // match test {
    //     Ok(value)=>{
    //         println!("{:?}", value)
    //     },
    //     Err(err)=>{
    //         println!("{}", err);
    //         print!("Shit")
    //     }
    // }
    match user_data {
        Some(user)=>{
            let new_user = User{
                email: user.email.to_string(),
                password: user.password.to_string()
            };
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