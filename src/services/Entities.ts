import { Request, Response } from "express";
import sql from "../db";
import type { ApiKey } from "../utils";

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
        console.log(`Error in delete entity`)
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
