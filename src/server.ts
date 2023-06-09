import express from "express"
import cors from "cors"
import * as dotenv from "dotenv"
dotenv.config()
import sql from "./db"
const app = express()
app.use(cors())
app.use(express.json())

const PORT = process.env.PORT || 5000

app.listen(PORT, async() => {
    const db_version = await sql` select version() `;
    console.log(db_version)
    console.log(`App listening on port ${PORT}`)
})
