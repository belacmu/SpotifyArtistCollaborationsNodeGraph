const initData = {
    nodes: [
        {"id": "Bon Iver", "genre": "Alternative", "size": 1},
        {"id": "Kanye West", "genre": "Rap", "size": 1},
        {"id": "Rihanna", "genre": "", "size": 1},
        {"id": "Coldplay", "genre": "", "size": 1},
        {"id": "Swedish House Mafia", "genre": "", "size": 1},
        {"id": "James Blake", "genre": "Electronic", "size": 1}
    ],
    links: [
        {"source": "Bon Iver", "target": "Kanye West"},
        {"source": "Rihanna", "target": "Kanye West"},
        {"source": "Rihanna", "target": "Coldplay"},
        {"source": "Swedish House Mafia", "target": "Coldplay"},
        {"source": "Bon Iver", "target": "James Blake"}
    ]
  };


  let hoverLink = null;
  let hoverNode = null;
  const highlightNodes = new Set();
  const highlightLinks = new Set();
  const dimmedNodes = new Set();

  // cross-link node objects

  const Graph = ForceGraph()
  const elem = document.getElementById('graph');
  
  const graph = Graph(elem)
    .graphData(initData)
    .nodeId('id')
    .nodeAutoColorBy('id')
    .height((window.innerHeight*0.65))
    .width((window.innerWidth - 24))
    // .backgroundColor('gray')	


    //Node Click
    .onNodeClick(node => {
      searchForArtist(node.id);
    })

    // Node hover
    .onNodeHover(node => {
      hoverNode = node;

      elem.style.cursor = node ? 'pointer' : null;
      highlightNodes.clear();
      highlightLinks.clear();
      dimmedNodes.clear(); 
      if (node) {
        console.log(hoverNode);
        Graph.graphData().links.forEach(link => {
          if (link.source == hoverNode){
            highlightNodes.add(link.target);
          }else{
            dimmedNodes.add(link.target);
          }
          if (link.target == hoverNode){
            highlightNodes.add(link.source);
          }else{
            dimmedNodes.add(link.source);
          }
        });
          
      } 
    })
    /* .onLinkHover(link => {
      hoverLink = link;
      highlightNodes.clear();
      highlightLinks.clear();
      dimmedNodes.clear();
      if (link){
        highlightNodes.add(link.target);
        highlightNodes.add(link.source);
        Graph.graphData().nodes.forEach(node => {
          dimmedNodes.add(node);
        });
        dimmedNodes.delete(link.target);
        dimmedNodes.delete(link.source);
      }
    }) */
    
    .autoPauseRedraw(false)


    .nodeCanvasObject((node, ctx, globalScale) => {
      const hovered = node === hoverNode;
      const highlight = highlightNodes.has(node);
      const dimmed = dimmedNodes.has(node);
      
      const label = node.id;
      const fontSize = node.size*12/globalScale;
      ctx.font = `${fontSize}px Sans-Serif`;
      const textWidth = ctx.measureText(label).width;
      const bckgDimensions = [textWidth, fontSize].map(n => n + fontSize * 0.2); // some padding

      ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
      ctx.fillRect(node.x - bckgDimensions[0] / 2, node.y - bckgDimensions[1] / 2, ...bckgDimensions);

      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';

      ctx.fillStyle = hovered ? 'crimson'
        : highlight ? 'black'
        : dimmed ? ('rgba(0, 0, 0, 0.2)')
        : node.color;
      ctx.fillText(label, node.x, node.y);
      

      node.__bckgDimensions = bckgDimensions; // to re-use in nodePointerAreaPaint
      
    })

    .nodePointerAreaPaint((node, color, ctx) => {
        ctx.fillStyle = color;
        const bckgDimensions = node.__bckgDimensions;
        bckgDimensions && ctx.fillRect(node.x - bckgDimensions[0] / 2, node.y - bckgDimensions[1] / 2, ...bckgDimensions);
      })
    ;
      
    // Window resize stuff
    elementResizeDetectorMaker().listenTo(
      document.getElementById('graph'),
      el => Graph.width(el.offsetWidth)
    );




document.getElementById('btn1').addEventListener('click', function() {
    var search = document.getElementById("textInput").value;
    console.log(search);
    searchForArtist(search);
    });
    document.getElementById('textInput').addEventListener('keydown', function (event) {
        if (event.key === 'Enter' || event.keyCode === 13) {
            var search = document.getElementById("textInput").value;
            console.log(search);
            searchForArtist(search);
        }
    });