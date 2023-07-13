import { Request, Response } from "express";
import { generic_server_error_message } from "../../Config";
import sql from "../../db";
import { ApiKey } from "../../utils";

export async function get_entries( req: Request<{ entity_name: string }, {}, { key: ApiKey }>, res: Response ){
    try {
        const { project } = req.body.key
        const { entity_name } = req.params
        const [entity] = await sql<{id:string}[]>`select id from entity where name=${entity_name} and project=${project}`
        if(!entity) return res.status(404).send({
            message:"Entity not found"
        })
        const entries = await sql` select * from entry where entity=${entity.id} `
        return res.status(200).send({
            data: entries
        })
    } catch (err) {
        console.log(`Error in get entries ${err}`)
        return res.status(500).send({
            message:generic_server_error_message
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
