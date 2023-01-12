use crate::models::{container::Container, auth_token::AuthToken};
use rocket::{State};
use mongodb::Database;

#[post("/create")]
pub fn create( auth_token: AuthToken ) -> String {
    auth_token.0.to_string()
}