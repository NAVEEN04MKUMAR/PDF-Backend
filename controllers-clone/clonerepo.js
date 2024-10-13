







//this one i tried it is not work then what i do
// const express = require('express');
// const fs = require('fs');
// const path = require('path');
// const { exec } = require('child_process');



// // Upload PDF route
// const Clonerepo= async (req, res) => {
//     const {repoURL,desiredpath}=req.body;

//     console.log('repo and desired path',repoURL,desiredpath );

//     if(!repoURL||!desiredpath){
//       return res.status(400).json({error:'repository url and desired path not passed'})
//     }

//     const trimrepourl=repoURL.trim();
//     console.log('trimmedrepourl',trimrepourl);
 


//    const fulllocalpath=desiredpath.trim();
//    console.log('fulllocalpath',fulllocalpath);

//  // Create the desired directory if it doesn't exist
//  const desiredDir = path.dirname(fulllocalpath); // Get the parent directory
//  console.log('desired dir', desiredDir);
// //  if (!fs.existsSync(desiredDir)) {
// //      fs.mkdirSync(desiredDir, { recursive: true }); // Create parent directory recursively
// //      console.log('Created directory:', desiredDir);
// //  }





//   //   // Check if the desired path already exists
//   //   if (fs.existsSync(fulllocalpath)) {
//   //     // If it exists, remove the directory and its contents
//   //     await fs.remove(fulllocalpath); // Use fs-extra to remove the directory
//   // }

//      // Ensure the desired path is a valid directory
//   if (!fs.existsSync(path.dirname(fulllocalpath))) {
//     return res.status(400).json({ error: 'Desired path directory does not exist.' });
// }


//    const gitclonecommend=`git clone "${trimrepourl}" "${fulllocalpath}"`;
//    console.log('clonecommend',gitclonecommend );




//  exec( gitclonecommend, (err, stdout, stderr) => {
//     if (err) {
//         console.error('Error cloning repository:', stderr);
//         return res.status(500).send('Error cloning repository');
//     }
//     console.log('Repository cloned:', stdout);
//     return res.status(200).json({message:'reposotory fully cloned'});   
//    });
//    }

//     console.log('cloned repo');
  
  

// module.exports = {
//       Clonerepo
//   };
  
  
// //"g:/React 2024/collobarative-app/git/Collaborative-app-react/vite-project/src"
// //"g:/React 2024/collobarative-app/git/Collaborative-app-react/backend/controllers-clone/repositories"