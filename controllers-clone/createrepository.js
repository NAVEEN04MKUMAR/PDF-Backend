const express = require('express');
const fs = require('fs');
const path = require('path');
const { stdout } = require('process');
const { exec } = require('child_process');



const REPOS_DIR=path.join(__dirname,'repositories');
// Upload PDF route
const Createrepo= async (req, res) => {
    if (!req.body || !req.body.reponame || !req.body.description) {
        return res.status(400).send('Repository name and description are required.');
    }
    
   const {reponame,description}=req.body;
   console.log('reponame,description',reponame,description);
   const repopath=path.join(REPOS_DIR,reponame);
   console.log('repopath',repopath);


   if(!fs.existsSync(repopath)){
    fs.mkdirSync(repopath,{ recursive: true });
 // Initialize the git repository
 const command = `git init "${repopath}"`;
 exec(command, (err, stdout, stderr) => {
    if (err) {
        console.error('Error initializing repository:', stderr);
        return res.status(500).send('Error initializing repository');
    }
    console.log('Repository created:', stdout);
    return res.status(201).json({
      message:`Repository ${reponame} created successfully!`,
      repopath:repopath,
      description
    });    })
   }else{
     return res.status(400).send('repository already exist'); 
   }

    console.log('created repo');
  
  };
  

module.exports = {
      Createrepo
  };
  
  
