import { Router } from "express"
import { authenticate_request } from "../../middlewares/Auth"
import { get_entities } from "../../services/Entities"

const entities_router = Router()

entities_router.route("/entities").get( authenticate_request, get_entities )
entities_router.route("/entities").post( authenticate_request, get_entities )
entities_router.route("/entities").delete( authenticate_request, get_entities )

export default entities_router
