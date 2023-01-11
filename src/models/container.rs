use serde::{Serialize, Deserialize};


#[derive(Serialize, Deserialize)]
pub struct Container {
    pub name : String,
    pub id: String,
    pub owner: String
}