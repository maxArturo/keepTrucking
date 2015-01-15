/* global d3 */

var width = 900, 
  height = 500;

var result;

var svg = d3.select("body").append("svg")
  .attr("width", width)
  .attr("height", height);

var color = d3.scale.category20b();

var force = d3.layout.force()
    .charge(-180)
    .linkDistance(function(d){return d.value;})
    .size([width, height]);

//first iteration
d3.json("http://omdbapi.com/?s=computer",function(error, json){
  nodes = coerce(json.Search);
  links = generateLinks($.extend(true, [], nodes));

  force.nodes(nodes)
  .links(links)
  force.start();

  var link = svg.selectAll(".link")
    .data(links)
    .enter().append("line")
    .attr("class", "link")
    .style("stroke-width", function(d){return Math.sqrt(yearDistance(d)); });

  var gnodes = svg.selectAll("g.gnode")
    .data(nodes).enter()
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
    .text(function(d){return "(" + d.year + ") " + d.Title;});

  force.on("tick", function() {
    link.attr("x1", function(d) { 
      return d.source.x; })
        .attr("y1", function(d) { return d.source.y; })
        .attr("x2", function(d) { return d.target.x; })
        .attr("y2", function(d) { return d.target.y; });

    gnodes.attr("transform", function(d){
        return "translate(" + [d.x, d.y] + ")";
      });
  });
});

//format into node-link relationship
function coerce(nodes) {
  for (var i = nodes.length - 1; i >= 0; i--) {
    nodes[i].year = +nodes[i].Year;
    delete nodes[i]['Year'];
    delete nodes[i]['imdbID'];
    nodes[i].id = i;
  };
  return nodes;
}

//potential for separating nodes by year - nodes closer together
//will relate to closer years.
//linkDistance gets a link and a 'this' reference to the force layout

function yearDistance(link){
  // return (link.source.year - link.target.year) * 2;
  return link.value;
}

function generateLinks(nodes){
  if (nodes.length === 1) {
    return [];
  } else {
    var links = [], tempNodes = nodes;
    mainNode = tempNodes.shift();
    nodes.forEach(function(d){
      links.push({
        "source": mainNode.id,
        "target": d.id,
        "value" : Math.abs(mainNode.year - d.year) * 5
      });  
    });
    // return links.concat(generateLinks(tempNodes));
    return links;
  };
}