let currenteditorcontent="This is the initial paragraph text.";

io.on('connection',(socket)=>{
  // console.log('Emitting initial content:', currenteditorcontent);
  console.log('user created',socket.id);

  //send this one to the newly connected client
  socket.emit('receive-initial-text',{ text:currenteditorcontent});
  
  
  socket.on('sendmessage',(message)=>{
    console.log('received message',message);
    io.emit('received message,',message);
  });

  socket.on('send-delta',({ delta, senderid })=>{
    // console.log('received message',delta);   
     // const {delta,senderid}=data; 
     console.log('Delta received from client:',senderid,delta);
    
    
      // Broadcast the received delta to all other clients except the sender
      socket.broadcast.emit('receive-delta',{ delta, senderid });
  });


  socket.on('comment-added',(data)=>{
    io.emit('receive-notification',{
      type:'comment',
      message:`${data.username} commented:"${data.commenttext}" on ${data.documentid}`
    });
  });

  socket.on('document-edited',(data)=>{
    io.emit('receive-notification',{
      type:'edit',
      message:`${data.username} edited document on ${data.documentid}`
    });
  });

  // Send the initial data to the new client
  socket.emit('cell-update', spreadsheetData);

  // Handle cell updates
  socket.on('update-cell', (updatedata) => {
      spreadsheetData = updatedata;
      // Broadcast the update to all connected clients
      socket.broadcast.emit('cell-update', updatedata);
  });


    // Handle cell updates
    socket.on('send-annotation', async(data) => {
      const {pdfid,pagenumber,annotation} =data;

      const existingpage=await Annotation.findOne({pdfid,pagenumber});

     if(existingpage){
      existingpage.annotations.push(annotation);
      await existingpage.save();
     }else{
      await Annotation.create({pdfid,pagenumber,annotations:[annotations]});
     }
socket.broadcast.emit('receive-annotation',data);
  });

  socket.on('disconnect',()=>{
    console.log('user disconneced',socket.id);
  });
});


const Annotationschema=new mongoose.Schema({
  // pagenumber:Number,
  pdfpath: String,
  annotations:Array,
});
const Annotation=mongoose.model('Annotation',Annotationschema);

app.get('/annotations/:pdfid',async(req,res)=>{
  const {pdfid}=req.params;
  const annotations=await Annotationschema.find({pdfid});
  res.json(annotations);
});


// Set up multer for file uploads
const storage=multer.memoryStorage()
const upload = multer({
  storage // The folder to save uploaded files
});

//formdata not working properly i dont kn[ow what to do
app.post('api/uploadannotatedpdf', upload.single('file'),(req,res)=>{
  if (!req.file) {
    return res.status(400).send('No file uploaded.');
  }
// The file will be saved in the 'uploads' folder
const filePath = path.join(__dirname, 'uploads', req.file.filename);
console.log('Received file:', filePath);
// Optionally, you can move or rename the file here if needed
res.status(200).send('File uploaded successfully.');




  // const {pdfid,annotations}=req.body;

  // const annotationdata=await Annotation.findById(pdfid);
  // const existingpdfbytes=fs.readFileSync(annotationdata.pdfpath);

  // const pdfDoc=await PDFDocument.load(existingpdfbytes);
  // const pages=pdfDoc.getPages();
  // const firstpage=pages[0];

  // annotations.forEach((annotation)=>{
  //   firstpage.drawText(annotation.text,{x:annotation.x,y:annotation.y,size:12})
  // });

  // const pdfbytes=await pdfDoc.save();
  // const filepath=path.join(__dirname,'annotated.pdf')
  // fs.writeFileSync(filepath,pdfbytes);
  // res.download(filepath);
});



const canvasschema=new mongoose.Schema({
  version:String,
  objects: [
    {
      type: String,
      version: String,
      originX: String,
      originY: String,
      left: Number,
      top: Number,
      width: Number,
      height: Number,
      fill: String,
      stroke: String,
      strokeWidth: Number,
      strokeDashArray: Array,
      strokeLineCap: String,
      strokeDashOffset: Number,
      strokeLineJoin: String,
      strokeUniform: Boolean,
      strokeMiterLimit: Number,
      scaleX: Number,
      scaleY: Number,
      angle: Number,
      flipX: Boolean,
      flipY: Boolean,
      opacity: Number,
      // shadow: Schema.Types.Mixed,
      visible: Boolean,
      backgroundColor: String,
      fillRule: String,
      paintFirst: String,
      globalCompositeOperation: String,
      skewX: Number,
      skewY: Number,
      path: Array,
    }
  ]
  });
