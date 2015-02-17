'use strict';

/**
 * Module dependencies.
 */
var mongoose  = require('mongoose'),
    Schema    = mongoose.Schema,
     _   = require('lodash'),
    searchPlugin = require('mongoose-search-plugin');




var QuestionAnswerSchema = new Schema({
  Question: {type:String,default:"Difference between POST and PUT is what?"},
  Answer:{type:String,default:"One can change the URI one cant. PUT is logically a file replacement"},
  rating:{type:Number,default:0}

});
QuestionAnswerSchema.plugin(searchPlugin, {
    fields: ['Question', 'Answer']
  });


mongoose.model('QuestionAnswer', QuestionAnswerSchema);