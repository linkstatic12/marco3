
exports.findAndEliminateGuest = function(socketid,guestUserWatchList)
{

	var kickFromPool=-1;
	for(var x=0,h=guestUserWatchList.length;x<h;x++)
		  for(yy=0,y=guestUserWatchList[x].socketid.length;yy<y;yy++)
    	  {
    	  	if(guestUserWatchList[x].socketid[yy]==socketid)
    	  		 kickFromPool = x; 
    	  		
    	  }
 
       	return kickFromPool;
}


