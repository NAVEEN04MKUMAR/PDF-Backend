const {PDFDocument}=require('pdf-lib');
const fs=require('fs');
const path=require('path');

const mergePDFs=async(pdfbuffers,outputfilename)=>{
    
    //create the empty pdf
    const mergepdf=await PDFDocument.create();
    console.log('create',mergepdf);

for(let pdfbuffer of pdfbuffers){
    //load each pdf buffer
    const pdfdoc=await PDFDocument.load(pdfbuffer);
    console.log('load',pdfdoc);

    //copy pdf pages added to the megedpdf
    const copiedpages=await mergepdf.copyPages(pdfdoc,pdfdoc.getPageIndices());
    console.log('copy pages',copiedpages);

    //add pages to merged pdf
    copiedpages.forEach((page)=>mergepdf.addPage(page));
    // console.log('add to merged pdf',copiedpages);

}

 const mergedpdfbytes=await mergepdf.save();
 const mergedpdfpath= path.join(__dirname,"merged_pdfs",outputfilename);
 console.log('mergepdfpath',mergedpdfpath);


if(!fs.existsSync(path.join(__dirname,"merged_pdfs"))){
    fs.mkdirSync(path.join(__dirname,"merged_pdfs"));

}
fs.writeFileSync(mergedpdfpath,mergedpdfbytes);
return mergedpdfpath;
};
module.exports={mergePDFs};
