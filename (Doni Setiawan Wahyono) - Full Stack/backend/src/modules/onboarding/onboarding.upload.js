import path from "node:path";

import multer from "multer";

import { ApiError } from "../../utils/api-error.js";
import {
  ALLOWED_CV_EXTENSIONS,
  ALLOWED_CV_MIME_TYPES,
  MAX_CV_FILE_SIZE_BYTES,
} from "./onboarding.constants.js";

const storage = multer.memoryStorage();

function cvFileFilter(_req, file, callback) {
  const extension = path.extname(file.originalname).toLowerCase();
  const isAllowedExtension = ALLOWED_CV_EXTENSIONS.includes(extension);
  const isAllowedMimeType = ALLOWED_CV_MIME_TYPES.includes(file.mimetype);

  if (!isAllowedExtension || !isAllowedMimeType) {
    callback(new ApiError(400, "Only PDF or DOCX CV files are allowed."));
    return;
  }

  callback(null, true);
}

export const uploadCv = multer({
  storage,
  fileFilter: cvFileFilter,
  limits: {
    fileSize: MAX_CV_FILE_SIZE_BYTES,
    files: 1,
  },
}).single("cv");
