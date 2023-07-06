import { Request, Response } from "express";
import { type } from "os";
import sql from "../db";
import { ApiKey, Permission, entity_data_is_valid } from "../utils";

export async function get_entities(req: Request<{}, {}, { key: ApiKey }>, res: Response) {
    try {
        const { project } = req.body.key
        const data = await sql` select * from entity where project=${project} `
        return res.status(200).send({
            data
        })
    } catch (err) {
        console.log(err)
        return res.status(500).send()
    }
} 

export async function create_entity( req: Request<{}, {}, { name:string, schema:Record<string, string>, key: ApiKey }>, res: Response ){
    try {
        const { key:{ permissions, project }, name, schema } = req.body
        if(!name || !schema || name==="" || typeof schema!=="object") return res.status(400).send({
            message:"Bad request. See Yoot documentation for more details about how to create an entity"
        })
        const parsed_permissions = JSON.parse(permissions) as Permission
        if(!parsed_permissions.create_permission) return res.status(403).send({
            message:"Key does not have permission to create entities"
        })
        const [duplicate_entity] = await sql` select name from entity where name=${name} and project=${project} `
        if(duplicate_entity) return res.status(409).send({
            message:"An entity with the same name already exists in the same project"
        })
        const fields = Object.keys(schema)
        const types = Object.values(schema)
        const { status, message } = entity_data_is_valid( fields, types )
        if(!status) return res.status(400).send({ message })
        await sql` 
            insert into entity(name, project, schema) 
            values( ${name}, ${project}, ${JSON.stringify(schema)} ) 
        `
        return res.status(201).send({
            message:"Entity created successfuly"
        })
    } catch (err) {
        console.log(`Error in create entity ${err}`)
    }
}

export async function delete_entity( req: Request<{ name: string }, {}, { key: ApiKey }>, res: Response ){
    try {
        const { project } = req.body.key
        const { name } = req.params
        const trashed = await sql `select trashed from entity where name = ${name}`
        
        if (trashed.length === 1) {
        await sql `DELETE FROM entity
        WHERE name = ${name} and project = ${project} `      
        }        
        return res.status(200).send()
    } catch (err) {
        console.log(`Error in delete entity ${err}`)
        return res.status(500).send()
    }
}

export async function trash_entity( req: Request<{ name: string }, {}, { key: ApiKey }>, res: Response ){
    try {
        const { project } = req.body.key
        const { name } = req.params
        await sql `UPDATE entity SET trashed = true WHERE name = ${name} and project = ${project}`
        return res.status(200).send()
    } catch (err) {
        console.log(`Error in trash entity`)
        return res.status(500).send()
    }
}
