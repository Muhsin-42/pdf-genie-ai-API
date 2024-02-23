import fs from "fs";
import { PdfReader } from "pdfreader";
import { generateSessionId } from "../utils/index.js";
import jwt from "jsonwebtoken";
import { SESSION_SECRET_KEY } from "../utils/constants.js";
import { redis } from "../helpers/redis.js";
import { getObjectURL, putObjectURL } from "../helpers/s3client.js";
import axios from "axios";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";

export const uploadPdf = asyncHandler(async (req, res) => {
  try {
    const pdfBuffer = fs.readFileSync(req.file.path);
    let content = "data";
    let isEndOfBuffer = false;

    new PdfReader().parseBuffer(pdfBuffer, async (err, item) => {
      if (err) return res.status(500).send({ error: "Error processing PDF" });
      if (!item) isEndOfBuffer = true;
      else if (item.text) content = `${content} ${item.text}`;

      if (isEndOfBuffer) {
        const sessionId = generateSessionId();
        const token = jwt.sign({ sessionId }, SESSION_SECRET_KEY, {
          expiresIn: "1d",
        });

        redis.set(sessionId, content);

        const filename = `${sessionId}.pdf`;
        const s3Url = await putObjectURL(filename, "application/pdf");

        try {
          await axios.put(s3Url, pdfBuffer, {
            headers: {
              "Content-Type": "application/pdf",
            },
          });
          const pdfUrl = await getObjectURL(`pdfs/${filename}`);
          fs.unlink(req.file.path, (err) => {
            if (err) console.log("Error unlinking pdf ", pdf);
          });

          return res
            .status(200)
            .json(new ApiResponse(200, { token, sessionId, pdfUrl }));
        } catch (error) {
          throw new ApiError(
            500,
            error?.message || "Error uploading PDF to S3"
          );
        }
      }
    });
  } catch (error) {
    throw new ApiError(500, error?.message || "Something Went Wrong");
  }
});

export const getPdfUrl = asyncHandler(async (req, res) => {
  try {
    const sessionId = req.params?.clientSessinId;
    const filename = `${sessionId}.pdf`;
    const pdfUrl = await getObjectURL(`pdfs/${filename}`);
    return res.status(200).json(new ApiResponse(200, { pdfUrl }));
  } catch (error) {
    throw new ApiError(500, error?.message || "Something Went Wrong");
  }
});
