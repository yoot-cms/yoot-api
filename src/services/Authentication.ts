/**
* Permettre a un user de creer un compte
* Permettre a un user de se connecter
*/
import { Request, Response } from "express";
import { hash_password } from "../utils";
import sql from "../db";

export async function get_all_users( _req:Request, res:Response ){
    try {
        const users = await sql` select * from users`
        return res.status(200).send({ users })
    } catch (error) {
        console.log(error)
        return res.status(500).send()
    }
}

export async function create_account(req: Request<{}, {}, { email:string, password:string }>, res: Response){
    try {
       //Get email and password 
        const body = req.body
        const email = body.email
        const password = body.email
        const db_email = await sql` select * from users where email=${email} `
        if(db_email.length!==0) return res.status(409).send()
        const hashed_password = hash_password(password)
        await sql`insert into users(email, password) values(${email}, ${hashed_password})`
        return res.status(201).send()
    } catch (err) {
        console.log(err)
        return res.status(500).send()
    }

}
