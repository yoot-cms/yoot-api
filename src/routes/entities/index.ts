import { Router } from "express"
import { authenticate_request } from "../../middlewares/Auth"
import { get_entities, delete_entity, create_entity, update_entity } from "../../services/Entities"

const entities_router = Router()

entities_router.route("/entities").get( authenticate_request, get_entities )

entities_router.route("/entities/:name").delete( authenticate_request, delete_entity )

entities_router.route("/entities").post( authenticate_request, create_entity )

entities_router.route("/entities/:name").put( authenticate_request, update_entity)
export default entities_router
