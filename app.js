var spotifyApi = new SpotifyWebApi();


const clientId = 'e95a863a8a7f4244b9e7981c519014aa';
const clientSecret = 'a96759e036bd4659908aeaa9fe454234';


// Get a token
const getToken = async () => {

  const result = await fetch('https://accounts.spotify.com/api/token', {
      method: 'POST',
      headers: {
          'Content-Type' : 'application/x-www-form-urlencoded', 
          'Authorization' : 'Basic ' + btoa(clientId + ':' + clientSecret)
      },
      body: 'grant_type=client_credentials'
  });

  const data = await result.json();
  console.log(data.access_token)
  spotifyApi.setAccessToken(data.access_token);
  return data.access_token;
}
getToken();




// This data is a duplicate dataset used to check that we don't make nodes that already exist
let nodebase = {
  "nodes": [
    {"id": "Bon Iver", "genre": "Alternative", "size": 1},
    {"id": "Kanye West", "genre": "Rap", "size": 1},
    {"id": "James Blake", "genre": "Electronic", "size": 1}
  ],
  "links": [
    {"source": "Bon Iver", "target": "Kanye West"},
    {"source": "Bon Iver", "target": "James Blake"}
  ]
};




// https://github.com/vasturiano/force-graph/blob/master/example/dynamic/index.html

var artistSearchResultName;
var artistSearchResultGenre;

// Search and return a single artist, with artist info
// function returnArtist(searchArtist){
//   spotifyApi.getGeneric('https://api.spotify.com/v1/search?q=artist:' + searchArtist + '&type=artist&limit=1').then(
//     function (data) {
//       //console.log(searchArtist);
//       artistSearchResultName = data.artists.items[0].name;
//       artistSearchResultGenre = data.artists.items[0].genres[0];
//       //console.log("Artist name is "+artistSearchResultName);
//       console.log(artistSearchResultGenre);
//     })
//}

  
  function addNodes(inArtist, searchArtist){
    const { nodes, links } = Graph.graphData();
      // Check if the artist is already in node list
      const checkUsername = obj => obj.id === inArtist;
      exists = nodebase.nodes.some(checkUsername)

      // If it's not in the list, 
      if (exists == false){
        //get artist genre
        //returnArtist(inArtist);

        //add node to nodelist
        //console.log(inArtist + " not here yet");
        //console.log(artistSearchResultGenre);
        let outNode = {"id": inArtist, "genre": artistSearchResultGenre, "size": 1}
        nodebase.nodes.push(outNode);
        Graph.graphData({
          nodes: [outNode, ...nodes],
          links: [...links],
        });
      } else {
        // console.log(inArtist + " already here");
      }
      
    
  }
  
  function addLinks(inArtist, searchArtist){
    const { nodes, links } = Graph.graphData();
    if (inArtist != searchArtist){
      
      let outLink = {"source": searchArtist, "target": inArtist};

      // Increase the size of each node in the link
      Graph.graphData().nodes.find(x => x.id === inArtist).size +=0.01
      Graph.graphData().nodes.find(x => x.id === searchArtist).size +=0.01
      
      //console.log(result2);
      Graph.graphData({
        nodes: [...nodes],
        links: [...links, outLink]
      });
    }

  }




function searchForArtist(searchArtist){
  // search tracks whose Artist is 'searchArtist'
  /* spotifyApi.getGeneric('https://api.spotify.com/v1/search?q=artist:' + searchArtist + '&type=track&limit=50').then(
    function (data) {
      let output = data;
      // console.log('Artist is ' + searchArtist, output.tracks.items);
      for (let track in output.tracks.items){
        artists = output.tracks.items[track].artists
        // console.log(artists);
        for (let artist in data.tracks.items[track].artists){
          var out = data.tracks.items[track].artists[artist].name;
          // console.log(out);
          addNodes(out, searchArtist);
          addLinks(out, searchArtist);
        }
      }
    },
    function (err) {
      console.error(err);
    }
  ); */

  // Track has the search artist in the title
  spotifyApi.getGeneric('https://api.spotify.com/v1/search?q=track:' + searchArtist + '&type=track&limit=50').then(
    function (data) {
      let output = data;
      console.log(output);
      // console.log('Artist is ' + searchArtist, output.tracks.items);
      for (let track in output.tracks.items){
        // Check first that at least ONE artist is search artist
        var ok = false;
        for (let artist in data.tracks.items[track].artists){
          if (output.tracks.items[track].artists[artist].name == searchArtist){
            ok = true;
          }
        }
        // If the previous test is positive:
        if (ok == true){
          artists = output.tracks.items[track].artists
          //console.log(artists);
          for (let artist in data.tracks.items[track].artists){
            var out = data.tracks.items[track].artists[artist].name;
            // console.log(out);
            addNodes(out, searchArtist);
            addLinks(out, searchArtist);
          }
        }
      }
    },
    function (err) {
      console.error(err);
    }
  );
  Graph.graphData().nodes.sort((a, b) => (a.size > b.size) ? 1 : -1);
}


// console.log('New try below');

// // Get top tracks for Bon Iver
// spotifyApi.getArtistTopTracks('4LEiUm1SRbFMgfqnQTwUbQ', "US").then(
//   function (data) {
//     console.log('Bon Iver Artist ID', data);
//   }
// );











// searchForArtist("James Blake");
// drawGraph();
console.log(nodebase)
