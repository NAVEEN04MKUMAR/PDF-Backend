const fs = require('fs');
const PdfParse = require('pdf-parse');
const mammoth = require("mammoth");
const path = require('path');
const {Document,Packer,Paragraph,TextRun}=require('docx');



async function readDocxFile(filePath) {
    try {
        const { value: text } = await mammoth.extractRawText({ path: filePath });
        console.log("Extracted Text:", text);
    } catch (error) {
        console.error("Error reading .docx file:", error);
    }
}


async function createdocxfromtext(text){
  // console.log('text',text);
  try{
  const paragraph = text.split(/[ ,]+/).map((line,index) =>{ 
    const trimmedLine=line.trim();
    console.log(`Processing Line ${index + 1}:`, trimmedLine); // Log each processed line
    if(trimmedLine){
const textrun =new TextRun(trimmedLine);
console.log(`TextRun rootKey: ${textrun.rootKey}`);

const actualText = textrun.root[1].root[1]; // Access the actual text content
console.log('Actual Text Content:', actualText); // Logs: Actual Text Content: NameNaveen

    // Create a new TextRun with the actual text
    const textRunForParagraph = new TextRun(actualText); 
   const paragraph= new Paragraph({
    children:[ textRunForParagraph],
   });
   console.log(`Created Paragraph for Line ${index + 1}:`, paragraph);
   
   
// Accessing the TextRun from the Paragraph
const textrunn = paragraph.root[1].root[1].root[1]; // Assuming there's at least one TextRun
console.log(`Accessing TextRun for Paragraph ${index + 1}:`, textrunn);   
   
   return paragraph;
  }else{
    console.warn(`Line ${index + 1} is empty, skipping.`);
        return null; // Or handle this case as needed
  }
  //  return new Paragraph();
}).filter(p => p !== null); ;
console.log(`Total Paragraphs Created: ${paragraph.length}`);

// console.log('paragraph',paragraph);
    const doc=new Document({
      sections:[
        {
          properties:{},
          children:paragraph,
        },
      ],
    });
    console.log('doc',doc);

// Assuming paragraphs is your array of created Paragraph objects
paragraph.forEach((p, index) => {
    console.log(`Content of Paragraph ${index + 1}:`, p.root);
});





const buffer=await Packer.toBuffer(doc);
console.log('buffer',buffer);
return buffer;
// fs.writeFileSync(outputpath,buffer);
// console.log('docx file created at the :',outputpath);
// readDocxFile(outputpath);
  }catch(error){
    console.log('error docs creation from pdf:',error);
    throw new Error('docx creation failed');
  };
}

// Helper function to clean extracted text
function cleanExtractedText(text) {
  // Remove multiple spaces and trim leading/trailing spaces
  const cleanedText = text
      .replace(/\s+/g, ' ')  // Replace multiple spaces with a single space
      .trim();  // Remove leading and trailing spaces

  // You can add more cleaning steps as needed
  // For example, removing special characters, fixing newlines, etc.
  return cleanedText;
}


async function extracttextfrompdf(pdfBuffer){
  try{
    const data=await PdfParse(pdfBuffer);
    // console.log('text from pdf',data.text);
    const cleanedText = cleanExtractedText(data.text);
    return cleanedText;
    }catch(error){
    console.log('error extracting text from pdf:',error);
    throw new Error('pdf extraction failed');
  };
}

const Converttodocx=async(req, res) => {

    if (!req.file) {
        return res.status(400).send('No file uploaded.');
      }
  try{
   // Access the buffer directly from the uploaded file
   const pdfBuffer = req.file.buffer;
   console.log('PDF buffer retrieved successfully');
 
  //  // Load PDF from buffer
  //  const pdfDoc = await PDFDocument.load(pdfBuffer);
  //  console.log('PDF document loaded successfully');
 
 

//convert pdf to docx
const extractedtext=await extracttextfrompdf( pdfBuffer );
// console.log('Extracted text:', extractedtext);
console.log('Creating DOCX from extracted text...');
const docsbuffer=await createdocxfromtext(extractedtext);

  // Convert the Uint8Array to a Base64 string using Buffer
  const base64Decrypted = docsbuffer.toString('base64');
  console.log('Base64 Decrypted:', base64Decrypted);

// res.status(200).json({message:'pdf converted to docx successfully ',outputpath})

  
// const imagesdir=path.join('uploads','images');
//   if(!fs.existsSync(imagesdir)){
//     fs.mkdirSync(imagesdir);
//   }



    res.status(200).send({
      message:'pdf coverted successfully',
      base64Decrypted:base64Decrypted
      // docx:outputpath,
      // images:imagepaths,
    });

  }catch(error){
    console.log('error converting files',error);
    res.status(500).send({message:"failed to converting pdf"})
    
  }

  };

module.exports = {
    Converttodocx
  };