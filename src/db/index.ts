import postgres from "postgres";
const DB_URL = process.env.DB_URL as string

const sql = postgres(DB_URL, {
    ssl:"require"
})

export default sql
