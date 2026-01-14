import multer from "multer";
import path from "path";

/* 🟢 Stockage des CV (PDF uniquement) */
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/cvs");
  },
  filename: (req, file, cb) => {
    const nomFichier =
      Date.now() + "-" + file.originalname.replace(/\s+/g, "");
    cb(null, nomFichier);
  },
});

/* 🟢 Filtre : PDF seulement */
const fileFilter = (req, file, cb) => {
  if (file.mimetype === "application/pdf") {
    cb(null, true);
  } else {
    cb(
      new Error("Seuls les fichiers PDF sont autorisés (CV)"),
      false
    );
  }
};

export const uploadCV = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5 MB
  },
});
