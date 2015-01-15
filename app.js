/* global d3 */

var width = 900, 
  height = 500;

var nodes = [],
  links = [];

  //remove
  var data;

var svg = d3.select("body").append("svg")
  .attr("width", width)
  .attr("height", height);

var color = d3.scale.category20b();

var force = d3.layout.force()
  .gravity(.03)
  //.distance(100)
  .charge(-100)
  .linkDistance(yearDistance)
  .size([width, height]);

//first iteration
d3.json("http://www.omdbapi.com/?s=new",function(error, json){
  data = coerce(json);
  nodes = data;
  links = generateLinks(nodes);

  force.nodes = nodes;
  force.links = links;
  force.start();

  var link = svg.selectAll(".link")
    .data(links)
    .enter().append("line")
    .attr("class", "link")
    .style("stroke-width", function(d){return Math.sqrt(yearDistance(d)); });

  var node = svg.selectAll(".node")
    .data(nodes)
    .enter().append("circle")
    .attr("class", "node")
    .attr("r", 5)
    .style("fill", function(d){return color(d.year);})
    .call(force.drag);

  node.append("text")
    .attr("x", 14)
    .attr("y", ".31em")
    .text(function(d){return d.Title;});

  force.on("tick", function() {
    link.attr("x1", function(d) { return d.source.x; })
        .attr("y1", function(d) { return d.source.y; })
        .attr("x2", function(d) { return d.target.x; })
        .attr("y2", function(d) { return d.target.y; });

      node.attr("cx", function(d) { return d.x; })
          .attr("cy", function(d) { return d.y; });
  });

});

//format into node-link relationship
function coerce (movieData) {
  movieData.Search.forEach(function(d){
    d.year = +d.Year;
    delete d['Year'];
    delete d['imdbID'];
  });
  return movieData.Search;
}

//potential for separating nodes by year - nodes closer together
//will relate to closer years.
//linkDistance gets a link and a 'this' reference to the force layout

function yearDistance(link){
  return (link.source.year - link.target.year) * 2;
}

function generateLinks(movieData){
  generatedLinks = [];
  movieData.forEach(function(d){
    otherNodes = movieData.filter(function(g){
      return g.Title != d.Title;
    });
    otherNodes.forEach(function(g){
      generatedLinks.push({
        "source": d,
        "target": g,
      });  
    })
  });
  return generatedLinks;
}