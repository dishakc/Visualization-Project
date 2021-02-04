<script src="https://api.mapbox.com/mapbox-gl-js/v1.12.0/mapbox-gl.js"></script>
<template>
  <div class="MapBox">
    <div class="jumbotron">
      <p style="font-size: 110%">
        <b>
          On this page, we have focused on analyzing the crime data. From the
          crime data, we aim to understand the relationship between the
          different attributes such as neighborhoods, victim demographic and the
          crime frequency. On this page, the users can interact with the
          visualizations to better infer the patterns between crime frequency
          and victim demographic in different neighborhoods in Los Angeles.
        </b>
      </p>
      <br />
      <h4>Crime Frequency by Age and Gender</h4>
      <p>
        The first chart indicates the frequency of crime taking place by age and
        gender. Through this we can understand which gender is hit worse in
        every age group.
      </p>
      <p>
        * Hover over the pie chart for specific gender distribution information
      </p>
      <p>* Hover over the bars for specific age distribution information</p>
      <div id="dashboard"></div>
      <br /><br />
      <!-- <br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br> -->
      <h4>Crime by Neighborhood and Victim's Race</h4>
      <p>
        This zoomable circle packing shows the crime by neighborhood and
        victim’s race. Through this we can determine the race that is affected
        most in every neighborhood.
      </p>
      <p>* Click on any Neighborhood for analysis by Victim's Race</p>
      <div>
        <center>
          <svg width="400" height="300" id="chart"></svg>
        </center>
      </div>
      <br /><br />
      <h4>Heat Map Indicating Crime Frequency for LA County</h4>
      <p>
        This chart shows the intensity of crime taking place in all the
        neighborhoods of LA. This gives us an overview of safe and unsafe
        neighborhoods relative to each other.
      </p>
      <p>* For specific information, zoom over the map</p>
      <meta
        name="viewport"
        content="initial-scale=1,maximum-scale=1,user-scalable=no"
      />
      <br />
      <div class="mapbox_container">
        <div id="map"></div>
      </div>
      <br />
    </div>
  </div>
</template>
<script>
import * as d3 from "d3";
import mapboxgl from "mapbox-gl";

