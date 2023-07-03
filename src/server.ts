import { Request, Response } from "express"
import express from "express"
import cors from "cors"
import * as dotenv from "dotenv"
import { verify_api_key } from "./utils";
dotenv.config()
import sql from "./db"
const app = express()
app.use(cors())
app.use(express.json())

const PORT = process.env.PORT || 5000

//Creer une fonction qui prendre en parametre un string 
//et qui retourne False si le string est vide ""
//si le string ne contient pas exactement un seul "."
//retourne true et les deux parties du tableau resultant du split du string si les conditions sont reunies

app.get("/entity", (req: Request, res: Response)=>{
    try {
        const api_key = req.headers["x-api-key"] as string ?? ""
        const api_key_is_valid = verify_api_key(api_key)
    } catch (err) {
        console.log(err)
        return res.status(500).send()
    }
})

app.post("/entity", (req: Request, res: Response)=>{
    try {
        const api_key = req.headers["x-api-key"] as string ?? ""
    } catch (err) {
        console.log(err)
        return res.status(500).send()
    }
})
app.put("/entity", (req: Request, res: Response)=>{
    try {
        const api_key = req.headers["x-api-key"] as string ?? ""
    } catch (err) {
        console.log(err)
        return res.status(500).send()
    }
})

app.delete("/entity", (req: Request, res: Response)=>{
    try {
        const api_key = req.headers["x-api-key"] as string ?? ""
    } catch (err) {
        console.log(err)
        return res.status(500).send()
    }
})

app.listen(PORT, async() => {
    const db_version = await sql` select version() `;
    console.log(db_version)
    console.log(`App listening on port ${PORT}`)
})
