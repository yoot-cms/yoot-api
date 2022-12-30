use rocket::serde::Serialize;
use rocket::serde::json::Value;
#[derive(Serialize)]
pub struct CustomResponse{
    pub data: Value
}