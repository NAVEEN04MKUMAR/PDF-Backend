const fs = require('fs');
const path = require('path');
const { PDFDocument, rgb } = require('pdf-lib');
// Upload PDF route
const Annotationtestpdf= async (req, res) => {

    if (!req.file) {
      return res.status(400).send('No file uploaded.');
    }
    const filepath=req.file.path;
    console.log('filepath',filepath);
  
    const parsedpath = path.parse(filepath);
  const filename = parsedpath.name;
  console.log('Filename without extension:', filename);
  
  const outputpath=path.join(__dirname,'../uploads',`Annotatedtext_${filename}.pdf`);
  
    const existpdf=fs.readFileSync(filepath);
    console.log('File read successfully');
  
    console.log('Loading PDF document...');
    const pdfDoc=await PDFDocument.load(existpdf);
    console.log('PDF document loaded successfully',pdfDoc);
  
  const lastpage=pdfDoc.getPages().pop();
  console.log('get the last page',lastpage);
  
  const annotationtext=req.body.annotationtext;
  console.log('annotationtext',annotationtext);
  
  
  const {height}=lastpage.getSize();
  console.log('get the height',height);
  
  const fontsize=12;
  const yposition=fontsize+76;
  console.log('y position',yposition);
  
  lastpage.drawText(annotationtext,{
    x:100,
    y:yposition,
    size:fontsize,
    color: rgb(0, 0, 0), 
  });
  
  const pdfbytes=await pdfDoc.save();
    console.log('pdf saved',pdfbytes);
  
  fs.writeFileSync(outputpath,pdfbytes);
  
  
   res.status(200).json({
    message: 'PDF Redacted successful',
    redactedFilePath: outputpath,
  });
  };
  

module.exports = {
    Annotationtestpdf,
  };
  
  
//  i want to separate the file then what i do from the server.js filr i want like the i want to put them in the controller