'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
QandA = mongoose.model('QuestionAnswer'),
searchPlugin = require('mongoose-search-plugin');


Array.prototype.asyncEach = function(iterator) {
    var list = this,
        n = list.length,
        i = -1,
        calls = 0,
        looping = false;

    var iterate = function() {
        calls -= 1;
        i += 1;
        if (i === n) return;
        iterator(list[i], resume);
    };

    var loop = function() {
        if (looping) return;
        looping = true;
        while (calls > 0) iterate();
        looping = false;
    };

    var resume = function() {
        calls += 1;
        if (typeof setTimeout === 'undefined') loop();
        else setTimeout(iterate, 1);
    };
    resume();
};
exports.addQandA = function(req,res)
{
	var s=new QandA();
	s.Question=req.body.question;
	s.Answer=req.body.answer;
	s.save(function(err,done){if(!err){res.jsonp("saved");}});
}
exports.rateitup = function(req,res)
{

console.log("rateitup");
console.log(req.body);
QandA.findOne({Question:req.body.question},function(err,qanda){qanda.rating++;qanda.save(function(err,save){if(!err)res.jsonp("saved");});});
}
exports.tryme = function(req,res)
{

// console.log(req.body.query);
// var splitmeup=req.body.query;
// splitmeup=splitmeup.split(" ");
//console.log(splitmeup);
var start = +new Date();

var data={};
var counter=0;
// if(splitmeup.length>1)
// {
  
     
//     splitmeup.asyncEach(function(smp, resume) {  
       
//           counter++;
//  QandA.search(smp, {
//       Question:1,
//       Answer:1
            
//         }, function(err, output) {
//             console.log("FROM PREVIOUS CYCLE");
//                data=output;
          
//             if (err) 
//                 return handleError(err);
//             else 
//             {
//                 var end = +new Date();
              
//             }
                
            

//         }
//         );
//  if(counter==splitmeup.length)
//  console.log(smp);


// resume();

//   });


// }
//else

 QandA.search(req.body.query, {
 	  Question:1,
 	  Answer:1,
      rating:1
            
        },{sort: {rating:-1}}, function(err, output) {
            console.log(output);
            if (err) return handleError(err);
            else {
            	var end = +new Date();
                 
                 
            	res.jsonp({output:output,timetaken:(end-start) + " milliseconds"});
            }

        }
        );
};


