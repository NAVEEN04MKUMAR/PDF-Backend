

const path = require('path');
const branchFilePath = path.join(__dirname, 'branches.json');
const {readFileSync,writeFileSync,existsSync,mkdirSync,createWriteStream} = require('fs');


const getBranches = (req, res) => {
    console.log('getbranches')
    // Read branch data directly from the JSON file
    if (!existsSync(branchFilePath)) {
        return res.status(404).json({ message: 'Branch file not found' });
    }
    
    const branchData = readFileSync(branchFilePath, 'utf-8');
    const parsedData = JSON.parse(branchData);

    return res.status(200).json({
        branches: Object.keys(parsedData.branches),
        activebranch: parsedData.activebranch
    });
};

module.exports = {
    getBranches
  }