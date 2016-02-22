app.directive('recordDisplay', function () {
    return {
        restrict: 'EA',

        templateUrl: 'app/views/rps/recordDisplay.html'
    }
});
app.directive('playerInput', function () {
    return {
        restrict: 'EA',

        templateUrl: 'app/views/rps/playerInput.html'
    }
});
app.directive('lastHand', function () {
    return {
        restrict: 'EA',

        templateUrl: 'app/views/rps/lastHand.html'
    }
});
app.directive('instruction', function () {
    return {
        restrict: 'EA',

        templateUrl: 'app/views/rps/instruction.html'
    }
});
app.directive('leaderboard', function () {
    return {
        restrict: 'EA',

        templateUrl: 'app/views/rps/leaderboard.html'
    }
});


app.directive('rockImage', function () {
    return {
        restrict: 'EA',

        template: "<img src='app/images/Rock.svg'/>"
    }
});
app.directive('paperImage', function () {
    return {
        restrict: 'EA',

        template: "<img src='app/images/Paper.svg'/>"
    }
});
app.directive('scissorImage', function () {
    return {
        restrict: 'EA',

        template: "<img src='app/images/Scissors.svg'/>"
    }
});

app.directive('undecidedImage', function () {
    return {
        restrict: 'EA',

        template: "<img src='app/images/Undecided.png'/>"
    }
});
app.directive('aiOutput', function () {
    return {
        restrict: 'EA',

        templateUrl: 'app/views/rps/aiOutput.html'
    }
});
app.filter('reverse', function () {
    return function (items) {
        return items.slice().reverse();
    };
});
app.directive('gameRecap', function () {
    return {
        restrict: 'EA',

        templateUrl: 'app/views/rps/gameRecap.html'
    }
});
app.directive('gameGraph', function () {
    return {
        restrict: "EA",
        template: function (elem, attrs) {
            return "<div id='chart-area'></div>";
        },
        link: function (scope, elem, attrs) {
            var treeData = [
                {
                    "name": "Top Level",
                    "parent": "null",
                    "children": [
                        {
                            "name": "Level 2: A",
                            "parent": "Top Level",
                            "children": [
                                {
                                    "name": "Son of A",
                                    "parent": "Level 2: A"
                                },
                                {
                                    "name": "Daughter of A",
                                    "parent": "Level 2: A"
                                }
                            ]
                        },
                        {
                            "name": "Level 2: B",
                            "parent": "Top Level"
                        }
                    ]
                }
            ];
            
            function replacer(obj, keys)
{
    var dup = {};
    for (key in obj) {
        if (keys.indexOf(key) == -1) {
            dup[key] = obj[key];
        }
    }
    return dup;
}
var colors = {'R':"red",'P':"green",'S':'gray'};
var winners = {'AI':"red",'Player':"green",'Draw':'gray'};
            var treeData=scope.record.graph;
           // if(treeData.R == undefined) return;

            // ************** Generate the tree diagram	 *****************
            var margin = { top: 25, right: 25, bottom: 25, left: 75 },
                width = window.innerWidth*.5 - margin.right -margin.left,
                height = treeData.forks_below*10;

            var i = 0,
                duration = 350,
                root;

            var tree = d3.layout.tree()
                .size([height, width]);

            var diagonal = d3.svg.diagonal()
                .projection(function (d) { return [d.y, d.x]; });

            var svg = d3.select("#chart-area").append("svg")
                .attr("width", width + margin.right + margin.left)
                .attr("height", height + margin.top + margin.bottom)
                .append("g")
                .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
            var root_depth = treeData.depth;
            root = treeData;
            root.x0 = height / 2;
            root.y0 = 0;
            
            if(root!= undefined) update(root);

            d3.select(self.frameElement).style("height", "500px");

            function update(source) {

                // Compute the new tree layout.
                var nodes = tree.nodes(root).reverse(),
                    links = tree.links(nodes);

                // Normalize for fixed-depth.
                nodes.forEach(function (d) {
                     d.y = d.depth * (width/root_depth);
                     d.x +=  (d.name=='R'?10:d.name=="S"?-10:0); })

                // Update the nodes…
                var node = svg.selectAll("g.node")
                    .data(nodes, function (d) { return d.id || (d.id = ++i); });

                // Enter any new nodes at the parent's previous position.
                var nodeEnter = node.enter().append("g")
                    .attr("class", "node")
                    .attr("transform", function (d) { 
                        return "translate(" + source.y0 + "," + source.x0 + ")"; })
                    .on("click", click);

                nodeEnter.append("circle")
                    .attr("r", 1e-6)
                    .style("fill", function (d) { 
                         return colors[d.name]  });

                nodeEnter.append("text")
                    .attr("x", 0)
                        .attr("y", -16)
                    .attr("dy", ".35em")
                    .attr("text-anchor", function (d) { 
                        return d.children || d._children ? "end" : "start"; })
                    .text(function (d) { 
                        return d.name + ":"+d.index; })
                    .style("fill-opacity", 1e-6);

                // Transition nodes to their new position.
                var nodeUpdate = node.transition()
                    .duration(duration)
                    .attr("transform", function (d) { return "translate(" + d.y + "," + d.x + ")"; });

                nodeUpdate.select("circle")
                    .attr("r", function (d) { return (Math.max(10,d.forks_below/10))  })
                    .style("fill", function (d) { return winners[d.winner] });

                nodeUpdate.select("text")
                    .style("fill-opacity", 1);

                // Transition exiting nodes to the parent's new position.
                var nodeExit = node.exit().transition()
                    .duration(duration)
                    .attr("transform", function (d) { 
                        return "translate(" + source.y + "," + source.x + ")"; })
                    .remove();

                nodeExit.select("circle")
                    .attr("r", 1e-6);

                nodeExit.select("text")
                    .style("fill-opacity", 1e-6);

                // Update the links…
                var link = svg.selectAll("path.link")
                    .data(links, function (d) { return d.target.id; });

                // Enter any new links at the parent's previous position.
                link.enter().insert("path", "g")
                    .attr("class", "link")
                    .attr("d", function (d) {
                        var o = { x: source.x0, y: source.y0 };
                        return diagonal({ source: o, target: o });
                    });

                // Transition links to their new position.
                link.transition()
                    .duration(duration)
                    .attr("d", diagonal);

                // Transition exiting nodes to the parent's new position.
                link.exit().transition()
                    .duration(duration)
                    .attr("d", function (d) {
                        var o = { x: source.x, y: source.y };
                        return diagonal({ source: o, target: o });
                    })
                    .remove();

                // Stash the old positions for transition.
                nodes.forEach(function (d) {
                    d.x0 = d.x;
                    d.y0 = d.y;
                   
                });
            
            }
            // Toggle children on click.
            function click(d) {
                if (d.children) {
	d._children = d.children;
	d.children = null;
  } else {
	d.children = d._children;
	d._children = null;
  }
  update(d);
            }
        }//End Link
    }



});