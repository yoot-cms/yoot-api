export function verify_api_key(api_key : string){
    if (api_key === "" ) {
        return false
    }

    const values = api_key.split(".")
    if (values.length !==2) {
        return false
    }

    const [encrypted_id, key] = values
    return {
        status : true,
        data: [
            encrypted_id,
            key
        ]
    }
}