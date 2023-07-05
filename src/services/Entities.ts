import { Request, Response } from "express";
import sql from "../db";


export async function get_entities(req: Request, res: Response){
    try {
        
    } catch (err) {
        console.log(err)
        return res.status(500).send()
    }
} 
