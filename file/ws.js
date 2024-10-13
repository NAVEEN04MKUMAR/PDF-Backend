
app.post('/signup', async (req, res) => {
  console.log("Inside signup");
  const { username, email, password, role } = req.body;
  console.log(`Signup request received: ${username}`);
  console.log(`Signup request received: ${email}`);



  if (!username || !email || !password || !role) {
    console.log('Username, email, password, or role missing');
    return res.status(400).send('Username, email, password, or role missing');
  }
  try {
    // const hashedPassword = await bcrypt.hash(password, 10);
    const user1 = new User({ username,email, password, role });
    await user1.save();
    console.log(`User created: ${username}`);
    res.status(201).send('User created');
  } catch (err) {
    console.log('Error creating user:', err);
    res.status(500).send('Error creating user');

  }
});
//login
app.post('/login',async(req,res)=>{
  const {email,password}=req.body;
  console.log(`login request received:${email}`);
  const user2=await User.findOne({email});
  if(!user2){
      console.log(`user not found:${email}`);
      return res.status(400).send('user not found');
  }
  // const ispasswordvalid=await bcrypt.compare(password,user2.password);
  // if(!ispasswordvalid){
  //     console.log(`invalid password for user:${email}`);
  //     return res.status(400).send('invalid password');
  // }
  const token=jwt.sign({userId:user2._id},jwt_secret,{expiresIn:'1h'})
  console.log(`token generated for user:${email}`);
  res.json({token});

});


// app.post('/reorder',async(req, res) => {

//   const {filename,order}=req.body;
//   const filepath=path.join(__dirname,'uploads',filename);;
//   console.log('filepath',filepath);
//   console.log('Order received:', order); 
  
//   try{
//    // load the uploaded pdf
//     const pdfbuffer=fs.readFileSync(filepath);
//     console.log('pdfbuffer',pdfbuffer)
//     const pdfdoc=await PDFDocument.load(pdfbuffer);
//     console.log('pdfdoc',pdfdoc);
// const newpdfdoc=await PDFDocument.create();
// console.log('newpdfdoc',newpdfdoc);

// console.log('Total pages in pdfdoc:', pdfdoc.getPageCount());

// for(const index of order){
//   console.log(`Processing page index: ${index}`);

//       if (index < 0 || index >= pdfdoc.getPageCount()) {
//         console.error(`Invalid page index: ${index}`);
//         throw new Error(`Invalid page index: ${index}`);
//       }


//  const [copiedpage]=await newpdfdoc.copyPages(pdfdoc,[index]);
//  console.log('copiedpage',copiedpage);
//  console.log(`Copied page ${index} successfully.`);
//  newpdfdoc.addPage(copiedpage);
// }

// const pdfbytes=await newpdfdoc.save();
// const newfilename=`reordered_${filename}`;
// console.log(`Reordered PDF saved successfully as ${newfilename}.`);
// fs.writeFileSync(path.join(__dirname,'uploads',newfilename),pdfbytes);
// res.status(200).send({message:'pdf reorder successfully',newfilename});
//   }catch(error){
//     console.error('error reordering files',error);
//     res.status(500).send({message:"failed to reordering pdf"})
    
//   }

//   });



// app.post('/splitpdf', upload.single("pdf"),async(req, res) => {
//   try{
//    // load the uploaded pdf
//     const pdfbuffer=fs.readFileSync(req.file.path);
//     console.log('pdfbuffer',pdfbuffer)
//     const pdfdoc=await PDFDocument.load(pdfbuffer);
//     console.log('pdfdoc',pdfdoc);

//     const splitPDFs=[];

//     for(let i=0;i<pdfdoc.getPageCount();i++){
//       const newpdf=await PDFDocument.create();
//       const [copiedpage]=await newpdf.copyPages(pdfdoc,[i]);
//       newpdf.addPage(copiedpage);
//      const pdfbytes=await newpdf.save();
//      console.log('pdf bytes',pdfbytes );


//      const splitpdfpath=path.join(__dirname,'split',`split_page_${i+1}.pdf`);
//      console.log('File path:', splitpdfpath);

     
// if(!fs.existsSync(path.join(__dirname,"split"))){
//   fs.mkdirSync(path.join(__dirname,"split"));

// }

//      fs.writeFileSync(splitpdfpath,pdfbytes);
//      splitPDFs.push(splitpdfpath);

//     }

// res.status(200).send({message:'pdf split successfully',files:splitPDFs});
//   }catch(error){
//     console.error('error spliting files',error);
//     res.status(500).send({message:"failed to split pdf"})
    
//   }
//   finally{
//     fs.unlinkSync(req.file.path);
//   }

//   });
  
//   const {filename,searchtext}=req.body;
//   if (!searchtext || !filename) {
//     return res.status(400).json({ message: 'Filename and search text are required.' });
//   }
  
//   // const filepath=path.join(__dirname,'uploads',filename);
//   // console.log(req,res);
//   console.log('filepath',filepath);

//   fs.readFile(filepath,(err,data)=>{

