use crate::models::user::User;
use crate::utils::{generate_auth_token};
use crate::models::user;
use mongodb::bson::doc;
use rocket::serde::json::{ Json, Value, serde_json::json };
use rocket::State;
use mongodb::{Database, Collection};

pub async fn register(  db: &State<Database>, user_data: Option<Json<User>> ) -> Value {
    let users_collection : Collection<user::User> = db.collection("users");
    match user_data {
        //Deserialize json 
        Some(user)=>{
            //Once deserialization is completed, check if email is not already in the database
            let filter = doc! { "email": &user.email };
            let potential_duplicate = users_collection.find_one(filter, None).await.unwrap();
            match potential_duplicate {
                Some(user)=>{
                    print!("{}", user.email);
                    return json!({
                        "status":409
                    })
                },
                None=>{}
            }
            //If email does not exists in database, hash password
            let hashed_password = bcrypt::hash(user.email.to_string()).unwrap();
            match Some(hashed_password) {
                //If password hashins succeeds
                Some(value)=>{
                    //Create a new User with the hashed password
                    let new_user = User{
                        email: user.email.to_string(),
                        password: value
                    };
                    //Insert user in database
                    let insertion_result = users_collection.insert_one(&new_user, None).await;
                    match insertion_result {
                        //If insertion succeeds, generate auth token
                        Ok(_)=>{
                            let auth_token = generate_auth_token(&new_user.email);
                            match auth_token {
                                //If token generation succeeds, send it to client
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
                        Err(error)=>{
                            println!("{}", error);
                            return json!({
                                "status":500,
                                "message":"Registration failed. Please try again or contact support"
                            })
                        }
                    }
                },
                None=>{
                    return json!({
                        "status":500,
                        "message":"Registration failed. Please try again or contact support"
                    })
                }
            }
            
        },
        None=>{
            json!({
                "code":400
            })
        }
    }
    
}

pub async fn login( db: &State<Database>, user_data: Option<Json<User>> ) -> Value {
    let users_collection : Collection<user::User> = db.collection("users");
    match user_data {
        //Deserialize 
        Some(user)=>{
            let filter = doc! { "email": &user.email };
            let targetted_user = users_collection.find_one(filter, None).await.unwrap();
            match targetted_user {
                Some(found_user)=>{
                    let password_is_correct = bcrypt::verify(&user.password, &found_user.password);
                    if !password_is_correct{
                        return json!({
                            "status":400
                        })    
                    }
                    let auth_token = generate_auth_token(&found_user.email);
                    match auth_token {
                        Some(token)=>{
                            return json!({
                                "status":200,
                                "token": token
                            })
                        },
                        None=>{
                            return json!({
                                "status":500
                            })        
                        }
                    }
                },
                None=>{
                    return json!({
                        "status":404
                    })
                }
            }
        },
        None=>{
            json!({
                "code":400
            })
        }
    }
}