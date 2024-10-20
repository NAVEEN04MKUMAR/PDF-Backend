




const path = require('path');
 const fs = require('fs');
 const {PDFDocument,rgb,StandardFonts} = require('pdf-lib');


const Erase=async(req, res) => {
  if (!req.file) {
      return res.status(400).send('No file uploaded.');
    }
  
   
// const outputpath=path.join(__dirname,'../uploads',`erase_${filename}.pdf`);

try{



   // Access the buffer directly from the uploaded file
     const pdfBuffer = req.file.buffer;
     console.log('PDF buffer retrieved successfully');
   
     // Load PDF from buffer
     const pdfDoc = await PDFDocument.load(pdfBuffer);
     console.log('PDF document loaded successfully');
       

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
 
  // const base64Decrypted = pdfbytes.toString('base64');
  // console.log(' base64Decrypted',base64Decrypted );

 // Convert the Uint8Array to a Base64 string using Buffer
 const base64Decrypted = Buffer.from(pdfbytes).toString('base64');
 console.log('Base64 Decrypted:', base64Decrypted);
// fs.writeFileSync(outputpath,pdfbytes);


 res.status(200).json({
  message: 'PDF Erased successful',
  eraseFilePath: base64Decrypted,
});

}
catch (error) {
  console.error('Error during PDF image erase', error);
}

};


module.exports = {
    Erase
  };
