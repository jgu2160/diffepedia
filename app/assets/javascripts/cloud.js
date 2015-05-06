$(document).ready(function() {

  var fill = d3.scale.linear()
  .domain([1, 10])
  .range(["#93ffb7", "#00a136"]);

  var font = "Helvetic Neue";
  var width = 500;
  var fontSize = 100;
  height = 1000;

  d3.layout.cloud().size([width, height])
  .words([
    "Hello", "world", "normally", "you", "want", "more", "words",
    "than", "this"].map(function(d,i) {
        lastIndex = i - 1
        if (lastIndex > -1) {
          fontSize -= 10
        }
      return {text: d, size: fontSize};
    }))
    .padding(5)
    .rotate(function() { return 0; })
    .font(font)
    .fontSize(function(d) { return d.size; })
    .on("end", draw)
    .start();
    function draw(words) {
      var sumSize = 0;
      d3.select("#cloud-div").append("svg")
      .attr("width", width)
      .attr("height", height)
      .append("g")
      .attr("transform", "translate(150,150)")
      .selectAll("text")
      .data(words)
      .enter().append("text")
      .style("fill", "white")
      .transition().duration(750)
      .style("font-size", function(d) { return d.size + "px"; })
      .style("font-family", font)
      .style("fill", function(d, i) { return fill(i); })
      .attr("text-anchor", "middle")
      .attr("transform", function(d, i) {
        lastIndex = i - 1
        if (lastIndex > -1) {
          sumSize += words[lastIndex].size - 20
        }

        return "translate(" + [100, sumSize] + ")rotate(" + d.rotate + ")";
      })
      .text(function(d) { return d.text; });
    }
});
