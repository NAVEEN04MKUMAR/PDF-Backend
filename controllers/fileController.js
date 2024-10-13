const upload = require('../middleware/multer.js'); 

const uploadFile = (req, res) => {
    const uploadedfile = req.file;

    console.log("File uploaded:", uploadedfile?.originalname);

    if (!uploadedfile) {
        return res.status(400).json({ error: 'No file uploaded' });
    }

    console.log(`File uploaded: ${uploadedfile.filename}`);
    res.json({ message: 'File uploaded successfully', filename: uploadedfile.filename });
};

module.exports = {
    uploadFile,
};
