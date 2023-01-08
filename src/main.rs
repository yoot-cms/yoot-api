#[macro_use] extern crate rocket;
extern  crate bcrypt;

mod utils;
mod services;
mod routes;
mod models;
mod db;

use routes::user::{login, register};

#[launch]
fn rocket() -> _ {
    rocket::build()
        .attach(db::init())
        .mount("/auth", routes![register, login])
}