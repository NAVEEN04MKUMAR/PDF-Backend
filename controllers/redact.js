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
  const filepath=req.file.path;
  console.log('filepath',filepath);
  
  const parsedpath = path.parse(filepath);
  const filename = parsedpath.name;
  console.log('Filename without extension:', filename);
  
  const outputpath=path.join(__dirname,'../uploads',`redacted_${filename}.pdf`);
  
  const redactionitems=JSON.parse(req.body.redactionitems||'[]');
  console.log('Fredaction items:', redactionitems);
  
  try{
  
  const fileBuffer=fs.readFileSync(filepath);
  console.log('File buffer', fileBuffer);
  
  const Pdfdata=await PdfParse(fileBuffer);
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
  
  fs.writeFileSync(outputpath,pdfbytes);
  
  
   res.status(200).json({
    message: 'PDF Redacted successful',
    redactedFilePath: outputpath,
  
  });
  
  }
  catch (error) {
    console.error('Error during PDF reaction compression:', error);
  }
  
  };
  module.exports={
    Redact
  }
  
  
  
  
  
  
  
  
  
  
  