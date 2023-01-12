#[macro_use] extern crate rocket;
extern crate bcrypt;

mod utils;
mod services;
mod routes;
mod models;
mod db;

use routes::user::{login, register};
use routes::containers::{create};

#[launch]
fn rocket() -> _ {
    rocket::build()
        .attach(db::init())
        .mount("/auth", routes![register, login])
        .mount("/container", routes![create])
}