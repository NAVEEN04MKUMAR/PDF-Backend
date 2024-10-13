


const path = require('path');
 const fs = require('fs');
 const {PDFDocument,rgb,StandardFonts} = require('pdf-lib');
const PdfParse = require('pdf-parse');




// app.post('/annotation-rewrite-pdf',upload.single('file'),
const Rewrite= async(req, res) => {
  if (!req.file) {
      return res.status(400).send('No file uploaded.');
    }
const filepath=req.file.path;
console.log('filepath',filepath);

const annotationtext=req.body.annotationtext;
console.log('annotationtext',annotationtext);



const parsedpath = path.parse(filepath);
const filename = parsedpath.name;
console.log('Filename without extension:', filename);

const outputpath=path.join(__dirname,'../uploads',`Annotated-rewrite_${filename}.pdf`);

try{

const fileBuffer=fs.readFileSync(filepath);
console.log('File buffer', fileBuffer);


const existpdf=fs.readFileSync(filepath);
console.log('File read successfully');


console.log('Loading PDF document...');
  const pdfDoc=await PDFDocument.load(existpdf);
  console.log('PDF document loaded successfully',pdfDoc);

const lastpage=pdfDoc.getPages().pop();
console.log('get the last page',lastpage);
const x=67;
const y=680;

 lastpage.drawRectangle({
  x: x,
  y: y,
  width: 200,
  height: 16,
  color:rgb(1,1,1),
 })

 lastpage.drawText(annotationtext,{
  x: x,
  y: y,
  size:13,
  color:rgb(0,0,0),
 })



const pdfbytes=await pdfDoc.save();
  console.log('pdf saved',pdfbytes);

fs.writeFileSync(outputpath,pdfbytes);


 res.status(200).json({
  message: 'PDF rewrite successful',
  rewriteFilePath: outputpath,
});

}
catch (error) {
  console.error('Error during PDF rewrite:', error);
}

};

module.exports={
    Rewrite
  };
