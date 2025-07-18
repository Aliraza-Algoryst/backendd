import multer from "multer";

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // console.log(req);

    cb(null, "./public/upload");
  },
  filename: function (req, file, cb) {
    // console.log(req, "there is meee");

    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + "-" + uniqueSuffix);
  },
});

const upload = multer({ storage: storage });

export { upload };
