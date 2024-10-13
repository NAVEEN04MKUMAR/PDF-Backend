const loadCommithistory=require('./commithistory.json');


const getCommithistory=(req,res)=>{
   try{
    const commithistory=loadCommithistory;
   //  console.log('commithistory',commithistory);
    res.status(200).json(commithistory);
   }
   catch(error){
    console.log('error',error);
    res.status(500).json({message:'failed to get commit-history'});
   }
};





module.exports = {
    getCommithistory
  };
  
  
