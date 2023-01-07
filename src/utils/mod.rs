use rocket::serde::{Serialize, Deserialize};
use jsonwebtoken::{ Header, encode, EncodingKey };


#[derive(Serialize, Deserialize)]
pub struct Claims{
    exp: u32,
    email: String
}

pub fn generate_auth_token( email: &str ) -> Option<String> {
    let new_token = Claims{
        exp:123456789,
        email:String::from(email)
    };
    let token = encode(&Header::default(), &new_token, &EncodingKey::from_secret("secret".as_ref()));
    match token {
        Ok(value)=>{
            Some(value)
        },
        Err(error)=>{
            println!("{}", error);
            Some("Something went wrong".to_string())
        }
    }
}