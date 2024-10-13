const express = require('express');
const fs = require('fs');
const path = require('path');


const reposotorypath='G:/React 2024/collobarative-app/git/Collaborative-app-react/backend/controllers-clone/repositories';
// Upload PDF route
const Deletetrepoa= async (req, res) => {
    const reponame=req.params.reponame;
    console.log('reponame',reponame); 
    try{
     const repopath=path.join(reposotorypath,reponame);
     console.log('repopath',repopath); 

     if(!fs.existsSync(repopath)){
        return res.status(404).json({message:'reposotory not found'});
     }

     fs.rmdirSync(repopath,{recursive:true});
      return res.status(200).json({message:'reposotory deleted successfully'});

}catch(error){
    console.log(error);
    res.status(500).json({message:'server error'});
}
  
};
module.exports = {
      Deletetrepoa
  };
  
  
