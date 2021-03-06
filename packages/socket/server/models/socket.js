'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Message Schema
 */

var MessageSchema = new Schema({
  ip:
    { 
   type: String,
   default: "Unreachable"
    },
  jobId:
    {
    type: String,
  default: "None"
    },
  cookie: 
    {
    type: String
    },
    profile:{},
  messages:
    [{
      author:{
            type: String
            },
      text: {
            type: String  
            },
      senddate: {
            type:Date  
            }
    }
    ],
    extra_fields:
    [{
    name:{
          type:String
         }
       }
    ],
    profile_messages
    :
    {
      firstname:{
      type:String
       },
      lastname:{
      type:String
      },
      email:{
      type:String
      },
      phone:{
        type:String
      }

     }
});

mongoose.model('Message', MessageSchema);