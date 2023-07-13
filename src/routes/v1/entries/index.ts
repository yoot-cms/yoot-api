import { Router } from "express";
import { authenticate_request } from "../../../middlewares/Auth";
import { get_entries, create_entry, delete_entry, update_entry } from "../../../services/v1/Entries";

const entries_v1 = Router()

entries_v1.route("/v1/entities/:entity_name/entries").get( authenticate_request, get_entries )

entries_v1.route("/v1/entities/:entity_name/entries").post( authenticate_request, create_entry )

entries_v1.route("/v1/entities/:entity_name/entries/:entry_id").delete( authenticate_request, delete_entry )

entries_v1.route("/v1/entities/:entity_name/entries/:entry_id").patch( authenticate_request, update_entry )

export default entries_v1
