'use strict';

/**
 * Module dependencies.
 */
var mongoose  = require('mongoose'),
    Schema    = mongoose.Schema,
       _   = require('lodash');




var GuestUserSchema = new Schema({
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
      message: {
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
    ]

});
mongoose.model('GuestUser', GuestUserSchema);