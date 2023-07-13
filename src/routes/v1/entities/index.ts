import { Router } from "express"
import { authenticate_request } from "../../../middlewares/Auth"
import { get_entities, delete_entity, create_entity, update_entity } from "../../../services/v1/Entities"

const entities_v1 = Router()

entities_v1.route("/v1/entities").get( authenticate_request, get_entities )

entities_v1.route("/v1/entities/:name").delete( authenticate_request, delete_entity )

entities_v1.route("/v1/entities").post( authenticate_request, create_entity )

entities_v1.route("/v1/entities/:name").put( authenticate_request, update_entity)

export default entities_v1
