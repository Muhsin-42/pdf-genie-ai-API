import express from "express";
import { getPdfUrl, uploadPdf } from "../controllers/pdf.controller.js";
import { ask, getConvos } from "../controllers/conversation.controller.js";
import upload from "../middlewares/multer.middleware.js";
import { Authenticate } from "../middlewares/auth.middleware.js";
const router = express.Router();

router.post("/pdf", upload.single("pdf"), uploadPdf);
router.get("/pdf/:clientSessinId", Authenticate, getPdfUrl);

router
  .route("/conversation/:clientSessinId")
  .post(Authenticate, ask)
  .get(Authenticate, getConvos);

export default router;
