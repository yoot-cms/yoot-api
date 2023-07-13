import { Request, Response } from "express";
import { generic_error_message, generic_server_error_message } from "../../Config";
import sql from "../../db";
import { ApiKey, Permission, is_base_64 } from "../../utils";
import ImageKit from "imagekit";
const imagekit = new ImageKit({
    publicKey: process.env.IMAGEKIT_PUBLIC_KEY as string,
    privateKey: process.env.IMAGEKIT_PRIVATE_KEY as string,
    urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT as string
})

export async function create_entry(req: Request<{ entity_name: string }, {}, { key: ApiKey, value: Record<string, string | number | boolean> }>, res: Response) {
    try {
        const { entity_name } = req.params
        const { key: { permissions, project }, value } = req.body
        const parsed_permissions = JSON.parse(permissions) as Permission
        if (!parsed_permissions.create_permission) return res.status(403).send({
            message: "Key does not have permission to create entries"
        })
        if (!entity_name) return res.status(400).send({
            message: generic_error_message
        })
        if (!value || typeof value !== "object") return res.status(400).send({
            message: generic_error_message
        })
        const [entity] = await sql<{ id: string, project: string, schema: Record<string, "Text" | "Number" | "Boolean" | "Image"> }[]>`select * from entity where name=${entity_name} and project=${project}`
        if (!entity) return res.status(404).send({
            message: "Entity not found"
        })
        const valid_number_of_field = Object.keys(value).length === Object.keys(entity.schema).length
        const keys_match_schema = Object.keys(value).every(field => Object.keys(entity.schema).includes(field))
        if (
            !(
                valid_number_of_field && keys_match_schema
            )
        ) return res.status(400).send({
            message: "Bad entry value. Make sure all the fields are set corresponding to the Entity's schema"
        })
        let entry_value: Record<string, string | number | boolean> = {}
        const fields = Object.entries(entity.schema)
        await Promise.all(
            fields.map(async ([field_name, field_type]) => {
                const data = value[field_name]
                if (field_type === "Text") {
                    if (typeof data !== "string") return res.status(400).send({
                        message: `Field ${field_name} must be of type string`
                    })
                    entry_value[field_name] = data
                }
                if (field_type === "Number") {
                    if (typeof data !== "number") return res.status(400).send({
                        message: `Field ${field_name} must be of type number`
                    })
                    entry_value[field_name] = data
                }
                if (field_type === "Boolean") {
                    if (typeof data !== "boolean") return res.status(400).send({
                        message: `Field ${field_name} must be of type boolean`
                    })
                    entry_value[field_name] = data
                }
                if (field_type === "Image") {
                    if (typeof data !== "string") return res.status(400).send({
                        message: `Field ${field_name} must be a base64 encoded string`
                    })
                    if (!is_base_64(data as string)) return res.status(400).send({
                        message: `Field ${field_name} must be a base64 encoded string`
                    })
                    const media_id = crypto.randomUUID()
                    const { url } = await imagekit.upload({
                        file: data as string,
                        fileName: media_id
                    })
                    entry_value[field_name] = url
                }
            })
        )
        await sql`insert into entry(entity, value) values( ${entity.id}, ${sql.json(entry_value)} )`
        return res.status(201).send()
    } catch (err) {
        console.log(`Error in create entry ${err}`)
        return res.status(500).send({
            message: "Something went wrong. Please try again or contact support"
        })
    }
}

export async function get_entries(req: Request<{ entity_name: string }, {}, { key: ApiKey }>, res: Response) {
    try {
        const { project } = req.body.key
        const { entity_name } = req.params
        if (!entity_name) return res.status(400).send({
            message: generic_error_message
        })
        const [entity] = await sql<{ id: string }[]>`select id from entity where name=${entity_name} and project=${project}`
        if (!entity) return res.status(404).send({
            message: "Entity not found"
        })
        const entries = await sql` select * from entry where entity=${entity.id} `
        return res.status(200).send({
            data: entries
        })
    } catch (err) {
        console.log(`Error in get entries ${err}`)
        return res.status(500).send({
            message: generic_server_error_message
        })
    }
}