const canvasmodel=mongoose.model('canvas',canvasschema);



mongoose.connect('mongodb+srv://livepolling:livepolling@cluster0.zrr81ak.mongodb.net/livepolling',{useNewUrlParser: true,useUnifiedTopology: true,maxpoolSize: 10})
.then(()=>{
  console.log('connected to db');
  const db=mongoose.connection.db;
})
.catch(()=>{
  console.log('error');
});


const pdfschema=new mongoose.Schema({
  originalnamename:String,
  modifiedbuffer:Buffer
});
const pdfmodel=mongoose.model('pdf',pdfschema);


  const Documentschema=new mongoose.Schema({
    tittle:String,
    content:String,
    author:String,
    versions:[
        {
            versionnumber:Number,
            content:String,
            author:String,
            timestamp:{type:Date,
              default:Date.now
            }
        }
    ],

});
const Document=mongoose.model('Document',Documentschema);

app.post('/documents/create',async(req,res)=>{
  console.log('i am inside the create');
  console.log('Request body:', req.body); 
  // res.status(200).send("Request received");
  const {tittle,content,author}=req.body;

  try{

    const newdocument=new Document({
      tittle:tittle,
      content:content,
    versions:[
      {
    versionnumber:1,
    content:content,
    author:author,
    timestamp:new Date(),
    },
  ]
    });
    console.log('Saving document...');
    const saveddocument=await newdocument.save();
    console.log('Document saved:', saveddocument);
    
        res.status(201).json({
      message:'document creted successfully',
      document:saveddocument})
  }
  catch(err){
    console.error(err);
    res.status(500).json({ message: 'Error creating document', error: err });
  }
  });


app.post('/documents/:id/update',async(req,res)=>{
  const {id}=req.params;
  const {newcontent,author}=req.body;

  //find document
  let document=await Document.findById(id);

if(!document){
  return res.status(404).json({message:'document not found'})
}

  //create the newversion then pass to the version array
  const newversions={    
        versionnumber:document.versions.length+1,
        content:document.content,
        author:author,
        timestamp:new Date(),
    };

//update the document content nd add the new version
    document.versions.push(newversions);
    document.content=newcontent;
    document.author = author;
    await document.save();
    res.json({message:'document updated and the version saved'});

    io.emit('document-added',{
      documentid:id,
      newcontent:newcontent,
      author
    });
    res.json({ message: 'Document updated' });
  });


  app.get('/documents/:id/history',async(req,res)=>{
    console.log('Request received at backend');
    // console.log('request',req);
    const {id}=req.params;
    console.log('id',id)
  
    try{
    //find document
    let document=await Document.findById(id).select('versions');  
    if(!document){
    return res.status(404).json({message:'document not found'})
     }

     res.json(document.versions); 
    }catch(err){
      console.error('Error fetching document:', err);
      res.status(500).json({ message: 'Error fetching document', error: err.message });

    }   
});

  app.post('/documents/:id/revert',async(req,res)=>{
    const {id}=req.params;
    const {versionnumber}=req.body;
    console.log(`Reverting document ID ${id} to version ${versionnumber}`);
    //find document
    let document=await Document.findById(id);

    const selectedversion=document.versions.find(v=>v.versionnumber===versionnumber);
    if(selectedversion){
      document.content=selectedversion.content;
      document.author=selectedversion.author;
      await document.save();
      res.json({message:`document reverted to version ${versionnumber}`});
    }else{
      res.status(404).json({message:'version not found'});
    }
      });
  
      const commemtschema=new mongoose.Schema({
  selectedtext:{type:String},
  documentid:{type:String,required:true},
  text:{type:String,required:true},
  comment: String,
  date: {
     type: Date, 
     default: Date.now,
   },

});

const comment=mongoose.model('comment',commemtschema);


