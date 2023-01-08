use rocket::serde::json::{Value, Json};
use crate::models::user::User;
use crate::services::user;
use rocket::State;
use mongodb::Database;


#[post("/register", format="json", data="<user>")]
pub async fn register( db: &State<Database> ,user: Option<Json<User>> ) -> Value {
    user::register( &db, user).await
}

#[post("/login", format="json", data="<user>")]
pub async fn login( db: &State<Database>, user: Option<Json<User>> ) -> Value {
    user::login( &db, user).await
}