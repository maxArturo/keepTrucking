/* global d3 */

var width = 900, 
  height = 500;


var svg = d3.select("body").append("svg")
  .attr("width", width)
  .attr("height", height);

var color = d3.scale.category20b();

var force = d3.layout.force()
    .charge(-120)
    .linkDistance(30)
    .size([width, height]);

//first iteration
d3.json("graph.json",function(error, json){
  

  force.nodes(data.nodes)
  .links(data.links)
  force.start();

  var link = svg.selectAll(".link")
    .data(data.links)
    .enter().append("line")
    .attr("class", "link")
    .style("stroke-width", function(d){return Math.sqrt(yearDistance(d)); });

  var gnodes = svg.selectAll("g.gnode")
    .data(data.nodes).enter()
    .append("g")
    .attr("class", "gnode");

  var node = gnodes.append("circle")
    .attr("class", "node")
    .attr("r", 5)
    .style("fill", function(d){return color(d.year);})
    .call(force.drag);

  gnodes.append("text")
    .attr("x", 14)
    .attr("y", ".31em")
    .text(function(d){return d.Title;});

  force.on("tick", function() {
    link.attr("x1", function(d) { return d.source.x; })
        .attr("y1", function(d) { return d.source.y; })
        .attr("x2", function(d) { return d.target.x; })
        .attr("y2", function(d) { return d.target.y; });

    gnodes.attr("transform", function(d){
        return "translate(" + [d.x, d.y] + ")";
      });
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
  // return (link.source.year - link.target.year) * 2;
  return link.value * 2;
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

var data = {
    "nodes": [{
        "Title": "Star Wars: Episode IV - A New Hope",
        "year": "1977",
        "Type": "movie"
    }, {
        "Title": "Gangs of New York",
        "year": "2002",
        "Type": "movie"
    }, {
        "Title": "The Twilight Saga: New Moon",
        "year": "2009",
        "Type": "movie"
    }, {
        "Title": "Home Alone 2: Lost in New York",
        "year": "1992",
        "Type": "movie"
    }, {
        "Title": "New Girl",
        "year": "2011–",
        "Type": "series"
    }, {
        "Title": "Orange Is the New Black",
        "year": "2013–",
        "Type": "series"
    }, {
        "Title": "The Emperor's New Groove",
        "year": "2000",
        "Type": "movie"
    }, {
        "Title": "Escape from New York",
        "year": "1981",
        "Type": "movie"
    }, {
        "Title": "The New World",
        "year": "2005",
        "Type": "movie"
    }, {
        "Title": "Bad Lieutenant: Port of Call New Orleans",
        "year": "2009",
        "Type": "movie"
    }],
    "links": [{
        "source": 1,
        "target": 0,
        "value": 1
    }, {
        "source": 2,
        "target": 0,
        "value": 8
    }, {
        "source": 3,
        "target": 0,
        "value": 10
    }, {
        "source": 3,
        "target": 2,
        "value": 6
    }, {
        "source": 4,
        "target": 0,
        "value": 1
    }, {
        "source": 5,
        "target": 0,
        "value": 1
    }, {
        "source": 6,
        "target": 0,
        "value": 1
    }, {
        "source": 7,
        "target": 0,
        "value": 1
    }, ]
};