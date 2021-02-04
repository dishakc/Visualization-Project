<template>
  <div class="d3Chart">
    <div class="title">
      <br />
      <h5>Crime by Area and Victim's Race</h5>
    </div>
    <div>
      <center>
        <svg width="400" height="300" id="chart"></svg>
      </center>
    </div>
  </div>
</template>

<script>
import * as d3 from "d3";

export default {
  name: "d3Chart",
  data: function () {
    return {
      chartData: null,
    };
  },
  methods: {
    barChart(data) {
      var width = 600;
      var height = width;

      var pack = (data) =>
        d3.pack().size([width, height]).padding(3)(
          d3
            .hierarchy(data)
            .sum((d) => d.value)
            .sort((a, b) => b.value - a.value)
        );
      var color = d3
        .scaleLinear()
        .domain([0, 5])
        // .range(["hsl(152,80%,80%)", "hsl(228,30%,40%)"])
        // .range(["#fff7ec","#7f0000"])
        .range(["#fee8c8", "#7f0000"])

        .interpolate(d3.interpolateHslLong);

      const root = pack(data);
      let focus = root;
      let view;

      var svg = d3
        .select("#chart")
        .attr("width", 600)
        .attr("height", 600)
        .attr("viewBox", `-${width / 2} -${height / 2} ${width} ${height}`)
        .style("display", "block")
        .style("margin", "0 +14px")
        .style("background", color(0))
        .style("cursor", "pointer")
        .on("click", (event) => zoom(event, root));

      var node = svg
        .append("g")
        .selectAll("circle")
        .data(root.descendants().slice(1))
        .join("circle")
        .attr("fill", (d) => (d.children ? color(d.depth) : "white"))
        .attr("pointer-events", (d) => (!d.children ? "none" : null))
        .on("mouseover", function () {
          d3.select(this).attr("stroke", "#000");
        })
        .on("mouseout", function () {
          d3.select(this).attr("stroke", null);
        })
        .on(
          "click",
          (event, d) => focus !== d && (zoom(event, d), event.stopPropagation())
        );

      var label = svg
        .append("g")
        .style("font", "10px sans-serif")
        .attr("pointer-events", "none")
        .attr("text-anchor", "middle")
        .selectAll("text")
        .data(root.descendants())
        .join("text")
        .style("fill-opacity", (d) => (d.parent === root ? 1 : 0))
        .style("display", (d) => (d.parent === root ? "inline" : "none"))
        .text((d) => d.data.name);

      zoomTo([root.x, root.y, root.r * 2]);

      function zoomTo(v) {
        var k = width / v[2];

        view = v;
        label.attr(
          "transform",
          (d) => `translate(${(d.x - v[0]) * k},${(d.y - v[1]) * k})`
        );
        node.attr(
          "transform",
          (d) => `translate(${(d.x - v[0]) * k},${(d.y - v[1]) * k})`
        );
        node.attr("r", (d) => d.r * k);
      }

      function zoom(event, d) {
        // var focus0 = focus;

        focus = d;

        var transition = svg
          .transition()
          .duration(event.altKey ? 7500 : 750)
          .tween("zoom", () => {
            // console.log(d);
            var i = d3.interpolateZoom(view, [focus.x, focus.y, focus.r * 2]);
            return (t) => zoomTo(i(t));
          });

        label
          .filter(function (d) {
            return d.parent === focus || this.style.display === "inline";
          })
          .transition(transition)
          .style("fill-opacity", (d) => (d.parent === focus ? 1 : 0))
          .on("start", function (d) {
            if (d.parent === focus) this.style.display = "inline";
          })
          .on("end", function (d) {
            if (d.parent !== focus) this.style.display = "none";
          });
      }
    },
  },
  mounted: function () {
    // console.log("mounted");
    // console.log("circle packing", d3.version);
    if (!this.$store.state.vueChartData) {
      d3.json("circle_chart_data.json").then((data) => {
        this.data = data;
        // console.log('chartData set from file');
        // console.log('chartData contains', this.data.length, 'rows');
        this.$store.commit("vueChartData", this.data);
        // console.log(this.data);
        this.barChart(this.data);
      });
    } else {
      this.data = this.$store.state.vueChartData;
      // console.log('chartData set from store');
      // console.log('chartData contains', this.data.length, 'rows');
      this.barChart(this.data);
    }
  },
};
</script>

<!-- "scoped" attribute limits CSS to this component only -->
<style scoped>
>>> text.label {
  /* need to add >>> to gets passed to d3 because vue creates new mapping */
  text-anchor: end;
  /* alignment-baseline: middle; */
  font-size: 12px;
  fill: black;
}

>>> text.value {
  font-family: "Courier New", Courier, monospace;
  font-weight: bolder;
  font-size: 12px;
  text-anchor: end;
  /* alignment-baseline: middle; */
  fill: #eee;
}

>>> rect.bar {
  text-align: right; /* pull value text to the end of the bar */
  vertical-align: middle; /* align value text with middle of the bar */
  fill: #7abcff;
  height: 20px; /* bar height, this can stay fixed */
}

.title {
  margin-bottom: 0px;
  font-size: 12px;
}
</style>
