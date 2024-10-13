const path = require('path');
 const crypto = require('crypto');
 const fs = require('fs');

const Encryption=async(req, res) => {

      if (!req.file) {
          return res.status(400).send('No file uploaded.');
        }
    const filepath=req.file.path;
    console.log('filepath',filepath);
    
    const parsedpath = path.parse(filepath);
    const filename = parsedpath.name;
    console.log('Filename without extension:', filename);
    
    const outputpath=path.join(__dirname,'../uploads',`encrypted_${filename}.pdf`);
    
    try{
    
             const secretkey=crypto.randomBytes(32);
             console.log('secret key',secretkey);
    
             const iv=crypto.randomBytes(16);
             console.log('iv',iv);
    
             fs.readFile(filepath,(err,fileBuffer)=>{
              if(err){
                return res.status(500).send('error reading file');
              }
              const cipher=crypto.createCipheriv('aes-256-cbc',secretkey,iv);
              console.log('cipher',cipher);
              let encrypted=cipher.update(fileBuffer);
              console.log('partially encrypted buffer',encrypted);
              encrypted=Buffer.concat([encrypted,cipher.final()]);
              console.log('fully encrypted buffer',encrypted);
    
              fs.writeFile(outputpath,encrypted,(err)=>{
                if(err){
                  return res.status(500).send('error reading file');
                }
    
    
              const encryptedPdf = fs.readFileSync(outputpath);
    
            const decipher=crypto.createDecipheriv('aes-256-cbc',secretkey,iv);
            console.log('decipher',decipher);
            let decrypted=decipher.update(encryptedPdf);
            console.log('partially decrypted buffer',decrypted);
            decrypted=Buffer.concat([decrypted,decipher.final()]);
            console.log('fully encrypted buffer',decrypted);
            const decryptedFilePath = path.join(__dirname, '../uploads', `decrypted_${filename}.pdf`);
            fs.writeFileSync(decryptedFilePath, decrypted);
      
          
            // Send response to frontend with the path to the compressed PDF
     res.status(200).json({
      message: 'PDF Encrypted  and Decryption both successful',
      encryptionFilePath: outputpath,
      decryptionFilePath: decryptedFilePath,
    });
    
    });
    
          });
    } 
    catch (error) {
      console.error('Error during PDF image compression:', error);
    
    }
    
    };
    module.exports = {
        Encryption
      };



