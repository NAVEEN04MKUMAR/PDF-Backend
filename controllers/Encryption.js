const path = require('path');
 const crypto = require('crypto');
 const fs = require('fs');
 const { PDFDocument } = require('pdf-lib');







 const Encryption=async(req, res) => {

      if (!req.file) {
          return res.status(400).send('No file uploaded.');
        }

     // Access the buffer directly from the uploaded file
  const pdfBuffer = req.file.buffer;
  console.log('PDF buffer retrieved successfully');

  // Load PDF from buffer
  const pdfDoc = await PDFDocument.load(pdfBuffer);
  console.log('PDF document loaded successfully');
    
    try{
    
             const secretkey=crypto.randomBytes(32);
             console.log('secret key',secretkey);
    
             const iv=crypto.randomBytes(16);
             console.log('iv',iv);
    
              const cipher=crypto.createCipheriv('aes-256-cbc',secretkey,iv);
              console.log('cipher',cipher);
              let encrypted=cipher.update(pdfBuffer);
              console.log('partially encrypted buffer',encrypted);
              encrypted=Buffer.concat([encrypted,cipher.final()]);
              console.log('fully encrypted buffer',encrypted);

    // Convert secretkey and iv to base64 for safe transmission
    const secretkeyBase64 = secretkey.toString('base64');
    console.log('fully encrypted buffer',secretkeyBase64);

    const ivBase64 = iv.toString('base64');
    console.log('fully encrypted buffer', ivBase64);


    
    
              // Convert the encrypted buffer to a Base64 string
              const base64Encrypted = encrypted.toString('base64');
    //           const encryptedFileName = `encrypted_${Date.now()}.pdf`;
 
            // const decipher=crypto.createDecipheriv('aes-256-cbc',secretkey,iv);
            // console.log('decipher',decipher);
            // let decrypted=decipher.update(encryptedPdf);
            // console.log('partially decrypted buffer',decrypted);
            // decrypted=Buffer.concat([decrypted,decipher.final()]);
            // console.log('fully encrypted buffer',decrypted);
            // // const decryptedFilePath = path.join(__dirname, '../uploads', `decrypted_${filename}.pdf`);
            // fs.writeFileSync(decryptedFilePath, decrypted);
      
          
            // Send response to frontend with the path to the compressed PDF
     res.status(200).json({
      message: 'PDF Encrypted  and Decryption both successful',
      encryptionFilePath: base64Encrypted,
      secretkey:secretkeyBase64,
      iv:  ivBase64
      // decryptionFilePath: decryptedFilePath,
    });
    
    // });
    
          // });
    } 
    catch (error) {
      console.error('Error during PDF image compression:', error);
    
    }
    
    };
    module.exports = {
        Encryption
      };



