const fs = require('fs');
const path = require('path');

const copyFile = (sourceFilePath, destinationDirPath, fileName) => {
    const destinationFilePath = path.join(destinationDirPath, fileName);

    if (!fs.existsSync(destinationDirPath)) {
        fs.mkdirSync(destinationDirPath, { recursive: true });
        console.log(`Directory created: ${destinationDirPath}`);
    }

    fs.copyFile(sourceFilePath, destinationFilePath, (error) => {
        if (error) {
            console.error('Error while copying file:', error);
        } else {
            console.log(`File copied successfully from ${sourceFilePath} to ${destinationFilePath}`);
        }
    });
};

const sourceFilePath = 'G:/React 2024/collobarative-app/git/Collaborative-app-react/backend/middleware'; // File to copy
const destinationDirPath = 'G:/React 2024/collobarative-app/git/Collaborative-app-react/backend/controllers-clone/commits'; // Destination directory
const fileName = 'multer.js'; // Name of the copied file in destination

copyFile(sourceFilePath, destinationDirPath, fileName);




// fs.access('G:/React 2024/collobarative-app/git/Collaborative-app-react/backend/controllers-clone/commits', fs.constants.W_OK, (err) => {
//     if (err) {
//       console.error('No write access to this directory');
//     } else {
//       console.log('You have write access to this directory');
//     }
//   });