export default {
  name: "MapBox",
  data: function () {
    return {
      accessToken:
        "pk.eyJ1IjoibWFuYW5pZXRlIiwiYSI6ImNrZ2l3MGlqbDAxbW0ydG96YzY0OHp4YjYifQ.fQx_eMJ8KeqXd-UIUc0Rbw",
    };
  },
  methods: {
    CrimeChart() {
      function dashboard(id, fData) {
        var barColor = "#fdae61";
        function segColor(c) {
          return {
            Female: "#35978f",
            Male: "#bf812d",
            Unknown: "#737373",
          }[c];
          // return { low: "#807dba", mid: "#e08214", high: "#41ab5d" }[c];
        }

        // compute total for each state.
        fData.forEach(function (d) {
          d.total = d.freq.Female + d.freq.Male + d.freq.Unknown;
        });

        // function to handle histogram.
        function histoGram(fD) {
          console.log(fD);
          var hG = {},
            hGDim = { t: 60, r: 0, b: 40, l: 20 };
          (hGDim.w = 800 - hGDim.l - hGDim.r),
            (hGDim.h = 500 - hGDim.t - hGDim.b);

          // var aspectRatio= '16:9';
          // var viewBox = '0 0 ' + aspectRatio.split(':').join(' ');

          //create svg for histogram.
          var hGsvg = d3
            .select(id)
            .append("svg")
            .attr("width", hGDim.w + hGDim.l + hGDim.r)
            .attr("height", hGDim.h + hGDim.t + hGDim.b)
            // .attr("preserveAspectRatio", "xMinYMin meet")
            // .attr("viewBox", `0 0 1500 500`) //`0 0 1500 500`
            // .classed('svg-content', true)
            .append("g")
            .attr("transform", "translate(" + hGDim.l + "," + hGDim.t + ")");

          // create function for x-axis mapping.
          var x = d3
            .scaleBand()
            .rangeRound([0, hGDim.w])
            .padding(0.1)
            .domain(
              fD.map(function (d) {
                return d[0];
              })
            );

          // Add x-axis to the histogram svg.
          hGsvg
            .append("g")
            .attr("class", "x axis")
            .attr("transform", "translate(0," + hGDim.h + ")")
            .call(d3.axisBottom(x));

          // hGsvg
          //   .append("g")
          //   .attr("class", "x axis")
          //   .selectAll("text")
          //   .append("text")
          //   .text("Age")

          // x => `(${x.toFixed(1)}
          // Create function for y-axis map.
          var y = d3
            .scaleLinear()
            .range([hGDim.h, 0])
            .domain([
              0,
              d3.max(fD, function (d) {
                return d[1];
              }),
            ]);

          // Create bars for histogram to contain rectangles and freq labels.
          var bars = hGsvg
            .selectAll(".bar")
            .data(fD)
            .enter()
            .append("g")
            .attr("class", "bar");

          //create the rectangles.
          bars
            .append("rect")
            .attr("x", function (d) {
              return x(d[0]);
            })
            .attr("y", function (d) {
              return y(d[1]);
            })
            .attr("width", x.bandwidth())
            .attr("height", function (d) {
              return hGDim.h - y(d[1]);
            })
            .attr("fill", barColor)
            .on("mouseover", mouseover) // mouseover is defined below.
            .on("mouseout", mouseout); // mouseout is defined below.

          //Create the frequency labels above the rectangles.
          bars
            .append("text")
            .text(function (d) {
              return d3.format(",")(d[1]);
            })
            .attr("x", function (d) {
              return x(d[0]) + x.bandwidth() / 2;
            })
            .attr("y", function (d) {
              return y(d[1]) - 5;
            })
            .attr("text-anchor", "middle");

          hGsvg
            .append("g")
            .append("text")
            .attr("x", hGDim.w / 2)
            .attr("y", hGDim.h + 35)
            .style("text-anchor", "middle")
            .text("Age");

          hGsvg
            .append("g")
            .append("text")
            .attr("transform", "rotate(-90)")
            .attr("y", 0 - hGDim.l)
            .attr("x", 0 - hGDim.h / 2)
            .attr("dy", "1em")
            .style("text-anchor", "middle")
            .text("Crime Frequency");

          function mouseover(event, d) {
            // utility function to be called on mouseover.
            // filter for selected state.
            var st = fData.filter(function (s) {
              return s.State == d[0];
            })[0];

            var nD = Object.keys(st.freq).map(function (s) {
              return { type: s, freq: st.freq[s] };
            });

            // call update functions of pie-chart and legend.
            pC.update(nD);
            leg.update(nD);
          }

          function mouseout() {
            // utility function to be called on mouseout.
            // reset the pie-chart and legend.
            pC.update(tF);
            leg.update(tF);
          }

          // create function to update the bars. This will be used by pie-chart.
          hG.update = function (nD, color) {
            // update the domain of the y-axis map to reflect change in frequencies.
            y.domain([
              0,
              d3.max(nD, function (d) {
                return d[1];
              }),
            ]);

            // Attach the new data to the bars.
            var bars = hGsvg.selectAll(".bar").data(nD);

            // transition the height and color of rectangles.
            bars
              .select("rect")
              .transition()
              .duration(500)
              .attr("y", function (d) {
                return y(d[1]);
              })
              .attr("height", function (d) {
                return hGDim.h - y(d[1]);
              })
              .attr("fill", color);

            // transition the frequency labels location and change value.
            bars
              .select("text")
              .transition()
              .duration(500)
              .text(function (d) {
                return d3.format(",")(d[1]);
              })
              .attr("y", function (d) {
                return y(d[1]) - 5;
              });
          };
          return hG;
        }

        // function to handle pieChart.
        function pieChart(pD) {
          var pC = {},
            pieDim = { w: 250, h: 250 };
          pieDim.r = Math.min(pieDim.w, pieDim.h) / 2;
          // create svg for pie chart.
          var piesvg = d3
            .select(id)
            .append("svg")
            .attr("width", pieDim.w)
            .attr("height", pieDim.h)
            // .attr("viewBox", `0 0 1500 250`)
            // .attr("preserveAspectRatio", "xMinYMin meet")
            // .attr("viewBox", `0 0 1500 250`) //`0 0 1500 500`
            // .classed('svg-content1', true)

            .append("g")
            .attr(
              "transform",
              "translate(" + pieDim.w / 2 + "," + pieDim.h / 2 + ")"
            );

          // create function to draw the arcs of the pie slices.
          var arc = d3
            .arc()
            .outerRadius(pieDim.r - 10)
            .innerRadius(0);

          // create a function to compute the pie slice angles.
          var pie = d3
            .pie()
            .sort(null)
            .value(function (d) {
              return d.freq;
            });

          // Draw the pie slices.
          piesvg
            .selectAll("path")
            .data(pie(pD))
            .enter()
            .append("path")
            .attr("d", arc)
            .each(function (d) {
              this._current = d;
            })
            .style("fill", function (d) {
              return segColor(d.data.type);
            })
            .on("mouseover", mouseover)
            .on("mouseout", mouseout);

          // create function to update pie-chart. This will be used by histogram.
          pC.update = function (nD) {
            piesvg
              .selectAll("path")
              .data(pie(nD))
              .transition()
              .duration(500)
              .attrTween("d", arcTween);
          };
          // Utility function to be called on mouseover a pie slice.
          function mouseover(event, d) {
            // call the update function of histogram with new data.
            hG.update(
              fData.map(function (v) {
                console.log(v);
                return [v.State, v.freq[d.data.type]];
              }),
              segColor(d.data.type)
            );
          }
          //Utility function to be called on mouseout a pie slice.
          function mouseout() {
            // call the update function of histogram with all data.
            hG.update(
              fData.map(function (v) {
                return [v.State, v.total];
              }),
              barColor
            );
          }
          // Animating the pie-slice requiring a custom function which specifies
          // how the intermediate paths should be drawn.
          function arcTween(a) {
            var i = d3.interpolate(this._current, a);
            this._current = i(0);
            return function (t) {
              return arc(i(t));
            };
          }
          return pC;
        }

        // function to handle legend.
        function legend(lD) {
          var leg = {};

          // create table for legend.
          var legend = d3.select(id).append("table").attr("class", "legend");

          // create one row per segment.
          var tr = legend
            .append("tbody")
            .selectAll("tr")
            .data(lD)
            .enter()
            .append("tr");

          // create the first column for each segment.
          tr.append("td")
            .append("svg")
            .attr("width", "16")
            .attr("height", "16")
            .append("rect")
            .attr("width", "16")
            .attr("height", "16")
            .attr("fill", function (d) {
              return segColor(d.type);
            });

          // create the second column for each segment.
          tr.append("td").text(function (d) {
            return d.type;
          });

          // create the third column for each segment.
          tr.append("td")
            .attr("class", "legendFreq")
            .text(function (d) {
              return d3.format(",")(d.freq);
            });

          // create the fourth column for each segment.
          tr.append("td")
            .attr("class", "legendPerc")
            .text(function (d) {
              return getLegend(d, lD);
            });

          // Utility function to be used to update the legend.
          leg.update = function (nD) {
            // update the data attached to the row elements.
            var l = legend.select("tbody").selectAll("tr").data(nD);

            // update the frequencies.
            l.select(".legendFreq").text(function (d) {
              return d3.format(",")(d.freq);
            });

            // update the percentage column.
            l.select(".legendPerc").text(function (d) {
              return getLegend(d, nD);
            });
          };

          function getLegend(d, aD) {
            // Utility function to compute percentage.
            return d3.format(".0%")(
              d.freq /
                d3.sum(
                  aD.map(function (v) {
                    return v.freq;
                  })
                )
            );
          }

          return leg;
        }
        // calculate total frequency by segment for all state.
        // var tF = ["low", "mid", "high"]
        var tF = ["Female", "Male", "Unknown"].map(function (d) {
          return {
            type: d,
            freq: d3.sum(
              fData.map(function (t) {
                return t.freq[d];
              })
            ),
          };
        });
        // calculate total frequency by state for all segment.
        var sF = fData.map(function (d) {
          return [d.State, d.total];
        });

        var hG = histoGram(sF), // create the histogram.
          pC = pieChart(tF), // create the pie-chart.
          leg = legend(tF); // create the legend.
      }
      // var freqData = [
      //   { State: "AM", freq: { low: 10.9, mid: 11.3, high: 8.1 } },
      //   { State: "BA", freq: { low: 11.4, mid: 12.2, high: 11.8 } },
      //   { State: "CE", freq: { low: 8.6, mid: 7.7, high: 7.1 } },
      //   { State: "DF", freq: { low: 20.9, mid: 13, high: 16.1 } },
      //   { State: "ES", freq: { low: 10.3, mid: 10.9, high: 14.5 } },
      //   { State: "GO", freq: { low: 10.5, mid: 11.4, high: 13.3 } },
      // ];
      var freqData = [
        {
          State: "0 - 10",
          freq: {
            Female: 12024,
            Male: 10275,
            Unknown: 300,
          },
        },
        {
          State: "11 - 20",
          freq: {
            Female: 92010,
            Male: 70165,
            Unknown: 5027,
          },
        },
        {
          State: "21 - 30",
          freq: {
            Female: 245738,
            Male: 206177,
            Unknown: 222,
          },
        },
        {
          State: "31 - 40",
          freq: {
            Female: 191739,
            Male: 193930,
            Unknown: 152,
          },
        },
        {
          State: "41 - 50",
          freq: {
            Female: 147726,
            Male: 163915,
            Unknown: 101,
          },
        },
        {
          State: "51 - 60",
          freq: {
            Female: 104517,
            Male: 127373,
            Unknown: 80,
          },
        },
        {
          State: "61 - 70",
          freq: {
            Female: 51291,
            Male: 61540,
            Unknown: 33,
          },
        },
        {
          State: "71 - 80",
          freq: {
            Female: 20901,
            Male: 21331,
            Unknown: 12,
          },
        },
        {
          State: "81 - 90",
          freq: {
            Female: 8558,
            Male: 6745,
            Unknown: 2,
          },
        },
        {
          State: "91 - 100",
          freq: {
            Female: 1943,
            Male: 1474,
            Unknown: 38,
          },
        },
      ];

      dashboard("#dashboard", freqData);
    },
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
        // .style("background", color(0))
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
          .tween("zoom", (d) => {
            console.log(d);
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
    HeatMap() {
      mapboxgl.accessToken = this.accessToken;
      var map = new mapboxgl.Map({
        container: "map",
        style: "mapbox://styles/mapbox/dark-v10",
        center: [-118.3, 34],
        zoom: 9,
        // maxBounds: [
        //     [103.6, 1.1704753],
        //     [104.1, 1.4754753],
        // ],
      });

      map.on("load", function () {
        // Add a geojson point source.
        // Heatmap layers also work with a vector tile source.
        map.addSource("earthquakes", {
          type: "geojson",
          data: "crime_mapbox.geojson",
        });

        map.addLayer(
          {
            id: "earthquakes-heat",
            type: "heatmap",
            source: "earthquakes",
            maxzoom: 11,
            paint: {
              // Increase the heatmap weight based on frequency and property magnitude
              "heatmap-weight": [
                "interpolate",
                ["linear"],
                ["get", "mag"],
                0,
                0,
                3,
                1,
              ],
              // Increase the heatmap color weight weight by zoom level
              // heatmap-intensity is a multiplier on top of heatmap-weight
              "heatmap-intensity": [
                "interpolate",
                ["linear"],
                ["zoom"],
                0,
                1,
                18,
                4,
              ],
              // Color ramp for heatmap.  Domain is 0 (low) to 1 (high).
              // Begin color ramp at 0-stop with a 0-transparancy color
              // to create a blur-like effect.
              "heatmap-color": [
                "interpolate",
                ["linear"],
                ["heatmap-density"],
                0,
                "rgba(33,102,172,0)",
                0.05,
                "#fdd49e",
                0.1,
                "#fdbb84",
                0.3,
                "#fc8d59",
                0.6,
                "#ef6548",

                0.8,
                "#d7301f",
                1,
                "#990000",
              ],

              // Adjust the heatmap radius by zoom level
              "heatmap-radius": [
                "interpolate",
                ["linear"],
                ["zoom"],
                20,
                20,
                80,
                100,
              ],
              // Transition from heatmap to circle layer by zoom level
              "heatmap-opacity": [
                "interpolate",
                ["linear"],
                ["zoom"],
                7,
                1,
                30,
                1,
              ],
            },
          },
          "waterway-label"
        );
      });
    },
  },
  mounted: function () {
    console.log("mounted");
    this.CrimeChart();
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
    this.HeatMap();
  },
};
</script>

<!-- "scoped" attribute limits CSS to this component only -->
<style scoped>
/* Crime Chart*/
/* >>> body {
  width: 1060px;
  margin: 50px auto;
} */
>>> path {
  stroke: #fff;
}
>>> path:hover {
  opacity: 0.2;
}
>>> rect:hover {
  /* fill: #fcc885; */
  opacity: 0.5;
}
>>> .axis {
  font: 10px sans-serif;
}
>>> .legend tr {
  border-bottom: 1px solid grey;
}
>>> .legend tr:first-child {
  border-top: 1px solid grey;
}

>>> .axis path,
>>> .axis line {
  fill: none;
  stroke: #000;
  shape-rendering: crispEdges;
}

>>> .x.axis path {
  display: none;
}
>>> .legend {
  margin-bottom: 76px;
  display: inline-block;
  border-collapse: collapse;
  border-spacing: 0px;
}
>>> .legend td {
  padding: 4px 5px;
  vertical-align: bottom;
}
>>> .legendFreq,
.legendPerc {
  align: right;
  width: 50px;
}
/* >>> .svg-content {
    display: inline-block;
    position: absolute;
    top: 50px;
    left: 50px;
}
>>> .svg-content1 {
    display: inline-block;
    position: absolute;
    top: 150px;
    left: 900px;
}
>>> .svg-content3 {
    display: inline-block;
    position: absolute;
    top: 150px;
    left: 900px; 
}*/
/* Circle packing*/

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
/* Map Box */
/* >>> body {
  margin: 0;
  padding: 0;
} */
>>> .mapbox_container {
  position: relative;
  height: 600px;
  width: 1300px;
  display: inline-block;
}
>>> #map {
  position: absolute;
  top: 0;
  bottom: 0;
  width: 100%;
}

>>> .mapboxgl-ctrl-attrib {
  display: none;
}
</style>
