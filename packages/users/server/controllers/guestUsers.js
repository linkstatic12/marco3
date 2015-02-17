'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
 Message = mongoose.model('Message'),
 config = require('meanio').loadConfig(),
 nodemailer = require('nodemailer'),
 mysql = require('mysql');
 var get_ip = require('ipware')().get_ip;
exports.fetchMessages = function(req,res)
{


 Message.find({
    'cookie': { $in: 
        req.body
    }
}, function(err, docs){
 
       res.jsonp(docs);

    });
 



}


  exports.saveGuestUser = function(req,res)
  {
 var sendingdata;
  var jobId="none";
    var ip_info = get_ip(req);
    
    var sendback=true;
    if(req.body.jobId!="none")
    jobId=req.body.jobId;
    var cookie2=req.body.cookie;
    console.log(cookie2);
    var ind=cookie2.indexOf(';');
    cookie2=cookie2.substring(ind+2,cookie2.length);
      ind=cookie2.indexOf('=');
      cookie2=cookie2.substring(ind+1,cookie2.length);
     
     Message
    .findOne({'cookie':cookie2 })
    .exec(function(err,data){
     
    
                if(data!=null)
                      {
                        sendingdata=data;
                        res.jsonp(sendingdata);
                      }
                      else
                      { var GuestUser = new Message({ip:ip_info.clientIp,jobId:jobId,cookie:cookie2});
                        GuestUser.save(function(err){
                                        res.jsonp(GuestUser);
                                                    });}
      
});
  



  };

