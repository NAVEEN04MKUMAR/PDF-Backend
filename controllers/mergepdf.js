
 const fs = require('fs');
 const { PDFDocument } = require('pdf-lib'); // pdf-lib for merging PDF files
const path = require('path');



// Function to merge multiple PDF buffers
const mergePDFs = async (pdfbuffers, mergepdffilename) => {
    try {
      // Create a new PDFDocument
      const mergedPdf = await PDFDocument.create();
  
      // Loop through each PDF buffer and merge them
      for (const pdfBuffer of pdfbuffers) {
        // Load the current PDF
        const currentPdf = await PDFDocument.load(pdfBuffer);
  
        // Copy all the pages from the current PDF to the merged document
        const copiedPages = await mergedPdf.copyPages(currentPdf, currentPdf.getPageIndices());
        copiedPages.forEach((page) => mergedPdf.addPage(page));
      }
  
      // Write the merged PDF to a file
      const mergedPdfBytes = await mergedPdf.save();
      const outputPath = path.join(__dirname, '../uploads',  mergepdffilename);
  
      // Save the merged PDF file to the output path
      fs.writeFileSync(outputPath, mergedPdfBytes);
      
      return outputPath; // Return the path of the merged PDF file
    } catch (err) {
      console.error('Error during PDF merging:', err);
      throw new Error('Failed to merge PDFs');
    }
  };

const Mergepdf=async(req, res) => {
  try{
    const pdfbuffers=[];
    //read the uploaded file
    for(let file of req.files){
      const pdfbuffer=fs.readFileSync(file.path);
      console.log('pdfbuffer',pdfbuffer);
      pdfbuffers.push(pdfbuffer);
    }

    const mergepdffilename=`merge_${Date.now()}.pdf`;
    console.log('filename',mergepdffilename);

    const mergepdfpath=await mergePDFs(pdfbuffers,mergepdffilename);
    console.log('mergepdfpath',mergepdfpath);

    req.files.forEach(file => fs.unlinkSync(file.path));
    res.json({mergedpdfurl:`http://localhost:5002/download/${mergepdffilename}`});

  }catch(error){
  console.error('error merging files',error);
  res.status(500).send({message:"failed to merge pdf"})
  }

  };

  

  module.exports = {
    Mergepdf,
};
