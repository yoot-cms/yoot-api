use rocket::serde::{Serialize, Deserialize};
use jsonwebtoken::{ Header, encode, EncodingKey };
use bcrypt::{ hash_with_salt };

#[derive(Serialize, Deserialize)]
pub struct Claims{
    exp: u32,
    email: String
}

pub fn generate_auth_token( email: &str ) -> Option<String> {
    let new_token = Claims{
        exp:100000,
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

pub fn hash_password( plain_text_password: &str ) -> Option<String>{
    let hashed = hash_with_salt( plain_text_password, 4, "saltyspringbrehe".as_bytes() );

}