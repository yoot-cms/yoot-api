import bcrypt from "bcrypt"
const salt_rounds = 5

export function hash_password(password: string){
    return bcrypt.hashSync(password, salt_rounds)
}
