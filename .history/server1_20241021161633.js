const express = require('express');
const path = require('path');
const http = require('http');
const cors = require('cors');
 const multer = require('multer');
 const fetch = require('node-fetch'); 
 const crypto = require('crypto');
 const { Readable } = require('stream');
 const fs = require('fs');
 const {PDFDocument,rgb,StandardFonts} = require('pdf-lib');
 const pdf = require('pdf-parse');
const {Document,Packer,Paragraph,TextRun}=require('docx');
// const pdfToimage = require('pdf-to-image');
const mammoth = require("mammoth");
const sharp = require('sharp');
const pdfex = require('pdf-extraction');
const fileUpload = require('express-fileupload');
const { exec } = require('child_process');
const PdfParse = require('pdf-parse');


const {initwebsocket}=require('./websocket.js')
// const { saveFileLocally }  =require('./file/drawshapes/save.js')
// const {  processPDF }  =require('./file/drawshapes/save.js');
const {mergePDFs}=require('./file/mergePDF.js')

const dotenv = require('dotenv');
const fileRoutes=require('./routes/fileroutes.js');
// const cloudinary=require('./')

const app = express();
app.use(express.urlencoded({ extended: true }));
//origin: 'https://localhost:5173',
// Update with your Vercel domains
const allowedOrigins = [
  'https://pdf-frontend-6kh0t2dw0-naveenkumars-projects-79c7c003.vercel.app',
  'https://pdf-frontend-git-kumar-naveenkumars-projects-79c7c003.vercel.app'
];
//https://vercel.live/link/pdf-frontend-gp7zeqfhh-naveenkumars-projects-79c7c003.vercel.app?via=deployment-domains-list&page=/
app.use(cors({
    origin:'*',
    
    // function (origin, callback) {
    //   if (!origin || allowedOrigins.indexOf(origin) !== -1) {
    //     callback(null, true);
    //   } else {
    //     callback(new Error('Not allowed by CORS'));
    //   }
    // },
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization']
  }));

  app.options('*', cors());


  // Handle OPTIONS preflight requests for all routes
// app.options('*', cors({
//   origin: 'http://localhost:5173',
//   methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE'],
//   credentials: true,
//   allowedHeaders: ['Content-Type', 'Authorization']
// }));
  
// Initialize environment variables


// Middleware for parsing incoming requests (JSON, URL-encoded)
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/api/', fileRoutes);
require('dotenv').config();

// Sample route
app.get('/', (req, res) => {
  res.send('Welcome to your new server!');
});


const server = http.createServer(app);

// Initialize WebSocket
initwebsocket(server); 

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

// app.post('/annotation-rewrite-pdf',upload.single('file'), async(req, res) => {

//   if (!req.file) {
//       return res.status(400).send('No file uploaded.');
//     }
// const filepath=req.file.path;
// console.log('filepath',filepath);

// const annotationtext=req.body.annotationtext;
// console.log('annotationtext',annotationtext);



// const parsedpath = path.parse(filepath);
// const filename = parsedpath.name;
// console.log('Filename without extension:', filename);

// const outputpath=path.join(__dirname,'uploads',`Annotated-rewrite_${filename}.pdf`);

// try{

// const fileBuffer=fs.readFileSync(filepath);
// console.log('File buffer', fileBuffer);


// const existpdf=fs.readFileSync(filepath);
// console.log('File read successfully');


// console.log('Loading PDF document...');
//   const pdfDoc=await PDFDocument.load(existpdf);
//   console.log('PDF document loaded successfully',pdfDoc);

// const lastpage=pdfDoc.getPages().pop();
// console.log('get the last page',lastpage);
// const x=67;
// const y=680;

//  lastpage.drawRectangle({
//   x: x,
//   y: y,
//   width: 200,
//   height: 16,
//   color:rgb(1,1,1),
//  })

//  lastpage.drawText(annotationtext,{
//   x: x,
//   y: y,
//   size:13,
//   color:rgb(0,0,0),
//  })



// const pdfbytes=await pdfDoc.save();
//   console.log('pdf saved',pdfbytes);

// fs.writeFileSync(outputpath,pdfbytes);


//  res.status(200).json({
//   message: 'PDF rewrite successful',
//   rewriteFilePath: outputpath,
// });

// }
// catch (error) {
//   console.error('Error during PDF rewrite:', error);
// }

// });


PORT=5002;
// Start server
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});




