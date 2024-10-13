const { Storage } = require('@google-cloud/storage');
const path = require('path');
const crypto = require('crypto');
const { Readable } = require('stream');



// Set the environment variable programmatically
const keyfilename = path.join(__dirname, 'g:/React 2024/collobarative-app/git/Collaborative-app-react/backend/steady-habitat-435412-b5-d93ca62aa984.json');

// Initialize Google Cloud Storage client
const storage = new Storage({keyfilename});

// Replace with your bucket name
const bucketName = 'kumar';
const bucket = storage.bucket(bucketName);

// Example function to upload a file
const uploadfiletogridfs = async (file) => {
  const { buffer, originalname, mimetype } = file;
  const filename = crypto.randomBytes(16).toString('hex') + path.extname(originalname);
  console.log('filename', filename);

  const fileUpload = bucket.file(filename);
  
  const readable = new Readable();
  readable._read = () => {}; // No-op function
  readable.push(buffer);
  readable.push(null); // End the stream

  console.log('Pushing buffer to the readable stream...');
  
  return new Promise((resolve, reject) => {
    const writeStream = fileUpload.createWriteStream({
      metadata: {
        contentType: mimetype,
        metadata: {
          originalname: originalname,
          size: file.size,
        },
      },
      resumable: false, // Change to true if you expect large files and want resumable uploads
    });

    readable.pipe(writeStream)
      .on('error', (err) => {
        console.error('Error during file upload:', err);
        reject(err);
      })
      .on('finish', () => {
        console.log('File upload completed');
        resolve({
          filename,
          metadata: {
            originalname,
            mimetype,
            size: file.size,
          },
        });
      });



  });
};



const savetodatabase=async (uploadedfile,canvasdata)=>{
    try{
      console.log('Starting to save to Google Cloud Storage...');
      const filemetadata=await uploadfiletogridfs(uploadedfile);
          console.log('File uploaded to GCS successfully:', filemetadata);
  
      // const newcanvas=new canvasmodel(canvasdata);
      // await newcanvas.save();
  console.log('file and canvas saved successfully');
    }catch(error){
      console.log('error saving the database',error);
    }
  };






module.exports={
    savetodatabase
};      