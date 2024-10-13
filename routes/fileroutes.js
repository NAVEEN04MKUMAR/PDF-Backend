const express = require('express');
const router = express.Router();
const cors = require('cors');
const upload = require('../middleware/multer.js'); 
const { uploadFile } = require('../controllers/fileController.js');
const {  Annotationtestpdf } = require('../controllers/Annotation-text-pdf.js');
const {  Converttodocx } = require('../controllers/Converttodocx.js');
const {  Encryption } = require('../controllers/Encryption.js');
const {  Erase } = require('../controllers/Erase.js');
const {  Mergepdf } = require('../controllers/mergepdf.js');
const {  Redact } = require('../controllers/redact.js');
const {  Reorder } = require('../controllers/reorder.js');
const {  Rewrite } = require('../controllers/Rewrite.js');
const {  Split } = require('../controllers/Split.js');


const {  Createrepo } = require('../controllers-clone/createrepository.js');
const {  Clonerepo } = require('../controllers-clone/clonerepo.js');
const {  Getrepo } = require('../controllers-clone/deleterepo.js');
const {   Deletetrepoa } = require('../controllers-clone/deleterepo1.js');
const {   Trackfile } = require('../controllers-clone/2.version-control.js/track-changes.js');
const { Commit } = require('../controllers-clone/2.version-control.js/commit.js');
const { getCommithistory } = require('../controllers-clone/2.version-control.js/commit-history.js');
const { Createbranch } = require('../controllers-clone/3.branch/create-branch.js');
const { Changebranch } = require('../controllers-clone/3.branch/branchchange.js');
const { getBranches } = require('../controllers-clone/3.branch/getbranch.js');
const { Deletebranch } = require('../controllers-clone/3.branch/deletebranch.js');



router.post('/upload', upload.single('file'), uploadFile);
router.post('/annotation-text-pdf', upload.single('file'), Annotationtestpdf);
router.post('/converttodocx', upload.single('file'),   Converttodocx);
router.post('/encrypt-pdf', upload.single('file'), Encryption);
router.post('/erase-pdf', upload.single('file'), Erase);
router.post('/merge-pdf', upload.array('pdf',10), Mergepdf);
router.post('/redaction-pdf', upload.single('file'), Redact);
router.post('/reorder-pdf', upload.single('file'), Reorder);
router.post('/rewrite-pdf', upload.single('file'), Rewrite);
router.post('/splitpdf', upload.single('file'), Split);

// app.post('/mergepdf', upload.array("pdf",10),


router.options('/create-repo', cors());
router.post('/create-repo', cors(),Createrepo);
// router.post('/clone-repo', cors(),Clonerepo);
router.get('/get-repo', cors(),Getrepo);
router.delete('/delete-repo/:reponame', cors(), Deletetrepoa);

router.post('/file-upload',upload.single('file'), cors(), Trackfile);
router.post('/file-commit',upload.single('file'), Commit);
router.get('/file-commit-history', getCommithistory);

router.post('/branch-create',Createbranch);
router.post('/branch-change',Changebranch);
router.get('/getbranches', getBranches );
router.post('/branch-delete',Deletebranch);

module.exports = router;
