import multer from "multer";

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype !== "application/pdf") {
    return cb(new Error("Only PDF files are allowed!"), false);
  }
  if (file.size > 1.5 * 1024 * 1024) {
    return cb(new Error("File size should be less than  1.5 MB!"), false);
  }
  cb(null, true);
};

const upload = multer({ storage, fileFilter });

export default upload;
