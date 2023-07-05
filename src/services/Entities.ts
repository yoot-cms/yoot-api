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
        const { name } = req.params
        return res.status(200).send()
    } catch (err) {
        console.log(`Error in delete entity`)
        return res.status(500).send()
    }
}
