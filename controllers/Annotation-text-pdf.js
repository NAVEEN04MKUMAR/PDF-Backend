const fs = require('fs');
const path = require('path');
const { PDFDocument, rgb } = require('pdf-lib');
const { Readable } = require('stream'); 
const pdf = require('pdf-parse');
const streamifier = require('streamifier');

// const cloudinary=require('../cloudinary.js')
// Upload PDF route






const Annotationtestpdf= async (req, res) => {

    if (!req.file) {
      return res.status(400).send('No file uploaded.');
    }
  
  // Access the buffer directly from the uploaded file
  const pdfBuffer = req.file.buffer;
  console.log('PDF buffer retrieved successfully');

  // Load PDF from buffer
  const pdfDoc = await PDFDocument.load(pdfBuffer);
  console.log('PDF document loaded successfully');



  
const extractTextFromPDF = async (pdfBuffer) => {
  try {
    const data = await pdf(pdfBuffer);
    return data.text; // Extracted text
  } catch (error) {
    console.error('Error extracting text from PDF:', error);
    throw error; // Handle errors as needed
  }
};


  // Reading the PDF document's content
  const textContent = await extractTextFromPDF( pdfBuffer);
  console.log('Extracted text from PDF:', textContent);

  
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
  try{
  
  const pdfbytes=await pdfDoc.save();
    console.log('pdf saved',pdfbytes);

    console.log('pdfBytes type:', typeof pdfbytes); // Should log 'object'
    console.log('pdfBytes instance:', pdfbytes instanceof Uint8Array); // Should log 'true'

       // Convert the Uint8Array to a Base64 string using Buffer
       const base64Decrypted = Buffer.from(pdfbytes).toString('base64');
       console.log('Base64 Decrypted:', base64Decrypted);
     
       return res.status(200).json({ message: 'successfully i create the annotation', base64Decrypted:base64Decrypted });

       //     const localFilePath = 'output.pdf';
//     // Save the buffer to a PDF file
// fs.writeFileSync('localFilePath', buffer);
// console.log('PDF file has been saved as output.pdf');

// // Read the local PDF file
// const dataBuffer = fs.readFileSync('output.pdf');

// // Extract text from the PDF
// pdf(dataBuffer).then(function(data) {
//     console.log('Extracted text:', data.text);
// }).catch(function(error) {
//     console.error('Error extracting text from local PDF:', error);
// });

//     console.log('Buffer created from PDF bytes');
//     console.log('Buffer type:', buffer instanceof Buffer); // Should log 'true'

//     console.log('Original Uint8Array length:', pdfbytes.length);
//     console.log('Converted Buffer length:', buffer.length); // Should be equal to pdfbytes.length

//     console.log('First few bytes of Buffer:', buffer.slice(0, 10)); // Log first 10 bytes
//     console.log('First few bytes of Uint8Array:', pdfbytes.slice(0, 10)); // Log first 10 bytes of original data
   
    


  
}
catch (error) {
  console.error('Error during PDF processing:', error);
  return res.status(500).json({ message: 'Internal Server Error', error: error.message });
}
}

module.exports = {
    Annotationtestpdf,
  };
  
  
//  i want to separate the file then what i do from the server.js filr i want like the i want to put them in the controller