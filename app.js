/* global d3, $*/

var width = 900,
  height = 500;

//last keyword looked for
var keyword, clickedNode;

var result, nodeCounter = 0;

var svg = d3.select("body").append("svg")
  .attr("width", width)
  .attr("height", height);

var color = d3.scale.category20c();

var nodes = [],
  links = [];

var force = d3.layout.force()
  .charge(-120)
  .linkDistance(80)
  .size([width, height])
  .nodes(nodes)
  .links(links)
  .on("tick", tick);

var link = svg.selectAll(".link"),
  node = svg.selectAll(".gnode");

function start() {

  link = link.data(force.links());
  link.enter().append("line")
    .attr("class", "link")
    .style("stroke-width", 2);
  link.exit().remove();

  node = node.data(force.nodes());
  var gnode = node.enter().append("g")
    .attr("class", "gnode");
  node.exit().remove();

  gnode.append("text")
    .attr("x", 14)
    .attr("y", ".31em")
    .text(function(d) {
      return d.Title;
    })
    .on("click", function(d) {
      if (d3.event.defaultPrevented) return;
      clickedNode = d;
      var words = d.Title.toLowerCase().split(" ").filter(function(w) {
        return w != keyword;
      });
      console.log(words);
      updateNodes(words[Math.floor(Math.random() * words.length)]);
    });

  gnode.append("svg:a")
    .attr("xlink:href", function(d) {
      return "http://www.imdb.com/title/" + d.imdbID + "/";
    })
    .attr("target", "_blank")
    .append("circle")
    .attr("class", "node")
    .attr("r", 5)
    .style("fill", function(d) {
      return color(d.year);
    })
    .call(force.drag);
  force.start();
}

//format into node-link relationship
function coerce(nodes) {
  for (var i = nodes.length - 1; i >= 0; i--) {
    nodes[i].year = +nodes[i].Year.slice(0, 4);
    delete nodes[i].Year;
    nodes[i].id = nodeCounter;
    nodeCounter++;
  }
  return nodes;
}

function coerceLinks(links) {
  if (links.length > 0) {
    for (var i = links.length - 1; i >= 0; i--) {
      links[i].source = links[i].source.id;
      links[i].target = links[i].target.id;
    }
  }
  return links;
}

function generateLinks(newNodes) {
  if (newNodes.length <= 1) {
    return [];
  } else {
    var result = [],
      hubNodeId;
    if (clickedNode) {
      hubNodeId = clickedNode.index;
    } else {
      hubNodeId = newNodes.shift().id;
    }

    newNodes.forEach(function(d) {
      result.push({
        "source": hubNodeId,
        "target": d.id
      });
    });
    return result;
  }
}

function tick() {
  link.attr("x1", function(d) {
      return d.source.x;
    })
    .attr("y1", function(d) {
      return d.source.y;
    })
    .attr("x2", function(d) {
      return d.target.x;
    })
    .attr("y2", function(d) {
      return d.target.y;
    });

  node.attr("transform", function(d) {
    return "translate(" + [d.x, d.y] + ")";
  });
}

function updateNodes() {
  keyword = arguments[0] || "mile";

  d3.json("http://omdbapi.com/?s=" + keyword, function(error, json) {
    if (error) {
      console.log(error);
    }
    result = json;
    var newNodes = coerce(json.Search);
    var newLinks = generateLinks($.extend(true, [], newNodes));

    pushArray(newNodes, nodes);
    pushArray(newLinks, links);

    start();
  });
}

// making a function rather than messing with Array.prototype
function pushArray(sourceArray, destArray) {
  sourceArray.forEach(function(v) {
    destArray.push(v);
  });
}

updateNodes();
