export const ONBOARDING_PROGRESS = {
  notStarted: 0,
  inputReceived: 60,
  completed: 100,
};

export const ALLOWED_CV_EXTENSIONS = [".pdf", ".docx"];

export const ALLOWED_CV_MIME_TYPES = [
  "application/pdf",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/octet-stream",
];

export const MAX_CV_FILE_SIZE_BYTES = 5 * 1024 * 1024;
