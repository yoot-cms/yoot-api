use serde::{Serialize, Deserialize};

#[derive(Serialize, Deserialize)]
pub struct Container {
    pub _id: String,
    pub name : String,
    pub owner: String,
    pub created_at: String
}