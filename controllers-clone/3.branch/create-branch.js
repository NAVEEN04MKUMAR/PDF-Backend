const express = require('express');
const {readFileSync,writeFileSync,existsSync,mkdirSync,createWriteStream} = require('fs');
const path = require('path');
const crypto=require('crypto');

const branchfilepath=path.join(__dirname,'branches.json');

const loadbranches=()=>{
    if(!existsSync(branchfilepath)){
                console.log("No branches file found. Creating default branch data.");

        return {branches:{ main: 
            {
            currentcommit: 'initialCommitHash',
            history: []
        }},activebranch:'main'};
    }
    const branchdata=readFileSync(branchfilepath,'utf-8');
    console.log('branchdata',branchdata);

    return JSON.parse(branchdata);
};


const savebranches=(newcommit)=>{   
    const branches=loadbranches();
    console.log('branches',branches);
    // loadbranches.push(newcommit);
    console.log('Saving branch data:', JSON.stringify(newcommit, null, 2));
    writeFileSync(branchfilepath, JSON.stringify(newcommit, null, 2), 'utf-8')
};


const Createbranch= async (req, res) => {
    console.log('Request received:', req.body); 
    console.log('Headers:', req.headers);

    const branchname=req.body.branchname;
    console.log('branchname',branchname);

const branchdata=loadbranches();
console.log('branchdata',branchdata);

if(branchdata.branches[branchname]){
    return res.status(400).json({message:'branch already exist'});
}

const activebranch=branchdata.activebranch;
console.log('active branch', activebranch);

const currentcommit=branchdata.branches[activebranch].currentcommit;
console.log('currentcommit',currentcommit);

branchdata.branches[branchname]={
    currentcommit:currentcommit,
    history:[currentcommit]
}

console.log('branchdata',branchdata);
savebranches(branchdata);

   return res.status(201).json({
    message:`Branch ${branchname} created successfully!`,
    currentcommit:currentcommit,
  });
  };
  

//   getbranches
  const getbranches=async(req,res)=>{
    console.log('request',req)

    const branchdata=loadbranches();
    console.log('branchdata',branchdata)
    return res.status(200).json({
        branches:Object.keys(branchdata.branches),
        activebranch:branchdata.activebranch
      });

  }

module.exports = {
    Createbranch,getbranches
  };
  
  
