use rocket::serde::{Serialize, Deserialize};
use jsonwebtoken::{ Header, encode, EncodingKey, decode, DecodingKey, Validation };
use bcrypt::{ hash_with_salt };


#[derive(Serialize, Deserialize)]
pub struct Claims{
    exp: u32,
    email: String
}


#[derive(Serialize, Deserialize)]
pub struct ContainerCreationRequest{
    pub name: String
}

pub fn generate_auth_token( email: &str ) -> Option<String> {
    let new_token = Claims{
        exp:4000000000,
        email:String::from(email)
    };
    let token = encode(&Header::default(), &new_token, &EncodingKey::from_secret("secret".as_ref()));
    match token {
        Ok(value)=>{
            Some(value)
        },
        Err(_)=>{
            Some("Something went wrong".to_string())
        }
    }
}

pub fn verify_and_decode_token( bearer_token: &str ) -> Option<String>{
    let token: Vec<&str> = bearer_token.split(" ").collect();
    let decoded_token = decode::<Claims>(&token[1], &DecodingKey::from_secret("secret".as_ref()), &Validation::default());
    match decoded_token {
        Ok(token)=>{
            Some(token.claims.email)
        },
        Err(_)=>{
            Some("".to_string())
        }
    }
    
}

pub fn hash_password( plain_text_password: &str ) -> Option<String> {
    let salt = b"$2b$12$/KjY5W7.8";
    let hashed = hash_with_salt(plain_text_password, 4, *salt).unwrap();
    Some(hashed.to_string())
}

pub fn verify_password( plain_text_password: &str, hash: &str ) -> Option<bool> {
    let new_hash = hash_password(plain_text_password).unwrap();
    Some( new_hash==hash )
}