app.post('/comments',async(req,res)=>{
  const {documentid,selectedtext}=req.body;
  console.log('request body',req.body);

  console.log('Received comment submission:');
  console.log(`Document ID: ${documentid}`);
  console.log(`Selected Text: ${selectedtext}`);
  const text = req.body.text; 
  console.log(`Comment: ${text}`);
  try
  {

    console.log('Data being sent to Comment.create():', {
      documentid,
      selectedtext,
      text,
  });


    const newcomment=new comment({
      documentid,
     selectedtext,
     text,
      // parantid,
      // userid,
    });
    await newcomment.save();
    console.log('Successfully created new comment:', newcomment);
    res.status(201).json(newcomment);

    io.emit('comment-added',{
      documentid,
      selectedtext,
      text:comment.text
    });
  }
  catch(err){
    console.error('Error creating comment:', err);
    res.status(500).json({message:'server error',err});
  }
});



app.get('/documents/:id',async(req,res)=>{
   console.log(`Fetching document with ID: ${req.params.id}`);
  const  documentId  = req.params.id;
  console.log(` documentid with ID: ${documentId}`);
  
  try
  {
    const document = await Document.findById( documentId );
    console.log( 'document',document);

    if (!document) {
        return res.status(404).json({ message: 'Document not found' });
    }
    res.status(200).json(document);
  }  catch(err){
    res.status(500).json({message:'server error',err});
  }
});


app.get('/comments',async(req,res)=>{
  
  try
  {
    const comment=await comment.find();
    res.status(201).json(comment);
  }
  catch(err){
    res.status(500).json({message:'server error',err});
  }
});

app.get('/comments/:documentid',async(req,res)=>{
  const {documentid}=req.params;
  const comments=await comment.find({
    documentid}).populate('replies');
  res.json(comments);
});

// In-memory storage for spreadsheet data
let spreadsheetData1 = [
  ['', 'A', 'B', 'C'],
  ['1', '', '', ''],
  ['2', '', '', ''],
  ['3', '', '', ''],
];

// Serve static files (e.g., frontend assets)
app.use(express.static('public'));

// Get spreadsheet data
app.get('/spreadsheet', (req, res) => {
  res.json(spreadsheetData1);
});

// Update spreadsheet data
app.post('/spreadsheet', (req, res) => {
  const { data } = req.body;
  if (Array.isArray(data)) {
      spreadsheetData1 = data;
      res.status(200).json({ message: 'Spreadsheet data updated successfully' });
  } else {
      res.status(400).json({ error: 'Invalid data format' });
  }
});


const fileFilter=(req,file,cb)=>{
  if(file.mimetype==='imge/jpeg'||file.mimetype==='image/png'){
    cb(null,true);//where file saved
  }
  else{
    cb(new Error('file type not allowed'),false);
  }
};



const editpdf=async(filepath,outputfilepath)=>{
   console.log('Starting PDF editing');
  console.log('Input file path:', filepath);
  console.log('Output file path:', outputfilepath);

  try{
 if(!fs.existsSync(filepath)){
  throw new Error('File does not exist');
 }
    const existpdf=fs.readFileSync(filepath);
    console.log('File read successfully');

    console.log('Loading PDF document...');
    const pdfDoc=await PDFDocument.load(existpdf);
    console.log('PDF document loaded successfully');

    const page=pdfDoc.getPage(0);
    console.log('Adding text to the PDF');
    page.drawText('Hello,this is an  edited text',{
      x:50,
      y:500,
      size:30,
      color:rgb(0,0.53,0.71),
    });

    console.log('Saving edited PDF...');
    const pdfbytes=await pdfDoc.save();
    fs.writeFileSync(outputfilepath,pdfbytes);
    console.log('pdf edited successfully');
  }
  catch(error){
    console.error('Error editing PDF:', error);  
  }
}  
  

app.get('/edit-pdf',async(req,res)=>{
  console.log('Received request to edit PDF');
  const filename = req.query.filename; // Ensure filename is correctly set

  if (typeof filename !== 'string') {
    console.error('Invalid filename received:', filename);
    return res.status(400).send('Invalid filename');
  }

  console.log('Filename is valid:', filename);  // const {filename}=req.body;
  const inputfilepath=path.join(__dirname,'uploads',filename);
  const outputfilepath=path.join(__dirname,'uploads',`edited-${filename}`);
  console.log('Input file path:', inputfilepath);
  console.log('Output file path:', outputfilepath);

try{
  console.log('Starting PDF editing...');
  await editpdf(inputfilepath,outputfilepath);

  console.log('PDF editing complete');
  res.status(200).json({
    message:'pdf edited successfully',
    fileUrl:`http://localhost:5001/uploads/edited-${filename}`
  })
}
catch(error){
console.error('Error editing PDF:', error);
  res.status(500).json({ message: 'Error editing PDF', error });
}
})

