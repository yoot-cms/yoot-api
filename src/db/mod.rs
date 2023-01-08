use mongodb::options::ClientOptions;
use mongodb::{Client, Database};
use rocket::fairing::AdHoc;
// use std::env;


pub fn init() -> AdHoc{
    AdHoc::on_ignite("Connecting to mongoo", | rocket | async {
        match establish_connection().await {
            Ok(database)=>{
                rocket.manage(database)
            },
            Err(_)=>{
                panic!("Failed to connect to database")
            }            
        }
    } )
}

pub async fn establish_connection() -> mongodb::error::Result<Database> {
    // let option_mongo_uri = env::var_os("DB_URL");
    // let db_url: String;
    // match  option_mongo_uri {
    //     Some(url)=>{
    //         let mongo_url= &url.to_string_lossy();
    //         db_url = mongo_url.to_string();
    //     },
    //     None =>{
    //         db_url = "mongodb://localhost:27017".to_string();
    //     }
    // }
    let mongo_uri = "mongodb://mongo:5206QBEhvK4biGt6xlKb@containers-us-west-170.railway.app:5735/?retryWrites=true&w=majority&authSource=admin";
    let client_options = ClientOptions::parse(mongo_uri).await?;
    let mongo_client = Client::with_options(client_options)?;
    let database = mongo_client.database("pigeoncms");
    println!("Connected to db successfully");
    Ok(database)
}

