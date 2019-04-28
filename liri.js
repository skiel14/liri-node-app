require("dotenv").config();
var keys = require("./keys.js");
var Spotify = require('node-spotify-api');
var spotify = new Spotify(keys.spotify);
var request = require("request");
var fs = require("fs");

var cmd = process.argv[2];
var quest = process.argv[3];

if(cmd=="concert-this") {
  var url="https://rest.bandsintown.com/artists/"+quest+"/events?app_id=codingbootcamp";

  request(url, function(error, response, body) {
    if(!error && response.statusCode === 200) {
      var concertInfo = JSON.parse(body);
      var dateTime = ""+concertInfo[0].datetime+"";
      var date = ""+dateTime.substring(5, 7)+"/"+dateTime.substring(8, 10)+"/"+dateTime.substring(0, 4);

      console.log("Concert Venue: "+concertInfo[0].venue.name);
      console.log("Venue Location: "+concertInfo[0].venue.city+", "+concertInfo[0].venue.country);
      console.log("Concert Date: "+date);
      console.log();
    }
  });
} else if(cmd=="spotify-this-song") {

  function getArtists(artist) {
    return artist.name;
  }

  if(quest===undefined) {
    quest="The Sign";
  }

  spotify.search(
    {
      type: "track",
      query: quest
    },
    function(err, data) {
      if(err) {
        console.log("Error occurred: "+err);
        return;
      }
      var songs = data.tracks.items;
      for(var i=0; i<songs.length; i++) {
        console.log("Result "+i+": ");
        console.log("Artist(s): "+songs[i].artists.map(getArtists));
        console.log("Song title: "+songs[i].name);
        console.log("Preview song here: "+songs[i].preview_url);
        console.log("Album title: "+songs[i].album.name);
        console.log();
      }
    }
  );
} else if(cmd=="movie-this") {
  if(quest===undefined) {
    quest="Mr. Nobody";
  }

  var url="http://www.omdbapi.com/?t="+quest+"&y=&plot=full&tomatoes=true&apikey=trilogy";
  request(url, function(error, response, body) {
    if(!error && response.statusCode === 200) {
      var movieInfo = JSON.parse(body);

      console.log("Title: "+movieInfo.Title);
      console.log("Year: "+movieInfo.Year);
      console.log("Rated: "+movieInfo.Rated);
      console.log("IMDB Rating: "+movieInfo.imdbRating);
      console.log("Rotton Tomatoes Rating: "+movieInfo.Ratings[1].Value);
      console.log("Country Produced In: "+movieInfo.Country);
      console.log("Language: "+movieInfo.Language);
      console.log("Plot: "+movieInfo.Plot);
      console.log("Actors: "+movieInfo.Actors);
    }
  });
} else if(cmd=="do-what-it-says") {
  fs.readFile("random.txt", "utf8", function(error, data) {
    var data = data.split(",");

    if(data[0]=="concert-this") {
      var url="https://rest.bandsintown.com/artists/"+data[1]+"/events?app_id=codingbootcamp";

      request(url, function(error, response, body) {
        if(!error && response.statusCode === 200) {
          var concertInfo = JSON.parse(body);
          var dateTime = ""+concertInfo[0].datetime+"";
          var date = ""+dateTime.substring(5, 7)+"/"+dateTime.substring(8, 10)+"/"+dateTime.substring(0, 4);

          console.log("Concert Venue: "+concertInfo[0].venue.name);
          console.log("Venue Location: "+concertInfo[0].venue.city+", "+concertInfo[0].venue.country);
          console.log("Concert Date: "+date);
          console.log();
        }
      });
    } else if(data[0]=="spotify-this-song") {

      function getArtists(artist) {
        return artist.name;
      }

      if(data[1]===undefined) {
        data[1]="The Sign";
      }

      spotify.search(
        {
          type: "track",
          query: data[1]
        },
        function(err, data) {
          if(err) {
            console.log("Error occurred: "+err);
            return;
          }
          var songs = data.tracks.items;
          for(var i=0; i<songs.length; i++) {
            console.log(i);
            console.log("Artist(s): "+songs[i].artists.map(getArtists));
            console.log("Song title: "+songs[i].name);
            console.log("Preview song here: "+songs[i].preview_url);
            console.log("Album title: "+songs[i].album.name);
            console.log();
          }
        }
      );
    } else if(data[0]=="movie-this") {
      if(data[1]===undefined) {
        data[1]="Mr. Nobody";
      }

      var url="http://www.omdbapi.com/?t="+data[1]+"&y=&plot=full&tomatoes=true&apikey=trilogy";
      request(url, function(error, response, body) {
        if(!error && response.statusCode === 200) {
          var movieInfo = JSON.parse(body);

          console.log("Title: "+movieInfo.Title);
          console.log("Year: "+movieInfo.Year);
          console.log("Rated: "+movieInfo.Rated);
          console.log("IMDB Rating: "+movieInfo.imdbRating);
          console.log("Rotton Tomatoes Rating: "+movieInfo.Ratings[1].Value);
          console.log("Country Produced In: "+movieInfo.Country);
          console.log("Language: "+movieInfo.Language);
          console.log("Plot: "+movieInfo.Plot);
          console.log("Actors: "+movieInfo.Actors);
        }
      });
    }
  });
} else{
  console.log("Not a valid command. Retry one of these:");
  console.log("concert-this");
  console.log("spotify-this-song");
  console.log("movie-this");
  console.log("do-what-it-says");
}
