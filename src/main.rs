#[macro_use] extern crate rocket;

mod utils;
mod services;
mod routes;
mod models;
pub mod db;

use routes::user::{login, register};

#[launch]
fn rocket() -> _ {
    rocket::build()
        .mount("/auth", routes![register, login])
}