const express = require('express');
const {readFileSync,writeFileSync,existsSync,mkdirSync,createWriteStream} = require('fs');
const path = require('path');
const crypto=require('crypto');

const commithistoryfilepath=path.join(__dirname,'commithistory.json');

const loadCommithistory=()=>{
    if(!existsSync(commithistoryfilepath)){
        return [];
    }//
    const commithistorydata=readFileSync(commithistoryfilepath,'utf-8');
    console.log('commithistorydata',commithistorydata);

    return JSON.parse(commithistorydata);
};


const savecommithistory=(newcommit)=>{   
    const commithistory=loadCommithistory();
    console.log('commit histroy',commithistory);
    commithistory.push(newcommit);
    writeFileSync(commithistoryfilepath, JSON.stringify(commithistory, null, 2), 'utf-8')
};


const Commit= async (req, res) => {
    console.log('Request received:', req.body); // Log the incoming request body
    console.log('Files received:', req.files); 
    console.log('Files received:', req.file); 
    console.log('Headers:', req.headers);
// Ensure a file was uploaded
if (!req.file) {
    return res.status(400).json({ message: 'No file uploaded.' });
}

const uploadedfilepath=req.file.path;
console.log('uploadedfilepath',uploadedfilepath);


const filecontents=readFileSync(uploadedfilepath,'utf-8');
console.log(' filecontents', filecontents);


const commithash=crypto.randomBytes(20).toString('hex');
    console.log('commithash',commithash);

    // const dirPath = path.join(__dirname, 'commits');
    const dirPath = path.join(__dirname, `${commithash}`,);
    console.log('dirPath',dirPath);
    
// Check if directory exists, if not, create it
if (!existsSync(dirPath)) {
  mkdirSync(dirPath, { recursive: true });
}
    const dirPath1 = path.join(dirPath,  `commit_${commithash}.html`);
        console.log('dirPath1',dirPath1);
const dirpath=path.dirname(dirPath1);
console.log('dirPath',dirpath);

if (!existsSync(dirpath)) {
    mkdirSync(dirpath,{recursie:true});
  }
  console.log('file createed');


   const writestream=createWriteStream(dirPath1 );
console.log('write stream',writestream);

     writestream.write(filecontents);
     // Handle errors
writestream.on('error', (err) => {
    console.error('Error writing to file:', err);
});
     // Close the stream
writestream.end(() => {
    console.log('File created successfully using streams!');
});

   console.log(req.body.message)
const newcommit={
    message:req.body.message||'no commit message provided',
    hash:commithash,
    timestamp:new Date().toISOString(),
};

savecommithistory(newcommit);

   return res.status(201).json({
    message:`Commit ${commithash} created successfully!`,
    commithash:commithash,
  });
  };
  

module.exports = {
     Commit,loadCommithistory
  };
  
  
