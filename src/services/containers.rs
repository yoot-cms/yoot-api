use mongodb::Database;
use rocket::futures::StreamExt;
use crate::models::container::Container;
use rocket::serde::json::{ Json, serde_json::json, Value };
use rocket::State;
use mongodb::bson::doc;


pub async fn create_container( db: &State<Database>, container: Option<Json<Container>>, user: String ) -> Value {
    let containers_collection = db.collection::<Container>("containers");
    match container {
        Some(container)=>{
            let new_container: Container = Container{
                name: container.name.to_string(),
                owner: user.to_string(),
                created_at: container.created_at.to_string()
            };
            let filter = doc! { "owner":user.to_string(), "name": container.name.to_string() };
            let potential_duplicate = containers_collection.find_one(filter, None).await.unwrap();
            match potential_duplicate {
                Some(_)=>{
                    json!({
                        "status":409
                    })
                },
                None=>{
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
                "status":400
            })
        }
    }
}

pub async fn get_all_containers( db: &State<Database>, user: String ) -> Value {
    let filter = doc! {"owner":&user};
    let containers_collection = db.collection::<Container>("containers");
    let mut containers_cursor = containers_collection.find(filter, None).await.unwrap();
    let mut containers: Vec<Container> = vec![];
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