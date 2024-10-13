const express = require('express');
const fs = require('fs');
const path = require('path');


const reposotorypath='G:/React 2024/collobarative-app/git/Collaborative-app-react/backend/controllers-clone/repositories';
// Upload PDF route
const Getrepo= async (req, res) => {
    console.log('request',req);
    try{

  fs.readdir(reposotorypath,(err,files)=>{
    if(err){
        return res.status(500).send({message:'unable to get the reposotories'});
    }

  const reposotory =files.filter(file=>fs.lstatSync(path.join(reposotorypath,file)).isDirectory());
  console.log('reposotory',reposotory);
   res.status(200).json({reposotory});
  })

}catch(error){
    console.log(error);
    res.status(500).json({message:'server error'});
}
  
};
module.exports = {
      Getrepo
  };
  
  
