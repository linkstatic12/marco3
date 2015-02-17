'use strict';

angular.module('mean.system').controller('ChatBoxController', ['$scope', '$rootScope', 'Global', 'MeanSocket', '$timeout','$interval','$http','$stateParams','$sce',
  function($scope, $rootScope, Global, MeanSocket,$timeout,$interval,$http,$stateParams,$sce) {
    $scope.marco= "Chat with Marco";
    $scope.user;
    var mongoid="none";
    $scope.dontshowchat=false;
    $scope.lockScrollbar=false;
    $scope.global = Global;
    $scope.superadmin=false;
    $scope.minimized=false;
    $scope.minimizedtyping=false;
    $scope.minimizedmsgrec=false;
    $scope.statusquo="";
    $scope.lastadminmsg;
    $scope.lastadminmsgtime;
    $scope.activeuser={messages:[]};
    console.log("CHAT BOX");
    // $rootScope.$on('guestUser:enteringWithCLId',function(event, toState){
    //  if(toState=='noId')
    //  {console.log("ROOT EMITS");
    //   MeanSocket.emit('guestUser:entering');}
    //   else
    //     MeanSocket.emit('guestUser:enteringWithCLId',toState);
    //   });
    MeanSocket.on('HideTheChat',function(){
      console.log("HIDE ME");
      $scope.dontshowchat=true;
    });

    MeanSocket.on('guestUser:returnData',function(d2){
          
    $http.post('/api/guestUser/sendData',d2).success(function(res){ mongoid= res._id;});
        
    });
    $rootScope.$on('profileChanged',function(event){

      $http.get('/api/users/me').success(function(res){
    $scope.user=res;
  });
    });
    $rootScope.$on('loggedin', function (event) {
 
});

   $rootScope.$on('openchatbox', function (event) {
      $scope.minimize();
});   



  $scope.timout= function()
  {
     MeanSocket.emit("guestUser:RegisteringSocket");
     //$timeout($scope.startmarcochat, 3000);

  }
  $scope.minimize = function()
  {
    $scope.minimized=!$scope.minimized;
    MeanSocket.emit("guestUser:minimize",$scope.minimized);
    if($scope.minimized){
      $scope.minimizedmsgrec = false; 
    }
  }
  $scope.startmarcochat = function()
  {
    $scope.minimized=true;
    $scope.minimizedmsgrec = false;
    MeanSocket.emit("guestUser:minimize",true);
  }
  var inputChangedPromise;
  $scope.inputChanged = function(activeuser)
  {
     if (activeuser.typing != true) {
                MeanSocket.emit("userIsTyping");
                activeuser.typing=true;
            }
            if (inputChangedPromise) {
                $timeout.cancel(inputChangedPromise);
            }
            inputChangedPromise = $timeout(taskToDo, 1000);
  }

  var taskToDo = function() {
      $scope.activeuser.typing = false;
      MeanSocket.emit("userStoppedTyping");

  }
  $scope.enterpressed = function(event)
  {
      if(event.keyCode == 13 && $scope.activeuser.text!="")
    {
      $scope.submittext($scope.activeuser);
      event.preventDefault();
    }
    
  }
  $('#testDiv2').slimScroll().bind('slimscrolling', function(e, pos){
   
    if(pos<($('#testDiv2').prop('scrollHeight')-225))
      {
   $scope.lockScrollbar=false;

 }
    else
    {
      $scope.lockScrollbar=true;
     $scope.statusquo=$scope.lastadminmsgtime;        
    }
    $scope.$apply();
});
$interval(callAtInterval, 30000);
  
 function callAtInterval()
  {if($scope.lastadminmsg){
        var _initial = new Date();
        var finaltime = Math.round( (_initial.getTime() - $scope.lastadminmsg.getTime())/1000);
        if(finaltime > 15 && finaltime < 60){
          if(finaltime == 1){
            $scope.lastadminmsgtime=finaltime + ' second ago';
          }
          else{
            $scope.lastadminmsgtime=finaltime + ' seconds ago';
          }
        }
        else if(finaltime > 60 && finaltime < 900){
            finaltime = Math.round(finaltime/60);
            if(finaltime == 1){
              $scope.lastadminmsgtime=finaltime + ' minute ago';  
            }
            else{
              $scope.lastadminmsgtime=finaltime + ' minutes ago';
            }
        }
        else if(finaltime < 15)
        {
          $scope.lastadminmsgtime = "Just a few seconds ago"; 
        }
        else
        {
          var Finalhours = $scope.lastadminmsg.getHours();
          var finalampm = "am";
          if(Finalhours > 11){
            Finalhours = Finalhours - 12;
            if(Finalhours == 0){
              Finalhours = 12;
            }
            finalampm = "pm";
          }
          else if(Finalhours == 0){
             Finalhours = 12
          }

          $scope.lastadminmsgtime = "Last message received at " + Finalhours +':'+ $scope.lastadminmsg.getMinutes()+' '+finalampm; 
        }
      }
  }
  $scope.submittext = function(activeuser)
  {
      $scope.activeuser.messages.push({author:'guest',text:activeuser.text,senddate:Date.now()});
      MeanSocket.emit('guestUser:sendingMessage',{text:activeuser.text,author:'guest',senddate:Date.now(),mongoid:mongoid});
      $scope.activeuser.text="";
      $timeout(function() {
          var scrollTo_int = $('#testDiv2').prop('scrollHeight')+ 'px';
                       
           $('#testDiv2').slimScroll({
                scrollTo : scrollTo_int,
                height: '225px',
                start: 'bottom',
                allowPageScroll:true 
            });
           $('.chat-inner').linkify();
    }, 100);     
  }
  var RemakeSlimScroll = function()
  {var scrollTo_int = $('#testDiv2').prop('scrollHeight')+ 'px';
       if($scope.lockScrollbar)                 
           $('#testDiv2').slimScroll({
                scrollTo : scrollTo_int,
                height: '225px',
                start: 'bottom',
                allowPageScroll:true 
            });
         if(!$scope.lockScrollbar)
          $('#testDiv2').slimScroll({
                height: '225px'
                
            });}
        MeanSocket.on('guestUser:GuestToGuest',function(message){
         $scope.activeuser.messages.push({author:message.author,text:message.text});
         $timeout(function() {
          RemakeSlimScroll();
             $('.chat-inner').linkify();
         }, 100);


        });
        MeanSocket.on('guestUser:SendMessagesToOtherInstance',function(socketid){
          console.log("OTHEr INSTANCE");

          
          MeanSocket.emit('guestUser:FromguestUserSendingMessages',{messages:$scope.activeuser.messages,socketid:socketid});
        });

        MeanSocket.on('guestUser:SendingMessages',function(messages){
          console.log(messages);
          $scope.activeuser.messages=messages;
          $timeout(function() {
                RemakeSlimScroll();
                $('.chat-inner').linkify();
          }, 100);
        });


  MeanSocket.on('guestUser:messageFromAdmin',function(messgae){
    console.log(messgae);
    if(!$scope.minimized)
      $scope.minimizedmsgrec = true;
    
    else
      $scope.minimizedmsgrec = false; 
    
    $scope.lastadminmsg = new Date(messgae.senddate);
    $scope.lastadminmsgtime = "Just Now";
    if(!$scope.lockScrollbar)
      $scope.statusquo="Scroll down to see message";
    else
      $scope.statusquo=$scope.lastadminmsgtime;
     console.log($scope.activeuser.messages.length);
     if($scope.activeuser.messages.length!=0)
       if($scope.activeuser.messages[$scope.activeuser.messages.length-1].text == "TOROpindi510PST"){
          $scope.activeuser.messages.pop();
       }
       $scope.activeuser.messages.push(messgae);
       $timeout(function() {
          RemakeSlimScroll();
          $('.chat-inner').linkify();
    }, 100);

  });
  MeanSocket.on('guestUser:adminIsTyping',function(){
       if(!$scope.minimized){
          $scope.minimizedtyping = true;
       }
       else
       {
          $scope.minimizedtyping = false;
       }
       var admintyping = {author:"admin",text:"TOROpindi510PST"};
       $scope.activeuser.messages.push(admintyping);
       $timeout(function() {
           RemakeSlimScroll();
    }, 100);
  });
  MeanSocket.on('guestUser:adminStoppedTyping',function(){
       $scope.minimizedtyping = false;
       if($scope.activeuser.messages[$scope.activeuser.messages.length-1].text == "TOROpindi510PST"){
          $scope.activeuser.messages.pop();
       }
  });
  MeanSocket.on('guestUser:minimizebros',function(flag){
        console.log("minimizebros");
        $scope.minimized=flag;
        if($scope.minimized){
          $scope.minimizedmsgrec = false; 
        }
  });
  MeanSocket.on('guestUser:tellmestatebro',function(socketid){
        console.log("tellmestatebro");
        var newbrostate= {socketid:socketid,state:$scope.minimized};
        MeanSocket.emit("guestUser:newbrostatechange",newbrostate);
  });     
  }
]);
