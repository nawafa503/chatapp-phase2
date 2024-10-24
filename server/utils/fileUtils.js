import multer from 'multer';

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, "uploads/");
    },
    filename: function (req, file, cb) {
      const ext = file.originalname.split('.').pop();
      const filename = `${file.fieldname}-${Date.now()}.${ext}`;
      cb(null, filename);
    }
});

const upload = multer({ storage: storage})

export default upload