import { Request, Response } from "express";
import sql from "../../db";
import { ApiKey, Permission } from "../../utils";

export async function get_entries( req: Request<{}, {}, { key: ApiKey }>, res: Response ){
    try {
        const { project } = req.body.key
        const entries = await sql` select * from entry where project = ${project} `
    } catch (err) {
        console.log(`Error in get entries ${err}`)
        return res.status(500).send({
            message:"Something went wrong. Please try again or contact support"
        })
    }
}

export async function create_entry( req: Request, res: Response ){
    try {
        
    } catch (err) {
        console.log(`Error in create entry ${err}`)
        return res.status(500).send({
            message:"Something went wrong. Please try again or contact support"
        })
    }
}