export async function update_entry(req: Request<{ entity_name: string, entry_id: string }, {}, { key: ApiKey, value: Record<string, string | number | boolean> }>, res: Response) {
    try {
        const { key: { permissions, project }, value } = req.body
        const { entry_id, entity_name } = req.params
        const parsed_permissions = JSON.parse(permissions) as Permission
        if (!parsed_permissions.write_permission) return res.status(403).send({
            message: "Key does not have the permissions to edit entries"
        })
        if (!entity_name || !entity_name) return res.status(400).send({
            message: generic_error_message
        })
        if (!value || typeof value !== "object") return res.status(400).send({
            message: generic_error_message
        })
        const [entity] = await sql<{ id: string, project: string, schema: Record<string, "Text" | "Number" | "Boolean" | "Image"> }[]>`select * from entity where name=${entity_name} and project=${project}`
        if (!entity) return res.status(404).send({
            message: "Entity not found"
        })
        const [entry] = await sql<{ id: string, entity: string, value: Record<string, string | number | boolean> }[]>` select * from entry where id=${entry_id} and entity=${entity.id}`
        if (!entry) return res.status(404).send({
            message: "Entry not found"
        })
        const keys_match_schema = Object.keys(value).every(field => Object.keys(entity.schema).includes(field))
        if (!keys_match_schema) return res.status(400).send({
            message: "Invalid entry value. Some fields are not present in the entity's schema"
        })
        const fields = Object.entries(entity.schema)
        let entry_value = entry.value
        await Promise.all(
            fields.map(async ([field_name, field_type]) => {
                const data = value[field_name]
                if (data) {
                    if (field_type === "Text") {
                        if (typeof data !== "string") return res.status(400).send({
                            message: `Field ${field_name} must be of type string`
                        })
                        entry_value[field_name] = data
                    }
                    if (field_type === "Number") {
                        if (typeof data !== "number") return res.status(400).send({
                            message: `Field ${field_name} must be of type number`
                        })
                        entry_value[field_name] = data
                    }
                    if (field_type === "Boolean") {
                        if (typeof data !== "boolean") return res.status(400).send({
                            message: `Field ${field_name} must be of type boolean`
                        })
                        entry_value[field_name] = data
                    }
                    if (field_type === "Image") {
                        if (typeof data !== "string") return res.status(400).send({
                            message: `Field ${field_name} must be a base64 encoded string`
                        })
                        if (!is_base_64(data as string)) return res.status(400).send({
                            message: `Field ${field_name} must be a base64 encoded string`
                        })
                        const media_id = crypto.randomUUID()
                        const { url } = await imagekit.upload({
                            file: data as string,
                            fileName: media_id
                        })
                        entry_value[field_name] = url
                    }
                }
            })
        )
        await sql` update entry set value=${sql.json(entry_value)} where id=${entry.id} `
        return res.status(200).send()
    } catch (err) {
        console.log(`Error in update entry ${err}`)
        return res.status(500).send({
            message: generic_server_error_message
        })
    }
}

export async function delete_entry(req: Request<{ entity_name: string, entry_id: string }, {}, { key: ApiKey }>, res: Response) {
    try {
        const { project, permissions } = req.body.key
        const { entity_name, entry_id } = req.params
        const parsed_permissions = JSON.parse(permissions) as Permission
        if (!parsed_permissions.delete_permission) return res.status(403).send({
            message: "Key does not have permission to delete entries"
        })
        if (!entity_name || !entry_id) return res.status(400).send({
            message: generic_error_message
        })
        const [entity] = await sql<{ id: string }[]>`select id from entity where name=${entity_name} and project=${project}`
        if (!entity) return res.status(404).send({
            message: "Entity not found"
        })
        await sql`delete from entry where id=${entry_id} and entity=${entity.id}`
        return res.status(200).send()
    } catch (err) {
        console.log(`Error in delete entry ${err}`)
        return res.status(500).send({
            message: generic_server_error_message
        })
    }
}
