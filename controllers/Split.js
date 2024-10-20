

const path = require('path');
 const fs = require('fs');
 const {PDFDocument,rgb,StandardFonts} = require('pdf-lib');
const PdfParse = require('pdf-parse');

const Split=async(req, res) => {
    try{
      // Access the buffer directly from the uploaded file
  const pdfBuffer = req.file.buffer;
  console.log('PDF buffer retrieved successfully');

  // // Load PDF from buffer
  // const pdfDoc = await PDFDocument.load(pdfBuffer);
  // console.log('PDF document loaded successfully');

      const pdfdoc=await PDFDocument.load(pdfBuffer);
      console.log('pdfdoc',pdfdoc);
  
      const splitPDFs=[];
      console.log('splitPDFs',splitPDFs);
  
      for(let i=0;i<pdfdoc.getPageCount();i++){
        const newpdf=await PDFDocument.create();
        const [copiedpage]=await newpdf.copyPages(pdfdoc,[i]);
        newpdf.addPage(copiedpage);
       const pdfbytes=await newpdf.save();
       console.log('pdf bytes',pdfbytes );
 
       // Convert the Uint8Array to a Base64 string using Buffer
  const base64Decrypted = Buffer.from(pdfbytes).toString('base64');
  // console.log('Base64 Decrypted:', base64Decrypted);


  
      //  const splitpdfpath=path.join(__dirname,'split',`split_page_${i+1}.pdf`);
      //  console.log('File path:', splitpdfpath);
  
       
  // if(!fs.existsSync(path.join(__dirname,"split"))){
  //   fs.mkdirSync(path.join(__dirname,"split"));
  
  // }
  
      //  fs.writeFileSync(splitpdfpath,pdfbytes);
       splitPDFs.push(base64Decrypted);
  
      }
  
  res.status(200).send({message:'pdf split successfully',base64Decrypted:splitPDFs});
    }catch(error){
      console.error('error spliting files',error);
      res.status(500).send({message:"failed to split pdf"})
      
    }
    // finally{
    //   fs.unlinkSync(req.file.path);
    // }
  
    }
   module.exports={
    Split
    };
  
  