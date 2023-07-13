import { Request, Response } from "express"
import express from "express"
import cors from "cors"
import * as dotenv from "dotenv"
dotenv.config()
import sql from "./db"
import entities_v1 from "./routes/v1/entities"
import entries_v1 from "./routes/v1/entries"
const app = express()
app.use(cors())
app.use(express.json({ limit:"10mb" }))

const PORT = process.env.PORT || 5000

app.use(entities_v1)
app.use(entries_v1)

app.get("/health", async (_req: Request, res: Response) => {
    try {
        const db_version = await sql` select version() `
        return res.status(200).send(db_version)
    } catch (err) {
        return res.status(500).send(err)
    }
})

app.listen(PORT, async () => {
    const db_version = await sql` select version() `;
    console.log(db_version)
    console.log(`App listening on port ${PORT}`)
})
