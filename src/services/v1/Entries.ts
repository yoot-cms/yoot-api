import { Request, Response } from "express";
import { generic_error_message, generic_server_error_message } from "../../Config";
import sql from "../../db";
import { ApiKey, Permission } from "../../utils";

export async function create_entry( req: Request, res: Response ){
    try {

    } catch (err) {
        console.log(`Error in create entry ${err}`)
        return res.status(500).send({
            message:"Something went wrong. Please try again or contact support"
        })
    }
}

export async function get_entries( req: Request<{ entity_name: string }, {}, { key: ApiKey }>, res: Response ){
    try {
        const { project } = req.body.key
        const { entity_name } = req.params
        if(!entity_name) return res.status(400).send({
            message:generic_error_message
        })
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

export async function update_entry(){}

export async function delete_entry( req: Request<{ entity_name:string, entry_id:string }, {}, { key: ApiKey }>, res: Response ){
    try {
        const { project, permissions } = req.body.key
        const { entity_name, entry_id } = req.params
        const parsed_permissions = JSON.parse(permissions) as Permission 
        if(!parsed_permissions.delete_permission) return res.status(403).send({
            message:"Key does not have permission to delete entries"
        })
        if(!entity_name || !entry_id) return res.status(400).send({
            message:generic_error_message
        })
        const [entity] = await sql<{id:string}[]>`select id from entity where name=${entity_name} and project=${project}`
        if(!entity) return res.status(404).send({
            message:"Entity not found"
        })
        await sql`delete from entry where id=${entry_id} and entity=${entity.id}`
        return res.status(200).send()
    } catch (err) {
        console.log(`Error in delete entry ${err}`)
        return res.status(500).send({
            message:generic_server_error_message
        })
    }
}
