'use strict';

/**
 * Module dependencies.
 */
var mongoose  = require('mongoose'),
    Schema    = mongoose.Schema,
       _   = require('lodash');




var EmailSchema = new Schema({
  
  email:{type:String}
  

});
mongoose.model('Email', EmailSchema);