const { Dropbox } = require('dropbox');
const path = require('path');
const crypto = require('crypto');
const { Readable } = require('stream');
const fetch = require('node-fetch'); 




const ACCESS_TOKEN = 'sl.B80P5WdUJ7SlQT_R6MYMh97_dXFlEvDw0dBW_05fgnR_izU1RvMv9XlPx_Ghj95kDtdVRfOnqooc3H6JUFOtqflZcxiOf6zet7vP-2EkMiSXdrIreQYutRmJH5A5ew-yB3ERrgMouPDS';

// Initialize Dropbox client
const dbx = new Dropbox({ accessToken: ACCESS_TOKEN, fetch: fetch });

// Function to upload a file to Dropbox
const uploadFileToDropbox = async (file) => {
  const { buffer, originalname, mimetype } = file;
  const filename = crypto.randomBytes(16).toString('hex') + path.extname(originalname);
  console.log('filename', filename);

  // Create a readable stream from the buffer
  const readable = new Readable();
  readable._read = () => {}; // No-op function
  readable.push(buffer);
  readable.push(null); // End the stream

  console.log('Pushing buffer to the readable stream...');

  return new Promise((resolve, reject) => {
    // Upload file to Dropbox
    dbx.filesUpload({
      path: '/' + filename, // Path in Dropbox
      contents: readable, // The readable stream
      mode: 'add', // 'add' to create a new file or 'overwrite' to replace an existing file
      autorename: true, // Automatically rename file if it already exists
      mute: false // Whether to notify the user of the file upload
    })
    .then((response) => {
      console.log('File upload completed');
      resolve({
        filename,
        metadata: response.result
      });
    })
    .catch((error) => {
      console.error('Error during file upload:', error);
      reject(error);
    });
  });
};

// Function to save file and data to Dropbox
const saveToDatabase = async (uploadedFile, canvasData) => {
  try {
    console.log('Starting to save to Dropbox...');
    const fileMetadata = await uploadFileToDropbox(uploadedFile);
    console.log('File uploaded to Dropbox successfully:', fileMetadata);

    // Save canvas data to your database (example code, modify as needed)
    // const newCanvas = new CanvasModel(canvasData);
    // await newCanvas.save();

    console.log('File and canvas saved successfully');
  } catch (error) {
    console.error('Error saving the file and canvas:', error);
  }
};

module.exports = {
  saveToDatabase
};
