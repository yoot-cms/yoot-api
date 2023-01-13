use serde::{Serialize, Deserialize};

#[derive(Serialize, Deserialize)]
pub struct Container {
    pub name : String,
    pub owner: String,
    pub created_at: String
}