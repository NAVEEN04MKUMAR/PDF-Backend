

const path = require('path');
 const crypto = require('crypto');
 const fs = require('fs');
 const { PDFDocument } = require('pdf-lib');
 const axios =require ("axios");


 const  Decryption=async(req, res) => {

    const { fileUrl, secretkey,iv } = req.body;    
    try{    
    const response = await axios.get(fileUrl, { responseType: 'arraybuffer' });
    console.log("response",response);
    const encryptedPdfBuffer = Buffer.from(response.data);
    
    const keyBuffer = Buffer.from(secretkey,'base64'); 
    const ivbuffer= Buffer.from(iv,'base64' ); 
     
            const decipher=crypto.createDecipheriv('aes-256-cbc',keyBuffer,ivbuffer);
            console.log('decipher',decipher);
            let decrypted=decipher.update(encryptedPdfBuffer);
            // console.log('Partially decrypted buffer:', decrypted.toString('hex'));
            // console.log('partially decrypted buffer',decrypted);
            decrypted=Buffer.concat([decrypted,decipher.final()]);
            // console.log('Fully decrypted buffer:', decrypted.toString('hex')); 
            // console.log('fully decrypted buffer',decrypted);

            const base64Decrypted = decrypted.toString('base64');
            console.log(' base64Decrypted',base64Decrypted );

      
          
            // Send response to frontend with the path to the compressed PDF
     res.status(200).json({
      message: 'PDF  Decryption both successful',
      decryptionFilePath: base64Decrypted,
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
        Decryption
      };



