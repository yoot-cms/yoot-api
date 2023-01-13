use mongodb::{ Database, bson::oid::ObjectId };
use rocket::futures::StreamExt;
use rocket::serde::json::Json;
use crate::models::container::Container;
use rocket::serde::json::{serde_json::json, Value };
use rocket::State;
use mongodb::bson::{doc, Document};
use chrono::Local;
use crate::utils::ContainerCreationRequest;


pub async fn create_container( db: &State<Database>, container: Option<Json<ContainerCreationRequest>>, user: String ) -> Value {
    let containers_collection = db.collection::<Container>("containers");
    match container {
        Some(container)=>{
            let filter = doc! { "owner":user.to_string(), "name": container.name.to_string() };
            let potential_duplicate = containers_collection.find_one(filter, None).await.unwrap();
            match potential_duplicate {
                Some(_)=>{
                    json!({
                        "status":409
                    })
                },
                None=>{
                    let new_container: Container = Container{
                        name: container.name.to_string(),
                        owner: user.to_string(),
                        created_at: Local::now().date_naive().format("%Y-%m-%d").to_string(),
                        _id : ObjectId::new().to_string()
                    };
                    let insertion_result = containers_collection.insert_one(new_container, None).await;
                    match insertion_result {
                        Ok(_)=>{
                            json!({
                                "status":201
                            })
                        },
                        Err(_)=>{
                            json!({
                                "status":400
                            })
                        }
                    }
                }
            }
        },
        None=>{
            json!({
                "status":400,
                "message":"`name` is a required parameter"
            })
        }
    }
}

//TODO - Return the number of entities and ressources in the containers
pub async fn get_all_containers( db: &State<Database>, user: String ) -> Value {
    let filter = doc! {"owner":&user};
    let containers_collection = db.collection("containers");
    let mut containers_cursor = containers_collection.find(filter, None).await.unwrap();
    let mut containers: Vec<Document> = vec![];
    while let Some(document) = containers_cursor.next().await {
        match document {
            Ok(container)=>{
                containers.push(container);
            },
            Err(_)=>{}
        }
    }
    json!({
        "status":200,
        "data":containers
    })
}

pub async fn get_one_container( db: &State<Database>, container_name: String ) -> Value{
    let containers_collection = db.collection::<Container>("containers");
    let filter = doc! {"name": container_name.to_string()};
    let targetted_container = containers_collection.find_one(filter, None).await;
    match targetted_container {
        Ok(value)=>{
            match value {
                Some(container_data)=>{
                    json!({
                        "status":200,
                        "data": container_data
                    })
                },
                None=>{
                    json!({
                        "status":404
                    })
                }
            }
        },
        Err(_)=>{
            json!({
                "status":"500"
            })
        }
        
    }
}