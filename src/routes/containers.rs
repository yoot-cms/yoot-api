use crate::models::{container::Container, auth_token::AuthToken};
use rocket::State;
use rocket::serde::json::{Json, Value};
use mongodb::Database;
use crate::services::containers::{ create_container, get_all_containers };

#[post("/create", format="json", data="<container>")]
pub async fn create( auth_token: AuthToken, db: &State<Database>, container: Option<Json<Container>> ) -> Value {
    create_container(&db, container, auth_token.0.to_string()).await
}

#[get("/get_all")]
pub async fn get_all( auth_token: AuthToken, db: &State<Database> ) -> Value{
    get_all_containers(db, auth_token.0).await
}