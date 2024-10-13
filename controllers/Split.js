

const path = require('path');
 const fs = require('fs');
 const {PDFDocument,rgb,StandardFonts} = require('pdf-lib');
const PdfParse = require('pdf-parse');

const Split=async(req, res) => {
    try{
     // load the uploaded pdf
      const pdfbuffer=fs.readFileSync(req.file.path);
      console.log('pdfbuffer',pdfbuffer)
      const pdfdoc=await PDFDocument.load(pdfbuffer);
      console.log('pdfdoc',pdfdoc);
  
      const splitPDFs=[];
  
      for(let i=0;i<pdfdoc.getPageCount();i++){
        const newpdf=await PDFDocument.create();
        const [copiedpage]=await newpdf.copyPages(pdfdoc,[i]);
        newpdf.addPage(copiedpage);
       const pdfbytes=await newpdf.save();
       console.log('pdf bytes',pdfbytes );
  
  
       const splitpdfpath=path.join(__dirname,'split',`split_page_${i+1}.pdf`);
       console.log('File path:', splitpdfpath);
  
       
  if(!fs.existsSync(path.join(__dirname,"split"))){
    fs.mkdirSync(path.join(__dirname,"split"));
  
  }
  
       fs.writeFileSync(splitpdfpath,pdfbytes);
       splitPDFs.push(splitpdfpath);
  
      }
  
  res.status(200).send({message:'pdf split successfully',files:splitPDFs});
    }catch(error){
      console.error('error spliting files',error);
      res.status(500).send({message:"failed to split pdf"})
      
    }
    finally{
      fs.unlinkSync(req.file.path);
    }
  
    }
   module.exports={
    Split
    };
  
  