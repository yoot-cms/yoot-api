create table users (
    id UUID default gen_random_uuid() PRIMARY KEY,
    email text not null,
    password text not null
);
