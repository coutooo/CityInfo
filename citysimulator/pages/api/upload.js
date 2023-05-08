import multer from 'multer';
import nextConnect from 'next-connect';

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './public/uploads'); // change the directory to wherever you want to save uploaded files
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage: storage });

const apiRoute = nextConnect({
  onError(error, req, res) {
    console.log(error);
    res.status(500).json({ error: 'Sorry, something went wrong' });
  },
  onNoMatch(req, res) {
    res.status(405).json({ error: `Method ${req.method} not allowed` });
  },
});

apiRoute.post(upload.single('file'), async (req, res) => {
  console.log('uploading');
  const { file } = req;
  console.log(file);
  res.status(200).json({ message: 'File uploaded successfully' });
});

export default apiRoute;
