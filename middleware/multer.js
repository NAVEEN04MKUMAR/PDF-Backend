const multer = require('multer');
const path = require('path');
const fs = require('fs');


// const uploadsDir = path.join(__dirname, 'uploads-file1/');

// Create the uploads directory if it doesn't exist
// if (!fs.existsSync(uploadsDir)) {
//     fs.mkdirSync(uploadsDir, { recursive: true });
// }

const storage = multer.memoryStorage();


// const storage = multer.diskStorage({
//     destination: function (req, file, cb) {
//         console.log('Destination called');
       
//         cb(null, uploadsDir); // Folder where files will be saved
//     },
//     filename: function (req, file, cb) {
//         console.log(`Uploading file: ${file.originalname}`); // Log file info
//         cb(null, `${Date.now()}_${file.originalname}`);
//     }
// });

const fileFilter = (req, file, cb) => {
    console.log("Uploaded File: ", file.originalname); // Log the original file name
        console.log("MIME Type: ", file.mimetype);

    const allowedfiletypes=/\.(pdf|jsx|html)$/;
    const mimetypes=['text/html','application/pdf','text/jsx','application/javascript','application/octet-stream'];
    const extname = allowedfiletypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = mimetypes.includes(file.mimetype);

    if (mimetype && extname) {
        cb(null, true);
    } else {
         console.log("File rejected: ", file.originalname);
        cb(new Error('Only PDFs and JSX are allowed'), false);
    }
};

const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: {
        fileSize: 1024 * 1024 * 10 // 10 MB limit
    }
});

module.exports = upload;
