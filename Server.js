var WebSocketServer = require("ws").Server;
var wsServer = new WebSocketServer({port:3030});

// Flickr API key 
var Flickr = require("flickrapi"),flickrOptions =
    {
      api_key: "1dd17731b1a8d1ce6d6887250139a54c",
      secret: "f55293c0005018e2"
    };

 
wsServer.on("connection", function (ws) 
{
    console.log("Connection established!");

    ws.on("message", function (msg) 
    {

        console.log("Received:", msg);
        
        Flickr.tokenOnly(flickrOptions, function(err, flickr) 
        {
         if (err) return  console.log(err);
            console.log("You are conected to flickr API");
            
          // Search photos on flickr API by text 
          flickr.photos.search({
                api_key: "1dd17731b1a8d1ce6d6887250139a54c",
                text: msg      }, function(err, result) 
                               {
              if(err)
              { 
                  console.log(err);
              }
              
              var photos = result.photos.photo;
              var arrUrl = [];
              
              for(var i = 0; i < photos.length; i++)
              {
                  
                  photo = photos[i];       
                  
                  //Create URL of photo from result
                  var url = 
                      `https://farm${photo.farm}.staticflickr.com/${photo.server}/${photo.  id}_${photo.secret}.jpg`;
                  arrUrl.push(url);
              }
              
              //Send Json(Array of URL) to Client
              ws.send(JSON.stringify(arrUrl));
                                });

        });
                
     });
});