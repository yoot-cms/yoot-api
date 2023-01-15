use crate::models::auth_token::AuthToken;
use rocket::State;
use rocket::serde::json::{ Json, Value};
use mongodb::Database;
use crate::services::containers::{ create_container, get_all_containers, get_one_container, delete_container };
use crate::utils::ContainerCreationRequest;

#[post("/create", format="json", data="<container>")]
pub async fn create( auth_token: AuthToken, db: &State<Database>, container: Option<Json<ContainerCreationRequest>> ) -> Value {
    create_container(&db, container, auth_token.0.to_string()).await
}

#[get("/get_all")]
pub async fn get_all( auth_token: AuthToken, db: &State<Database> ) -> Value{
    get_all_containers(db, auth_token.0).await
}

#[get("/get/<container_name>")]
pub async fn get_one( auth_token: AuthToken, db: &State<Database>, container_name: String ) -> Value{
    get_one_container(db, container_name).await
}

#[delete("/delete/<container_name>")]
pub async fn delete_one( auth_token: AuthToken, db: &State<Database>, container_name: String ) -> Value {
    delete_container( db, container_name, auth_token.0.to_string() ).await
}