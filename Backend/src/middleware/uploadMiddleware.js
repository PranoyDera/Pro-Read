import multer from "multer";

const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|svg|webp|gif/;
  const mimeType = allowedTypes.test(file.mimetype);

  if (mimeType || allowedTypes.test(file.originalname.toLowerCase())) {
    cb(null, true);
  } else {
    cb(new Error("Only image files (jpeg, jpg, png, svg, webp, gif) are allowed!"), false);
  }
};

// Memory storage keeps file buffers in memory for direct cloud upload to Cloudinary
const memoryStorage = multer.memoryStorage();

export const uploadAchievementIcon = multer({
  storage: memoryStorage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }
});

export const uploadStoryCover = multer({
  storage: memoryStorage,
  fileFilter,
  limits: { fileSize: 10 * 1024 * 1024 }
});
