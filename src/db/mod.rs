use mongodb::options::ClientOptions;
use mongodb::{Client, Database};
use rocket::fairing::AdHoc;

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
    let mongo_uri = "mongodb://mongo:5206QBEhvK4biGt6xlKb@containers-us-west-170.railway.app:5735/?retryWrites=true&w=majority&authSource=admin";
    let client_options = ClientOptions::parse(mongo_uri).await?;
    let mongo_client = Client::with_options(client_options)?;
    let database = mongo_client.database("test");
    println!("Connected to db successfully");
    Ok(database)
}

