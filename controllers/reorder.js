
const path = require('path');
 const fs = require('fs');
 const {PDFDocument,rgb,StandardFonts} = require('pdf-lib');
const PdfParse = require('pdf-parse');



const Reorder=async(req, res) => {

  // const {filename,order}=req.body;
  const order = JSON.parse(req.body.order);
  const file = req.file; // Assuming one file is being uploaded
     console.log('file');
    const filepath=file.path;
  try{


     // Access the buffer directly from the uploaded file
   const pdfBuffer = req.file.buffer;
   console.log('PDF buffer retrieved successfully');
 
  //  // Load PDF from buffer
  //  const pdfDoc = await PDFDocument.load(pdfBuffer);
  //  console.log('PDF document loaded successfully');
  
   // load the uploaded pdf
    const pdfdoc=await PDFDocument.load(pdfBuffer);
    console.log('pdfdoc',pdfdoc);
const newpdfdoc=await PDFDocument.create();
console.log('newpdfdoc',newpdfdoc);

console.log('Total pages in pdfdoc:', pdfdoc.getPageCount());

for(const index of order){
  console.log(`Processing page index: ${index}`);

      if (index < 0 || index >= pdfdoc.getPageCount()) {
        console.error(`Invalid page index: ${index}`);
        throw new Error(`Invalid page index: ${index}`);
      }


 const [copiedpage]=await newpdfdoc.copyPages(pdfdoc,[index]);
 console.log('copiedpage',copiedpage);
 console.log(`Copied page ${index} successfully.`);
 newpdfdoc.addPage(copiedpage);
}

const pdfbytes=await newpdfdoc.save();
const newfilename=`reordered_${file.originalname}`;
console.log(`Reordered PDF saved successfully as ${newfilename}.`);
// fs.writeFileSync(path.join(__dirname,'../uploads',newfilename),pdfbytes);

     // Convert the Uint8Array to a Base64 string using Buffer
     const base64Decrypted = Buffer.from(pdfbytes).toString('base64');
     console.log('Base64 Decrypted:', base64Decrypted);
    
res.status(200).send({message:'pdf reorder successfully',base64Decrypted:base64Decrypted});
  }catch(error){
    console.error('error reordering files',error);
    res.status(500).send({message:"failed to reordering pdf"})
    
  }

  };
  module.exports={
    Reorder
  };

