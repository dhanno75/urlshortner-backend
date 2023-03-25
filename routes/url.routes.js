import express from "express";
import { deleteUrl, generateUrl, getUrl } from "../services/url.services.js";

const router = express.Router();

router.post("/generateUrl", generateUrl);
router.get("/:urlId", getUrl);
router.delete("/:urlId", deleteUrl);

export default router;
