var spotifyApi = new SpotifyWebApi();


const clientId = 'e95a863a8a7f4244b9e7981c519014aa';
const clientSecret = 'a96759e036bd4659908aeaa9fe454234';

// Get a token here 
// https://getyourspotifyrefreshtoken.herokuapp.com/


spotifyApi.setAccessToken("BQC7D1ag-6RHqzGI4TncvfkLqvvt8GYbUqkxAQVoLKd376qImwWiSnMWc37AdQB-cjmuThBtLj-4vdIkckujOfCuk82BF88PoCuAp6g92mvkoMAQk92fkw3BoEI61D5JVC7c2sZb-vDn9zU");


// Data that gets passed to the node graph. Add to this.
let nodebase = {
  "nodes": [
    {"id": "Bon Iver"},
    {"id": "Kanye West"},
    {"id": "James Blake"}
  ],
  "links": [
    {"source": "Bon Iver", "target": "Kanye West"},
    {"source": "Bon Iver", "target": "James Blake"}
  ]
};




// THE PROBLEM IS THAT I'm sending empty nodes to the database
// Probably smart to break up the sending of nodes and links again so I don't send empty nodes
// https://github.com/vasturiano/force-graph/blob/master/example/dynamic/index.html



  
  function addNodes(inArtist, searchArtist){
    const { nodes, links } = Graph.graphData();
      // Check if the artist is already in node list
      const checkUsername = obj => obj.id === inArtist;
      exists = nodebase.nodes.some(checkUsername)

      // If it's not in the list, add node to nodelist
      if (exists == false){
        console.log(inArtist + " not here yet");
        let outNode = {"id": inArtist, "group": 1}
        nodebase.nodes.push(outNode);
        Graph.graphData({
          nodes: [...nodes, outNode],
          links: [...links]
        });
      } else {
        console.log(inArtist + " already here");
      }
    
  }
  
  function addLinks(inArtist, searchArtist){
    const { nodes, links } = Graph.graphData();
    if (inArtist != searchArtist){
      let outLink = {"source": searchArtist, "target": inArtist};
      //console.log(outLink);
      Graph.graphData({
        nodes: [...nodes],
        links: [...links, outLink]
      });
    }

  }


// search tracks whose contains 'feat searchArtist'



// search tracks whose Artist 'searchArtist'
function searchForArtist(searchArtist){
  spotifyApi.getGeneric('https://api.spotify.com/v1/search?q=artist:' + searchArtist + '&type=track&limit=50').then(
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
  );

  spotifyApi.getGeneric('https://api.spotify.com/v1/search?q=track:feat ' + searchArtist + '&type=track&limit=50').then(
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
  );
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
// console.log(nodebase)