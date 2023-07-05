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
