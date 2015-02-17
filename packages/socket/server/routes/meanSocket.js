'use strict';

// The Package is past automatically as first parameter
module.exports = function(MeanSocket, io) {

    var guestUserWatchList = [];
    var adminWatchList = [];
    var _ = require('lodash');
    var guestnumber = 1;
    var mongoose = require('mongoose'),
        Message = mongoose.model('Message'),
        GuestUser = require('../controllers/guestUsers.js'),
        config = require('meanio').loadConfig(),
        mysql = require('mysql'),
        moment = require('moment'),
        socketHelper = require('../controllers/sockethelper.js'),
        adminSocketHelper = require('../controllers/adminsockethelper.js');

    io.on('connection', function(socket) {
     var DEBUG=false;
    var print= function(printmessage)
    {if(DEBUG)
      print(printmessage);
    }

  /*     
       Hides the chat box
                                */
        socket.on('hideTheChatBox', function() {
            socket.emit("HideTheChat");
        });

    /*     
     When the admin is typing
                                */

        socket.on('adminIsTyping', function(user) {
           if(user)
           {
             for(var s=0,h=user.length;s<h;s++)

            io.to(user[s]).emit('guestUser:adminIsTyping');
 }
                   });
     
     /*     
       When admin stops typing
                                */

        socket.on('adminStoppedTyping', function(user) {
            if(user)
           { for(var s=0,h=user.length;s<h;s++)
            io.to(user[s]).emit('guestUser:adminStoppedTyping');}
        });

      /*     
       When the public user is typing
                                     */

        socket.on('userIsTyping', function() {
            // print("user is typing");
            for (var x = 0, h = adminWatchList.length; x < h; x++) {
                io.to(adminWatchList[x]).emit('adminChatPage:userIsTyping', socket.id);
            }
        });

         /*     
       When the public user stops typing
                                      */
        socket.on('userStoppedTyping', function() {
            // print("user Stopped typing");
            for (var x = 0, h = adminWatchList.length; x < h; x++) {
                io.to(adminWatchList[x]).emit('adminChatPage:userStoppedTyping', socket.id);
            }
        });


        socket.on('adminSendingMessage', function(message) {
         var g=message.message.author;
         message.message.author="admin";
         console.log(g);
         console.log(message.message.author);
           for(var g=0,h=adminWatchList.length;g<h;g++)
               if(adminWatchList[g]!=socket.id)
                   io.to(adminWatchList[g]).emit('adminChatPage:AdminToAdmin',{message:message.message,socket:message.socketid});
                 Message.findOne({'cookie':message.cookie}).exec(function(err,data){
                   if(data)
                   {
                        data.messages.push({
                    text: message.message.text,
                    author: g,
                    senddate: message.message.senddate
                });
                   data.markModified('messages');
                    data.save();
                    
                   }
          
         

          }); 
            for(var ss=0,h=message.socketid.length;ss<h;ss++)
            io.to(message.socketid[ss]).emit('guestUser:messageFromAdmin', message.message);
      
        });

socket.on('guestUser:minimize',function(flag){

  for(var g=0,gg=guestUserWatchList.length;g<gg;g++)
           for(var h=0,hh=guestUserWatchList[g].socketid.length;h<hh;h++)
               if(guestUserWatchList[g].socketid[h]==socket.id)
               {
                    for(var y=0;y < guestUserWatchList[g].socketid.length;y++){
                        if(guestUserWatchList[g].socketid[y]!=socket.id){
                          io.to(guestUserWatchList[g].socketid[y]).emit('guestUser:minimizebros', flag);    
                        }
                    }

                }

});
socket.on('guestUser:RegisteringSocket',function(){

            var cookie2 = socket.request.headers.cookie;
            var ind = cookie2.indexOf(';');
            cookie2 = cookie2.substring(ind + 2, cookie2.length);
            ind = cookie2.indexOf('=');
            cookie2 = cookie2.substring(ind + 1, cookie2.length);
            var alreadyPresent=-1;
            for(var ui =0, uiy=guestUserWatchList.length;ui<uiy;ui++)
                    if(guestUserWatchList[ui].cookie==cookie2)
                         alreadyPresent=ui;

           if(alreadyPresent==-1)
            { 

             var guest = {
                guestid: guestnumber++,
                socketid: [socket.id],
                messages: [],
                typing: false,
                admintyping: false,
                data: {},
                cookie: cookie2
            };     
            guestUserWatchList.push(guest);
            // for (var x = 0, h = adminWatchList.length; x < h; x++) {
            //     io.to(adminWatchList[x]).emit('adminChatPage:guestIsEntering', guest);
            // }

           
          }
                 else
          { 
             guestUserWatchList[alreadyPresent].socketid.push(socket.id);
             io.to(guestUserWatchList[alreadyPresent].socketid[0]).emit("guestUser:tellmestatebro",socket.id);
             for (var x = 0, h = adminWatchList.length; x < h; x++) {
                io.to(adminWatchList[x]).emit('adminChatPage:guestAddingSocket', {cookie:cookie2,socketid:socket.id});
            }
            if(guestUserWatchList[alreadyPresent].socketid.length>1)
            io.to(guestUserWatchList[alreadyPresent].socketid[0]).emit("guestUser:SendMessagesToOtherInstance",socket.id);
              //io.to(socket.id).emit("guestUser:SendingMessages",guestUserWatchList[alreadyPresent].messages);
             
               
          }

});
        socket.on('guestUser:newbrostatechange', function(newbro) {
           io.to(newbro.socketid).emit('guestUser:minimizebros',newbro.state);   
        });
        socket.on('guestUser:enteringWithCLId', function(jobId) {
          print("GUEST USER ENTERING WITH CL ID");
           // print();
            if (jobId != 'login')
                getJobFromCL(jobId, socket);
            var d2 = {
                jobId: jobId,
                cookie: socket.request.headers.cookie
            };
            socket.emit("guestUser:returnData", d2);
        });



        socket.on('guestUser:entering', function() {
         
          //print();
            var cookie2 = socket.request.headers.cookie;
            var ind = cookie2.indexOf(';');
            cookie2 = cookie2.substring(ind + 2, cookie2.length);
            ind = cookie2.indexOf('=');
            cookie2 = cookie2.substring(ind + 1, cookie2.length);
            var data = {
                cityname: "",
                keyword: "No Job Id",
                job_description: "User entered without Job Id"
            };
           
            var alreadyPresent=-1;
            for(var ui =0, uiy=guestUserWatchList.length;ui<uiy;ui++)
                    if(guestUserWatchList[ui].cookie==cookie2)
                         alreadyPresent=ui;
 console.log("AlreadyPresent"+alreadyPresent);
console.log(cookie2);
            if(alreadyPresent==-1)
            { 

             var guest = {
                guestid: guestnumber++,
                socketid: [socket.id],
                messages: [],
                typing: false,
                admintyping: false,
                data: data,
                cookie: cookie2
            };     
            guestUserWatchList.push(guest);
                
            

           
          }
          else
          { 

             guestUserWatchList[alreadyPresent].data=data;
             console.log(adminWatchList);
             console.log(guestUserWatchList);
             if( guestUserWatchList[alreadyPresent].socketid.length==1)
                for (var x = 0, h = adminWatchList.length; x < h; x++) 
                io.to(adminWatchList[x]).emit('adminChatPage:guestIsEntering', guestUserWatchList[alreadyPresent]);
           
            // io.to(guestUserWatchList[alreadyPresent].socketid[0]).emit("guestUser:SendMessagesToOtherInstance",socket.id);
              //io.to(socket.id).emit("guestUser:SendingMessages",guestUserWatchList[alreadyPresent].messages);
            socket.emit("guestUser:returnData", data);  
               
          }
           
           

        });

socket.on('guestUser:FromguestUserSendingMessages',function(messages){
  print("FROM GUEST USER SENDING MESAGES");
  console.log(messages);
  io.to(messages.socketid).emit('guestUser:SendingMessages',messages.messages);
});

        socket.on('disconnect', function() {
       
             var inGuestUser={x:0,y:0,total:0};
             var present=false;

             for(var hy=0,hu=guestUserWatchList.length;hy<hu;hy++)
                   for(var fr=guestUserWatchList[hy].socketid.length-1,fu=0;fr>=fu;fr--)
                    { 
                      if(guestUserWatchList[hy].socketid[fr]==socket.id)
                  {

                                inGuestUser.total=guestUserWatchList[hy].socketid.length;
                                inGuestUser.x=hy;
                                inGuestUser.y=fr;
                                present=true;
                                

                             }

}
            if(present)
                {
                  //  print(inGuestUser.total);
                      if(inGuestUser.total==1)
                         {
                           for (var x = 0, h = adminWatchList.length; x < h; x++)
                   io.to(adminWatchList[x]).emit('adminChatPage:guestIsLeaving', guestUserWatchList[inGuestUser.x]);
                        guestUserWatchList.splice(inGuestUser.x,1);
                      console.log("LEAVING GUEST");
                     }
                       else
                         {   
                            for (var x = 0, h = adminWatchList.length; x < h; x++)
                          io.to(adminWatchList[x]).emit('adminChatPage:guestIsRemovingASocket', socket.id);
                           guestUserWatchList[inGuestUser.x].socketid.splice(inGuestUser.y,1);
                         
          
                    }

               
                }
              else
              {
for (var y = 0, j = adminWatchList.length; y < j; y++)
                if (socket.id == adminWatchList[y])
                    adminWatchList.splice(y, 1);


              }



            //  var kickFromPool = -1;
            // kickFromPool = socketHelper.findAndEliminateGuest(socket.id, guestUserWatchList);
           

            // if (kickFromPool !== -1) {
            //     for (var x = 0, h = adminWatchList.length; x < h; x++)
            //         io.to(adminWatchList[x]).emit('adminChatPage:guestIsLeaving', guestUserWatchList[kickFromPool]);
            //     guestUserWatchList.splice(guestUserWatchList.indexOf(guestUserWatchList[kickFromPool]), 1);

            // }
            

        });



        socket.on('adminRequires:makeMySocketAdmin', function(res) {
            var cookie2 = socket.request.headers.cookie;
            var ind = cookie2.indexOf(';');
            cookie2 = cookie2.substring(ind + 2, cookie2.length);
            ind = cookie2.indexOf('=');
            cookie2 = cookie2.substring(ind + 1, cookie2.length);
            Message.findOne({
                'cookie': cookie2
            }).remove().exec();
             
            var kickFromPool = -1;

            kickFromPool = socketHelper.findAndEliminateGuest(socket.id, guestUserWatchList);


            if (kickFromPool !== -1) {
                guestUserWatchList.splice(kickFromPool, 1);
                adminWatchList.push(socket.id);
                print(res);
            } else
                adminWatchList.push(socket.id);
        });




        socket.on('adminRequires:fetchListOfGuests', function() {
          console.log("FETCH LIST OF GUESTS");
            socket.emit('SendingToAdmin:listOfGuests', guestUserWatchList);
        });
        socket.on('guestUser:sendingMessage', function(activeuser) {

            Message.findOne({
                _id: activeuser.mongoid
            }).exec(function(err, data) {
              if(data){
                data.messages.push({
                    text: activeuser.text,
                    author: activeuser.author,
                    senddate: activeuser.senddate
                });
                data.markModified('messages');
                data.save();
              }
            });
            for (var x = 0, h = adminWatchList.length; x < h; x++) {
                io.to(adminWatchList[x]).emit('adminChatPage:guestSentaMessage', {
                    activeuser: activeuser,
                    socketid: socket.id
                });
            }
         var kick={x:-1,y:-1};
            for(var y=0,yy=guestUserWatchList.length;y<yy;y++)
                for(var xx=guestUserWatchList[y].socketid.length-1,x=0;xx>=x;xx--)
                      if(socket.id==guestUserWatchList[y].socketid[xx])
                        {kick.x=y;kick.y=xx;}
if(kick.x!=-1)
{
for(var q=0;q<guestUserWatchList[kick.x].socketid.length;q++)
     {
          if(q!=kick.y)
               io.to(guestUserWatchList[kick.x].socketid[q]).emit("guestUser:GuestToGuest",{
                    text: activeuser.text,
                    author: activeuser.author,
                    senddate: activeuser.senddate
                });

     }
            }
         

        });






        var getJobFromCL = function(jobId,socket) {
            var db_config = config.mySqlConn;
            var connection;

            function handleDisconnect() {
                connection = mysql.createConnection(db_config); // Recreate the connection, since
                // the old one cannot be reused.

                connection.connect(function(err) { // The server is either down
                    if (err) { // or restarting (takes a while sometimes).
                        print('error when connecting to db:', err);
                        setTimeout(handleDisconnect, 2000); // We introduce a delay before attempting to reconnect,
                    } else {

                        connection.query('SELECT * FROM cl_job WHERE job_id=' + jobId + ' limit 1', function(err, rows, fields) {
                            if (!err) {
                                var keyword = rows[0].keyword_text; //print(rows[0].city_id);
                                var job_description = rows[0].job_description;
                                var stringme = job_description.replace(/&quot;/g, "'");
                                print(stringme);
                                connection.query('SELECT * FROM cl_city WHERE city_id=' + rows[0].city_id + ' limit 1', function(err, rows, fields) {
                                    //print(rows[0].city_name2);
                                    var dataFromCL = {
                                        cityname: rows[0].city_name2,
                                        keyword: keyword,
                                        job_description: stringme
                                    };
                                    var cookie2 = socket.request.headers.cookie;
                                    var ind = cookie2.indexOf(';');
                                    cookie2 = cookie2.substring(ind + 2, cookie2.length);
                                    ind = cookie2.indexOf('=');
                                    cookie2 = cookie2.substring(ind + 1, cookie2.length);
                                    var guest = {
                                        guestid: guestnumber++,
                                        socketid: socket.id,
                                        messages: [],
                                        typing: false,
                                        admintyping: false,
                                        data: dataFromCL,
                                        cookie: cookie2
                                    };
                                     var alreadyPresent=-1;
            for(var ui =0, uiy=guestUserWatchList.length;ui<uiy;ui++)
                    if(guestUserWatchList[ui].socketid==socket.id)
                         alreadyPresent=ui;

            if(alreadyPresent!=-1){
                                    guestUserWatchList[alreadyPresent].data=dataFromCL;
                                    for (var x = 0, h = adminWatchList.length; x < h; x++) {
                                        io.to(adminWatchList[x]).emit('adminChatPage:guestIsEntering',  guestUserWatchList[alreadyPresent]);
                                    }
}
                                });
                            }

                        });


                    } 
                });
                connection.on('error', function(err) {
                    print('db error', err);
                    if (err.code === 'PROTOCOL_CONNECTION_LOST') { 
                        handleDisconnect(); 
                    } else { 
                        throw err; 
                    }
                });
            }

            handleDisconnect();
        }
    });
};