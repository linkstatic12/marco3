'use strict';

angular.module('mean.system').controller('PusherChatController', ['$scope', '$rootScope', 'Global', 'Menus', '$http', 'MeanSocket', '$timeout', '$window','$sce',
    function($scope, $rootScope, Global, Menus, $http, MeanSocket, $timeout, $window,$sce) {
 console.log("ADMIN CHAT CONTROLLER");
        $scope.totalOnlineUsers = 0;
        $scope.onlineUsers = [];
        $scope.count = 0;
        var space = 0;
        $scope.SalesRep=false;
        $scope.memberlist = true;
         $scope.activechats = [];
        $scope.activeuser = {};
        var w = angular.element($window);
         $scope.turntotrusted = function(html)
         {
           
            return $sce.trustAsHtml(html);
         }
       
        $scope.changememberlist = function() {
            $scope.memberlist = !$scope.memberlist;
        }


          MeanSocket.on('adminChatPage:AdminToAdmin',function(res){
            
            for(var s=0,ss=$scope.onlineUsers.length;s<ss;s++)
                 for(var r=0,rr=res.socket.length;r<rr;r++)
                     {
                        if($scope.onlineUsers[s].socketid.indexOf(res.socket[r])!=-1)
                                  {

                                    $scope.onlineUsers[s].messages.push(res.message);
                                    break;
                                  }}
                                 $timeout(function() {
                                    $('.conversation-body').linkify();
                                }, 100); 
                             });

        MeanSocket.on('adminChatPage:guestSentaMessage',function(user){
             for(var x=0,h=$scope.onlineUsers.length;x<h;x++)
                for(var hy=0,hh=$scope.onlineUsers[x].socketid.length;hy<hh;hy++)
                if($scope.onlineUsers[x].socketid[hy]==user.socketid)
                    $scope.onlineUsers[x].messages.push(user.activeuser);
                 $timeout(function() {
                    $('.conversation-body').linkify();
                  }, 100); 
        });
        MeanSocket.on('adminChatPage:guestIsLeaving',function(user){
            var kickFromPool={x:0,y:0};
            var found=false;
            for(var x=0,h=$scope.onlineUsers.length;x<h;x++)
                for(var q=0,qq=$scope.onlineUsers[x].socketid.length;q<qq;q++)
                if($scope.onlineUsers[x].socketid[q]==user.socketid[0])
                   { 
                    kickFromPool.x=x;
                    kickFromPool.y=q;
                    found=true;
                   }

    if(found)
              {
                if($scope.activeuser==$scope.onlineUsers[kickFromPool.x])
                    $scope.activeuser=[];
              $scope.onlineUsers.splice($scope.onlineUsers.indexOf($scope.onlineUsers[kickFromPool.x]), 1);
             }
           
        });
        MeanSocket.on('adminChatPage:guestIsEntering',function(user){
            console.log(user);
            $scope.onlineUsers.push(user);
             var fetchMessages=[];
            for(var s=0,h=$scope.onlineUsers.length;s<h;s++)
                fetchMessages.push($scope.onlineUsers[s].cookie);

                     $http.post('/api/guestUser/fetchmessages',fetchMessages).success(function(res){
console.log(res);
for(var x=0,xx=res.length;x<xx;x++)
      for(var t=0,tt=$scope.onlineUsers.length;t<tt;t++)
           if(res[x].cookie==$scope.onlineUsers[t].cookie)
               $scope.onlineUsers[t].messages=res[x].messages;
                  

          });
        });

        MeanSocket.on('adminChatPage:guestAddingSocket',function(addedsocket)
        {
              for(var s=0,h=$scope.onlineUsers.length;s<h;s++)
                if($scope.onlineUsers[s].cookie==addedsocket.cookie)
                    { $scope.onlineUsers[s].socketid.push(addedsocket.socketid);
                        console.log($scope.onlineUsers[s]);
                    }


        });

        MeanSocket.on('adminChatPage:guestIsRemovingASocket',function(removedsocket){
var kick={x:-1,y:-1};
  for(var s=0,h=$scope.onlineUsers.length;s<h;s++)
       for(var ss=$scope.onlineUsers[s].socketid.length-1,hh=0;ss>=hh;ss--)
                 if($scope.onlineUsers[s].socketid[ss]==removedsocket)
                    { 
                        kick.x=s;
                        kick.y=ss;
                        
                    }

    if(kick.x!=-1)
         {
             $scope.onlineUsers[kick.x].socketid.splice(kick.y, 1);

         }

        });
        MeanSocket.on('adminChatPage:userIsTyping',function(user){
            console.log('user is typing');
            console.log(user);
            for(var sd=0;sd<$scope.onlineUsers.length;sd++)
            {
                if($scope.onlineUsers[sd].socketid==user){
                    $scope.onlineUsers[sd].admintyping = true;
                }
            }
       });
       MeanSocket.on('adminChatPage:userStoppedTyping',function(user){
          for(var sd=0;sd<$scope.onlineUsers.length;sd++)
            {
                if($scope.onlineUsers[sd].socketid==user){
                    $scope.onlineUsers[sd].admintyping = false;
                }
            } 
       });

        var inputChangedPromise;
        $scope.enterpressed = function(event) {
            if (event.keyCode == 13)
                {$scope.submittext($scope.activeuser);
                   event.preventDefault();
                }

        }
        $scope.inputChanged = function(activeuser) {
           
            if (activeuser.typing != true) {
                MeanSocket.emit("adminIsTyping", activeuser.socketid);
                activeuser.typing=true;
            }
            if (inputChangedPromise) {
                $timeout.cancel(inputChangedPromise);
            }
            inputChangedPromise = $timeout(taskToDo, 1000);
        }

        var taskToDo = function() {
            $scope.activeuser.typing = false;
            MeanSocket.emit("adminStoppedTyping", $scope.activeuser.socketid);

        }
        $scope.setActiveuser = function(activeuser) {
            $scope.activeuser =  activeuser;
             $timeout(function() {
                    $('.conversation-body').linkify();
              }, 100);
        }
        $scope.submittext = function(user) {
            if (user.text != "") {
                 for(var sd=0;sd<$scope.onlineUsers.length;sd++)
                 {
                    if(user.socketid==$scope.onlineUsers[sd].socketid)
                    { 
                        var currentmsg={author:"admin",text:user.text,senddate:Date.now()};
                        $scope.onlineUsers[sd].messages.push(currentmsg);
                        $scope.onlineUsers[sd].updated=Date.now();
                        currentmsg.author=Global.user.name;
                        MeanSocket.emit('adminSendingMessage',{socketid:user.socketid,message:currentmsg,cookie:user.cookie});
                        $timeout(function() {
                            $('.conversation-body').linkify();
                        }, 100);          
                    }
                 }
                // console.log(user);
                // console.log($rootScope.user.username);
                // for(var x=0;x<$scope.onlineUsers.length;x++)
                // {
                //   if($scope.onlineUsers[x].userid==user.userid)
                //         $scope.onlineUsers[x].messages.push({text:user.text,author:$rootScope.user.username});

                // console.log($scope.onlineUsers);
                // }
                console.log(user);
                // var message = {
                //     socketid: user.socketid,
                //     text: user.text,
                //     userid: user.userid,
                //     senderid: $rootScope.user._id,
                //     sendername: $rootScope.user.username
                // };
                // if (user.userid != 0)
                //     MeanSocket.emit('pusherchatforadmin:sendmessage', message);


                // if (user.userid == 0)

                //     MeanSocket.emit('sendtoguest', {
                //     message: user.text,
                //     socketid: user.socketid,
                //     senderid: $rootScope.user._id,
                //     sendername: $rootScope.user.username
                // });

                user.text = "";
            }

        }

        MeanSocket.on("pusherchatforadmin:sendingmessage", function(message) {
            console.log($scope.activeuser.name);
            console.log(message.sendername);

            for (var x = 0; x < $scope.onlineUsers.length; x++) {
                // if ($scope.onlineUsers[x].userid == message.senderid)
                //     $scope.onlineUsers[x].messages.push({
                //         text: message.text,
                //         author: message.sendername
                //     });
                // if ($scope.onlineUsers[x].userid == message.userid)
                //     $scope.onlineUsers[x].messages.push({
                //         text: message.text,
                //         author: message.sendername
                //     });
                if ($scope.onlineUsers[x].socketid[0] == message.socketid[0]) {
                    $scope.onlineUsers[x].messages.push({
                        text: message.text,
                        author: message.sendername,
                        created_on:Date.now()

                    });

                    //[ {},{} ,{} ,{}]
                   

                    if (message.socketid[0] !== $scope.activeuser.socketid[0] && $scope.activeuser.socketid[0] != undefined && message.sendername != $scope.user.username) {
                        $scope.onlineUsers[x].unreadmessages++;
                    }
                    $timeout(function() {
          var scrollTo_int = $('.conversation-inner').prop('scrollHeight')+ 'px';
                 
                       var outerHeight=w.height() - $('.conversation-new-message').outerHeight() - $('.navbar').outerHeight()-90;
                       $('.conversation-inner').slimScroll({
                scrollTo : scrollTo_int,
                height: outerHeight+ 'px',
                  start: 'bottom',
                  allowPageScroll:true 
            });
    }, 100);
                  

                   
                }

                // for(var sss=0;sss<$scope.onlineUsers[x].socketid.length;sss++)
                //     if($scope.onlineUsers[x].socketid[sss]==message.socketid[0])
                //        $scope.onlineUsers[x].messages.push({text:message.text,author:message.sendername});

            }
              

          
        });

        w.bind('resize', function() {
            var scrollTo_int = $('.conversation-inner').prop('scrollHeight')+ 'px';
                   
            var outerHeight=w.height() - $('.conversation-new-message').outerHeight() - $('.navbar').outerHeight()-90;
            if(outerHeight<340)
                outerHeight=340;
          
            $('.conversation-inner').slimScroll({
                height: outerHeight + 'px',
                allowPageScroll:true,
                 scrollTo : scrollTo_int,
                 start:'bottom'
                
            });
        });
        $scope.activeuserfn = function(activeuser) {
              var scrollTo_int = $('.conversation-inner').prop('scrollHeight')+ 'px';
           
             var outerHeight=w.height() - $('.conversation-new-message').outerHeight() - $('.navbar').outerHeight()-90;
            
            if(outerHeight<340)
                outerHeight=340;
                       activeuser.unreadmessages = 0;
            $scope.activeuser = activeuser;
            $('.conversation-inner').slimScroll({
                height: outerHeight + 'px',
                allowPageScroll:true
                // ,
                //   scrollTo : scrollTo_int,
                //  start:'bottom'
            });
             $timeout(function() {
          var scrollTo_int = $('.conversation-inner').prop('scrollHeight')+ 'px';
                 
                       var outerHeight=w.height() - $('.conversation-new-message').outerHeight() - $('.navbar').outerHeight()-90;
                       $('.conversation-inner').slimScroll({
                scrollTo : scrollTo_int,
                height: outerHeight+ 'px',
                  start: 'bottom',
                  allowPageScroll:true 
            });          
    }, 200);
        }
        MeanSocket.on('SendingToAdmin:listOfGuests',function(listOfGuests){
    
            console.log(listOfGuests);
            $scope.onlineUsers = listOfGuests;
            var fetchMessages=[];
            for(var s=0,h=listOfGuests.length;s<h;s++)
                fetchMessages.push(listOfGuests[s].cookie);
if(fetchMessages.length!=0)
          $http.post('/api/guestUser/fetchmessages',fetchMessages).success(function(res){
console.log(res);
for(var x=0,xx=res.length;x<xx;x++)
      for(var t=0,tt=$scope.onlineUsers.length;t<tt;t++)
           if(res[x].cookie==$scope.onlineUsers[t].cookie)
               $scope.onlineUsers[t].messages=res[x].messages;
                  

          });


        });

        // MeanSocket.on('listOfUsersAndSupport', function(populatechatbox) {

            
        //     var support = angular.copy(populatechatbox);
            

        //     for (var gg = 0; gg < support.length; gg++)
        //         if (support[gg].userid == $rootScope.user._id)
        //             support.splice(support.indexOf(support[gg]), 1);
        //         console.log(populatechatbox);
        //     for (var gg = 0; gg < support.length; gg++) {
               


                
        //         $scope.onlineUsers.push(support[gg]);

        //         $scope.onlineUsers[$scope.onlineUsers.length - 1].text = "";
        //         $scope.onlineUsers[$scope.onlineUsers.length - 1].messages = [];
        //         $scope.onlineUsers[$scope.onlineUsers.length - 1].unreadmessages = 0;
        //         $scope.onlineUsers[$scope.onlineUsers.length - 1].typing = false;
        //         $scope.onlineUsers[$scope.onlineUsers.length - 1].focus = false;
        //          $scope.onlineUsers[$scope.onlineUsers.length - 1].updated=0;

        //         $scope.count++;
        //     }
        //     $('.testcase').slimScroll({
        //         height: '340px',
        //         allowPageScroll:true
        //     });
        //     // memberUpdate(support);

        // });
 
  
  
       
        $scope.initFunction = function() {


            $http.get('/api/users/me').success(function(res) {
                $scope.user = res;
              //  $rootScope.user = res;
                if (isAssistant() || isSalesRep)
                   {console.log("SALES");
                    MeanSocket.emit("adminRequires:fetchListOfGuests");}
                if(isSalesRep())
                    $scope.SalesRep=true;
            });
        }
             var isSalesRep = function()
        {

                if ($rootScope.user.roles.indexOf('SalesRep') !== -1)
                return true;
            else
                return false;
        }
        var isAssistant = function() {
            if ($rootScope.user.roles.indexOf('Assistant') !== -1 || $rootScope.user.roles.indexOf('Admin') !== -1)
                return true;
            else
                return false;
        }


        // function memberUpdate(){    
        //            $.getJSON(settings.friendsList, function(data) {                   
        //                var offlineUser = onlineUser ='' ;
        //                var chatBoxOnline ;
        //                $.each(data, function(user_id, val) {
        //                    if (user_id!=presenceChannel.members.me.id) {          
        //                        user = presenceChannel.members.get(user_id);
        //                        if (user ){
        //                            onlineUser +='<a href="#'+user_id+'" class="on"><img src="'+val[1]+'"/> <span>'+val[0]+'</span></a>';
        //                            chatBoxOnline ='on';
        //                        }else {
        //                            offlineUser +='<a href="#'+user_id+'" class="off"><img src="'+val[1]+'"/> <span>'+val[0]+'</span></a>'; 
        //                            chatBoxOnline ='off';
        //                        }              
        //                    }
        //                    $('#id_'+user_id).removeClass('off').removeClass('on').addClass(chatBoxOnline);
        //                });
        //                $('#pusherChat #members-list').append(onlineUser+offlineUser);    
        //            });

        //            $('#pusherChat #members-list').html('');   
        //            if(presenceChannel.members.count>0){
        //                $("#count").html(presenceChannel.members.count - 1);
        //            }
        //        }



        // var memberUpdate = function(populatechatbox) {
        //     var onlineUser = "";
        //     var chatBoxOnline;

        //     $scope.totalOnlineUsers = $scope.totalOnlineUsers + populatechatbox.users.length;
        //     for (var x = 0, h = populatechatbox.users.length; x < h; x++) {
        //         onlineUser += '<a data-ng-click="openChatBox(populatechatbox.users[x])" class="on"><img src=""/> <span>' + populatechatbox.users[x].name + '</span></a>';
        //         chatBoxOnline = 'on';
        //         $('#id_' + populatechatbox.users[x].socketid).removeClass('off').removeClass('on').addClass(chatBoxOnline);
        //     }

        //     $('#pusherChat #members-list').append(onlineUser);
        //     //$('#pusherChat #members-list').html('');  

        //     if (totalOnlineUsers > 0) {
        //         $("#count").html(totalOnlineUsers);
        //     }


        // }
        $scope.change = function(user) {
            for (var x = 0; x < $scope.activechats.length; x++)
                if ($scope.activechats[x] === user)
                    $scope.activechats[x].closeexpand = !$scope.activechats[x].closeexpand;

        }




    }
]);