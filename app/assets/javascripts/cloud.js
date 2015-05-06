$(document).ready(function() {
  //make_cloud();
});

function make_cloud(word_array, div) {
  var word_array = word_array || ["Hello", "world", "normally", "you", "want", "more", "words"]
  var div = div || "#cloud-div"
  var fill = d3.scale.linear()
  .domain([1, 100])
  .range(["black", "#E3E3E3"]);

  var font = "Roboto";
  var cloudSize = [500, 500];
  var fontSize = 50;
  var fontDecrement = 1;

  d3.layout.cloud().size(cloudSize)
  .words(word_array.map(function(d,i) {
        lastIndex = i - 1
        if (lastIndex > -1) {
          fontSize -= fontDecrement;
        }
      return {text: d, size: fontSize};
    }))
    .padding(0)
    .rotate(function() { return 0; })
    .font(font)
    .fontSize(function(d) { return d.size; })
    .on("end", draw)
    .start();
    function draw(words) {
      var sumSize = 0;
      var width = cloudSize[0];
      var height = cloudSize[1];
      d3.select(div).append("svg")
      .attr("width", width)
      .attr("height", height)
      .append("g")
      .attr("transform", "translate(150,150)")
      .selectAll("text")
      .data(words)
      .enter().append("text")
      .style("fill", "white")
      .transition().duration(1500)
      .style("font-size", function(d) { return d.size + "px"; })
      .style("font-family", font)
      .style("fill", function(d, i) { return fill(i); })
      .attr("text-anchor", "middle")
      .attr("transform", function(d, i) {
        console.log(d);
        return "translate(" + [d.x, d.y] + ")rotate(" + d.rotate +       ")";
        //lastIndex = i - 1
        //if (lastIndex > -1) {
          //sumSize += words[lastIndex].size - 20
        //}

        //return "translate(" + [100, sumSize] + ")rotate(" + d.rotate + ")";
      })
      .text(function(d) { return d.text; });
    }
};
