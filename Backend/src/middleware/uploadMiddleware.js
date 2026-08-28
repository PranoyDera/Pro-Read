import fs from "fs";
import path from "path";
import multer from "multer";

const achievementsDir = path.join(process.cwd(), "uploads", "achievements");
const storiesDir = path.join(process.cwd(), "uploads", "stories");

if (!fs.existsSync(achievementsDir)) {
  fs.mkdirSync(achievementsDir, { recursive: true });
}
if (!fs.existsSync(storiesDir)) {
  fs.mkdirSync(storiesDir, { recursive: true });
}

const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|svg|webp|gif/;
  const extName = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimeType = allowedTypes.test(file.mimetype);

  if (extName && mimeType) {
    cb(null, true);
  } else {
    cb(new Error("Only image files (jpeg, jpg, png, svg, webp, gif) are allowed!"), false);
  }
};

const achievementStorage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, achievementsDir),
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, `achievement-${uniqueSuffix}${ext}`);
  }
});

const storyStorage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, storiesDir),
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, `story-${uniqueSuffix}${ext}`);
  }
});

export const uploadAchievementIcon = multer({
  storage: achievementStorage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }
});

export const uploadStoryCover = multer({
  storage: storyStorage,
  fileFilter,
  limits: { fileSize: 10 * 1024 * 1024 }
});
