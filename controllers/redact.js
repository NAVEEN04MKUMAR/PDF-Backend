const path = require('path');
 const fs = require('fs');
 const {PDFDocument,rgb,StandardFonts} = require('pdf-lib');
const PdfParse = require('pdf-parse');


// const { PDFDocument } = require('pdf-lib'); // pdf-lib for merging PDF files
// const path = require('path');

const Redact=async(req, res) => {

    if (!req.file) {
        return res.status(400).send('No file uploaded.');
      }
// console.log('PDF document loaded successfully',pdfDoc);


  const redactionitems=JSON.parse(req.body.redactionitems||'[]');
  console.log('Fredaction items:', redactionitems);
  
  try{
  
  
   // Access the buffer directly from the uploaded file
   const pdfBuffer = req.file.buffer;
   console.log('PDF buffer retrieved successfully');
 
  //  // Load PDF from buffer
  //  const pdfDoc = await PDFDocument.load(pdfBuffer);
  //  console.log('PDF document loaded successfully');
  
  const Pdfdata=await PdfParse(pdfBuffer);
  console.log('Pdf data', Pdfdata);
  
  let modifiedPdfdata=Pdfdata.text;
  console.log('Pdf data',modifiedPdfdata);
  
  console.log('redactionitems',redactionitems);
  
  if(redactionitems&&redactionitems.length>0){
  redactionitems.forEach(item=>{
  
      // Trim any extra spaces around the item
      const trimmedItem = item.trim();
      console.log(`Redacting: ${trimmedItem}`);
      console.log(`Redacting: ${item}`);
  
    const beforeRedaction = modifiedPdfdata;
    console.log('Before Redaction:', beforeRedaction);
   
    const regex=new RegExp(`${trimmedItem.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&')}\\s*:?[\\s\\$0-9,.]+`, 'gi');
    console.log(`Regex: ${regex}`);
  
    modifiedPdfdata = modifiedPdfdata.replace(regex, '[REDACTED]');
    console.log('modifiedPdfdata',modifiedPdfdata);
   
  });
  
    // Optional: Count the number of redactions made
    const redactedCount = (modifiedPdfdata.match(/\[REDACTED\]/g) || []).length;
    console.log(`Total redacted occurrences: ${redactedCount}`);
  }else{
    console.log('No redaction items provided');
  }         // Send response to frontend with the path to the compressed PDF
  
  const pdfDo1=await PDFDocument.create();
  const page=pdfDo1.addPage();
  
  page.drawText(modifiedPdfdata,{
    x:50,
    y:page.getHeight()-50,
    size:12,
  });
  
  const pdfbytes=await pdfDo1.save();
    console.log('pdf saved',pdfbytes);

    

     // Convert the Uint8Array to a Base64 string using Buffer
 const base64Decrypted = Buffer.from(pdfbytes).toString('base64');
 console.log('Base64 Decrypted:', base64Decrypted);

  // fs.writeFileSync(outputpath,pdfbytes);
  
  
   res.status(200).json({
    message: 'PDF Redacted successful',
    redactedFilePath:base64Decrypted ,
  
  });
  
  }
  catch (error) {
    console.error('Error during PDF reaction compression:', error);
  }
  
  };
  module.exports={
    Redact
  }
  
  
  
  
  
  
  
  
  
  
  