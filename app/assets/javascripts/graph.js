$(document).ready(function() {
  if(window.location.pathname === '/') {
    var simple_sets = [ {sets: ['A'], size: 12},
      {sets: ['B'], size: 12},
    {sets: ['A','B'], size: 2}];

    var chart1 = venn.VennDiagram()

    d3.select("#venn1").datum(simple_sets).call(chart1);

    function getSetIntersections() {
      areas = d3.selectAll(".venn_area")[0].map(
        function (element) {
          return { sets: element.id.split(","),
            size: parseFloat(element.value)};} );
            return areas;
    }

    // draw the initial set
    var chart = venn.VennDiagram()
    .width(600)
    .height(500);
    d3.select("#venn").datum(getSetIntersections()).call(chart);
    // redraw the sets on any change in input
    d3.selectAll("input").on("change", function() {
      d3.select("#venn").datum(getSetIntersections()).call(chart);
    });
    // tweak style
    var colours = ['black', 'red', 'blue'];
    d3.selectAll("#venn .venn-circle path")
    .style("fill-opacity", 0)
    .style("stroke-width", 10)
    .style("stroke-opacity", .5)
    .style("stroke", function(d,i) { return colours[i]; });
    d3.selectAll("#venn .venn-circle text")
    .style("fill", function(d,i) { return colours[i]})
    .style("font-size", "32px")
    .style("font-weight", "100");
  }
});
