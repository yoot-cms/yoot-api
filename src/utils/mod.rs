use rocket::serde::{Serialize, Deserialize};
use jsonwebtoken::{ Header, encode, EncodingKey };
use bcrypt::{ DEFAULT_COST, hash, verify };

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

pub fn hash_password( plain_test_password: &str ) -> Option<String>{
    let hashed = hash(plain_test_password, DEFAULT_COST).unwrap();
    Some(hashed)
}

pub fn verify_password( plain_test_password: &str, hashed_password: &str ) -> Option<bool> {
    let password_is_correct = verify(plain_test_password, hashed_password).unwrap();
    Some(password_is_correct)
}
