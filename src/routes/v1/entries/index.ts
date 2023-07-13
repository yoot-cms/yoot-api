import { Router } from "express";
import { authenticate_request } from "../../../middlewares/Auth";
import { get_entries, create_entry } from "../../../services/v1/Entries";

const entries_v1 = Router()

entries_v1.route("/v1/entities/:entity_name/entries").get( authenticate_request, get_entries )

export default entries_v1