//     PdfParse(data).then(function (pdfdata){
//       const text=pdfdata.text;
//       console.log('text',text);
//       const found=searchtext.toLowerCase();
//       console.log('found',found);
// let highlightedtext=text.replace(new RegExp(`(${found})`,'gi'),'<mark>$1</mark>');
// console.log('found',highlightedtext);

// if(highlightedtext!==text){
//   console.log('Text found and highlighted');
//   res.json({found:true,highlightedtext});
//  }else{
//   console.log('Text not found');
//   res.json({found:false});
//  }     
//     }).catch(err=>{
//       console.log('error parsing pdf',err);
//       res.status(500).json({message:'error parsing pdf'})
//     });
//   });
// });










//   app.post('/upload/form', upload.single('file'), async (req, res) => {
//     try {

//       console.log('Request Body:', req.body);
//       console.log('Request File:', req.file);

     
//       const file = req.file;
//       if (!file) {
//         return res.status(400).send('No file uploaded.');
//       }

//       const filepath=req.file.path;
//       console.log('filepath',filepath);
      
//  // Log information about the file
//  console.log('File Buffer Length:', file.buffer ? file.buffer.length : 'No buffer');
//  console.log('File Original Name:', file.originalname);
//  console.log('File Mime Type:', file.mimetype);
//  console.log('File object:', file); // Check file object


// //          fs.readFile(filepath,'utf8',(err,data)=>{
// //           console.log('Attempting to read file from path:', filepath);
// //           if(err){
// //             console.error('Error reading file:', err);  // Log detailed error
// //             return res.status(500).send('error reading file');
// //           }
// //           console.log('File content:', data);
// // if(req.file.mimetype==='application/json'){
// //   console.log('File is identified as JSON.');
// //   try{
// //     const jsondata=JSON.parse(data);
// //     console.log('File content:', jsondata);
// //   }
// // catch(error){
// //   console.error('Invalid JSON format:', error);
// //   res.status(200).json({ message: 'File uploaded and parsed successfully', jsondata });
// // return res.status(400).send('invalid json format');
// // }

// // }
// //   });
      
//       // const filepath=path.join(__dirname,'uploads',basedata.pdf);
//       // console.log('File saved locally:', filepath); 
      
//        const databuffer=fs.readFileSync(filepath);
//        const data=await pdf(databuffer);
//       console.log('extracted pdf text', data.text);

// //extract the name from regex
//       const pdftext=data.text;
// const namematch=pdftext.match(/Name:\s*(\w+\s\w+)/);//s* allow any number of space after Name:,\w+:\w letter,digits,underscore,\s capture single space
// const agematch =pdftext.match(/Age:\s*(\d+)/);//d+ allow any number digits
// console.log('extraction from regex',namematch,agematch);

// //get the extract data
// const name=namematch?namematch[1]:'Unknown';
// const age=agematch?agematch[1]:'Unknown';
// console.log('extraction name and age from regex',name,age);


// //create the JSON object
// const extractdata={
//   name:name,
//   age:age,
// }

// //write JSON on a file 
// // const jsonpath=path.join(__dirname,'extracteddata.json');
// // Write JSON to the file using callback-based API
// fs.writeFile(jsonpath, JSON.stringify(extractdata, null, 2), (err) => {
//   if (err) {
//     console.error('Error writing JSON to file', err);
//   } else {
//     console.log('JSON data has been written to', jsonpath);
//   }
// });


// res.status(200).json({
//   message:'pdf processed successfully',
//   data:extractdata,
// });

//     } catch (error) {
//       console.error('Error:', error);
//       res.status(500).json({ message: 'Error processing file', error: error.message });
//     }
//   });


app.post('/convert-pdf',upload.single('file'), async(req, res) => {

    if (!req.file) {
        return res.status(400).send('No file uploaded.');
      }
  const filepath=req.file.path;
  console.log('filepath',filepath);

const parsedpath = path.parse(filepath);
const filename = parsedpath.name;
console.log('Filename without extension:', filename);

  const outputpath=path.join(__dirname,'uploads',`converted_${filename}.docx`);
  try{

  // const docxpath=filepath.replace('.pdf','.docx');
  // console.log('docxpath',docxpath);
  // await pdf2docx.convert(filepath,docxpath);

//convert pdf to docx
const extractedtext=await extracttextfrompdf(filepath);
// console.log('Extracted text:', extractedtext);
console.log('Creating DOCX from extracted text...');
await createdocxfromtext(extractedtext,outputpath);
// res.status(200).json({message:'pdf converted to docx successfully ',outputpath})

  
const imagesdir=path.join('uploads','images');
  if(!fs.existsSync(imagesdir)){
    fs.mkdirSync(imagesdir);
  }



    res.status(200).send({
      message:'pdf coverted successfully',
      docx:outputpath,
      images:imagepaths,
    });

  }catch(error){
    console.log('error converting files',error);
    res.status(500).send({message:"failed to converting pdf"})
    
  }

  });

    const PORT = 5002;
    
// const jwt_secret='';
// app.use(passport.initialize());



