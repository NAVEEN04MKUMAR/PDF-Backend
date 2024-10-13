const express = require('express');
const fs = require('fs');
const path = require('path');
const crypto=require('crypto');




function hashfilecontent(filepath){
   const filecontent=fs.readFileSync(filepath,'utf-8');
   console.log('filecontent',filecontent);
   return crypto.createHash('sha1').update(filecontent).digest('hex');
}


function trackfile(filepath){
    const filehash=hashfilecontent(filepath);
    console.log('file hash',filehash);
    const filesnapshotpath=`G:/React 2024/collobarative-app/git/Collaborative-app-react/backend/controllers-clone/2.version-control.js/commits/${filehash}`;
    console.log(' filesnapshotpath', filesnapshotpath);
    if(!fs.existsSync(filesnapshotpath)){
        fs.existsSync(filesnapshotpath,fs.readFileSync(filepath));
    }
    return filehash;
}

const Trackfile= async (req, res) => {
    const {file}=req;
    console.log("Files received: ", req.file);

    const filepath=req.file.path;
   console.log('filepath',filepath);

   // Extract file extension
   const fileExtension = path.extname(req.file.originalname);
   console.log('File Extension:', fileExtension);

   const filehash=trackfile(filepath);
   console.log('file hash',filehash);


   const basesnapshotpath='G:/React 2024/collobarative-app/git/Collaborative-app-react/backend/controllers-clone/2.version-control.js/commits/';
 const filesnapshotpath=path.join(basesnapshotpath,`${filehash}${ fileExtension}`);
   console.log(' filesnapshotpath', filesnapshotpath);

   fs.unlinkSync(file.path);

   return res.status(201).json({
    message:`Track file ${filehash} created successfully!`,
    filehash:filehash,
  });
  };
  

module.exports = {
      Trackfile
  };
  
  
