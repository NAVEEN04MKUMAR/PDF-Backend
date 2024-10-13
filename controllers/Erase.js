




const path = require('path');
 const fs = require('fs');
 const {PDFDocument,rgb,StandardFonts} = require('pdf-lib');


const Erase=async(req, res) => {
  if (!req.file) {
      return res.status(400).send('No file uploaded.');
    }
const filepath=req.file.path;
console.log('filepath',filepath);


const parsedpath = path.parse(filepath);
const filename = parsedpath.name;
console.log('Filename without extension:', filename);

const outputpath=path.join(__dirname,'../uploads',`erase_${filename}.pdf`);

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
const x=78;
const y=680;

 lastpage.drawRectangle({
  x: x,
  y: y,
  width: 200,
  height: 20,
  color:rgb(1,1,1),
 })

//  lastpage.drawText({
//   x: x,
//   y: y,
//   color:rgb(0,0,0),
//  })



const pdfbytes=await pdfDoc.save();
  console.log('pdf saved',pdfbytes);

fs.writeFileSync(outputpath,pdfbytes);


 res.status(200).json({
  message: 'PDF Erased successful',
  eraseFilePath: outputpath,
});

}
catch (error) {
  console.error('Error during PDF image compression:', error);
}

};


module.exports = {
    Erase
  };