app.post('/api/createfolder',async(req,res)=>{
  console.log('Received request to create folder');
  const { foldername } = req.body;
  console.log('request:', req.query.foldername);
  // const foldername = req.query.foldername; // Ensure filename is correctly set
  console.log('foldername:', foldername);

  const dirname=path.join(__dirname,'uploads',foldername);
  console.log('dirpath path:', dirname);

  if (!fs.existsSync(dirname)) {
    fs.mkdirSync(dirname);
    return res.status(200).send('foldercreated successfully');
  }

})


app.put('/api/rename',async(req,res)=>{
  console.log('Received request to rename folder');
  const { currentname,newname } = req.body;
  console.log('currentname', currentname);
  // const foldername = req.query.foldername; // Ensure filename is correctly set
  console.log('newname', newname);

  const currentpath=path.join(__dirname,'uploads',currentname);
  console.log('dirpath path:', currentpath);

  const newpath=path.join(__dirname,'uploads',newname);
  console.log('dirpath path:', newpath);


  fs.access(currentpath, fs.constants.F_OK, (err) => {
    if (err) {
      return res.status(404).json({ message: 'Current path does not exist' });
    }
    fs.access(newpath, fs.constants.F_OK, (err) => {
      if (!err) {
        return res.status(400).json({ message: 'Destination path already exists' });
      }
      fs.rename(currentpath, newpath, (err) => {
        if (err) {
          return res.status(500).json({ message: `Rename failed: ${err.message}` });
        }
        res.status(200).json({ message: 'Renamed successfully' });
      });
    });
  });
});

const folders = [
  { _id: '1', name: 'model' },
  { _id: '2', name: 'routes' },
  { _id: '3', name: 'uploads' },
];

// Endpoint to fetch available folders
app.get('/api/folders', (req, res) => {
  res.json(folders); // Respond with folder data
});

app.post('/api/movefolder',async(req,res)=>{
  console.log('Received request to move folder');
  const { foldertomove,destinationfolder } = req.body;
  console.log('foldertomove', foldertomove);
  // const foldername = req.query.foldername; // Ensure filename is correctly set
  console.log('destinationfolder', destinationfolder);

  const currentpath=path.join(__dirname,'uploads',foldertomove);
  console.log('dirpath path:', currentpath);

  const destinationpath=path.join(__dirname,'uploads',destinationfolder);
  console.log('dirpath path:', destinationpath);


  // Ensure the destination directory exists
  fs.mkdir(destinationpath, { recursive: true }, (err) => {
    if (err) {
      console.error(`Error creating destination directory "${destinationpath}":`, err.message);
      return res.status(500).json({ message: `Error creating destination directory: ${err.message}` });
    }
    console.log('Destination directory created or already exists.');

    // Read the contents of the source folder
    fs.readdir(currentpath, (err, files) => {
      if (err) {
        console.error(`Error reading folder "${currentpath}":`, err.message);
        return res.status(500).json({ message: `Error reading folder: ${err.message}` });
      }

      console.log('Files in the current folder:', files);

      // Move all the files from currentpath to destinationpath
      files.forEach((file) => {
        const currentFilePath = path.join(currentpath, file);
        const destinationFilePath = path.join(destinationpath, file);

        console.log(`Moving file "${currentFilePath}" to "${destinationFilePath}"`);

        fs.rename(currentFilePath, destinationFilePath, (err) => {
          if (err) {
            console.error(`Error moving file "${file}":`, err.message);
          } else {
            console.log(`Successfully moved file: ${file}`);
          }
        });
      });

      // Remove the original folder only if it is empty
      fs.rmdir(currentpath, (err) => {
        if (err) {
          console.error(`Error removing original folder "${currentpath}":`, err.message);
          return res.status(500).json({ message: `Error removing original folder: ${err.message}` });
        }
        console.log(`Successfully moved folder from "${currentpath}" to "${destinationpath}"`);
        res.status(200).json({ message: 'Folder moved successfully' });
      });


    });
  });
  

});
const PORT = 5001;

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

