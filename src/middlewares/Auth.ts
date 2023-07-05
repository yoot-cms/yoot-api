import { NextFunction, Request, Response } from "express";
import sql from "../db";
import { API_KEY_PREFIX } from "../Config";
import bcrypt from "bcrypt"
import type { ApiKey } from "../utils";

export async function authenticate_request(req: Request, res: Response, next: NextFunction) {
    try {
        const api_key = req.headers["authorization"] ?? ""
        if (api_key === "") return res.status(401).send({
            message: "API key not found in authorization header"
        })
        const splitted_key = api_key.split("$")
        if (splitted_key.length !== 2) return res.status(401).send({
            message: "Invalid API key. Contact support if you think this is an error from us"
        })
        const [partial_id, key] = splitted_key
        const db_id = `${API_KEY_PREFIX}_${partial_id}`
        const [db_key] = await sql<ApiKey[]>` select * from api_key where id=${db_id} `
        if (!db_key) return res.status(401).send({
            message: "Invalid API key. Contact support if you think this is an error from us"
        })
        const key_matches = await bcrypt.compare(key, db_key.key)
        if (!key_matches) return res.status(401).send({
            message: "Invalid API key. Contact support if you think this is an error from us"
        })
        req.body.key = db_key
        next()
    } catch (err) {
        console.log(`Error from Auth middleware: ${err}`)
        return res.status(500).send({
            message:"Something went wrong. Please retry or contact support"
        })
    }
}
