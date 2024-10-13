const express = require('express');
const http = require('http');
const socketio = require('socket.io');
const cors = require('cors');
// const mongoose = require('mongoose');
const app = express();



  // app.use(cors(corsOptions));
  
  
  app.get('/ping', (req, res) => {
    res.status(200).json({ message: 'pong' });
  });
  
  const server=http.createServer(app);
  const initwebsocket=(server)=>{

    const io=socketio(server,{
    cors:{
      origin:"http://localhost:5173",
      methods:["GET","POST"],
      credentials:true
    }
  });

  
  
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
  
//     socket.on('send-delta',({ delta, senderid })=>{
//       // console.log('received message',delta);   
//        // const {delta,senderid}=data; 
//        console.log('Delta received from client:',senderid,delta);
      
      
//         // Broadcast the received delta to all other clients except the sender
//         socket.broadcast.emit('receive-delta',{ delta, senderid });
//     });
  
  
//     socket.on('comment-added',(data)=>{
//       io.emit('receive-notification',{
//         type:'comment',
//         message:`${data.username} commented:"${data.commenttext}" on ${data.documentid}`
//       });
//     });
  
//     socket.on('document-edited',(data)=>{
//       io.emit('receive-notification',{
//         type:'edit',
//         message:`${data.username} edited document on ${data.documentid}`
//       });
//     });
  
//     // Send the initial data to the new client
//     socket.emit('cell-update', spreadsheetData);
  
//     // Handle cell updates
//     socket.on('update-cell', (updatedata) => {
//         spreadsheetData = updatedata;
//         // Broadcast the update to all connected clients
//         socket.broadcast.emit('cell-update', updatedata);
//     });
  
  
//       // Handle cell updates
//       socket.on('send-annotation', async(data) => {
//         const {pdfid,pagenumber,annotation} =data;
  
//         const existingpage=await Annotation.findOne({pdfid,pagenumber});
  
//        if(existingpage){
//         existingpage.annotations.push(annotation);
//         await existingpage.save();
//        }else{
//         await Annotation.create({pdfid,pagenumber,annotations:[annotations]});
//        }
//   socket.broadcast.emit('receive-annotation',data);
//     });
  
    socket.on('disconnect',()=>{
      console.log('user disconneced',socket.id);
    });
  });
}
  
module.exports={initwebsocket};
  