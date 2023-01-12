use rocket::request::{ self, FromRequest, Outcome, Request };
use rocket::http::{ Status };
use crate::utils::verify_and_decode_token;

#[derive(Debug)]
pub struct AuthToken(pub String);

#[derive(Debug)]
pub enum AuthError{
    MissingToken,
    InvalidToken,
}

#[rocket::async_trait]
impl<'r> FromRequest<'r> for AuthToken {
    type Error = AuthError;

    async fn from_request(req: &'r Request<'_>) -> request::Outcome<Self, Self::Error> {
        match req.headers().get_one("Authorization") {
            Some(value)=>{
                let token_verification_result = verify_and_decode_token(value.into());
                match token_verification_result {
                    Some(value)=>{
                        match value.as_str() {
                            ""=>{
                                Outcome::Failure((Status::Unauthorized, AuthError::InvalidToken))
                            },
                            _=>{
                                Outcome::Success(AuthToken(value))
                            }
                        }
                    },
                    None=>{
                        Outcome::Failure((Status::Unauthorized, AuthError::InvalidToken))
                    }
                }
            },
            None=>{
                Outcome::Failure((Status::Unauthorized, AuthError::MissingToken))
            }
        }
    }
}