<template>
  <div class="CombinedChart">
    <link href="css/bootstrap/bootstrap.min.css" rel="stylesheet" />
    <div id="area" class="jumbotron">
      <h4>Correlation between Safety Score Vs Rent price in Los Angeles</h4>
      <br />
      <p>
        To understand the relationship between the rent and crime more
        cohesively, we decided to introduce a new attribute, called, “Safety
        Score”. This was calculated to consider that different crime types have
        different severity levels and hence, should be given higher weightage
        even if their frequency is low. Therefore, we calculated the crime score
        first by aligning each crime type to it’s severity. After calculating
        the crime score, the safety score were calculated using the crime score.
      </p>

      <h5>Safety Score Calculation</h5>
      <p>
        The crime dataset consists of a list of crimes with varying severity.
        Intuitively, it can be understood that the more serious the crime the
        higher it impacts the perception of security in a location. Based on
        <a href="https://doi.org/10.1093/police/pax049" target="_blank"
          >Comparing Methods for Measuring Crime Harm/Severity</a
        >, weights are assigned to every crime and an overall value is
        calculated for each location. Each crime in the crime dataset was
        compared with the list of Notifiable Offence List Categories and given
        the Crime Severity Score. The Crime Severity Score (CSS) is the score
        assigned to a crime based on the mean sentence passed on those who were
        convicted of the offense. Each score is normalized and the final crime
        values for each location is calculated using the dot product of the
        crime weight and the crime frequency matrices. Using these crime scores,
        the safety scores are calculated by taking their negatives.
      </p>

      <h5>Final chart</h5>
      <p>
        In the cloropleth map on this page, the colors indicate the average rent
        price for each neighborhood. When hovered over a neighborhood, the
        average rent over the years in that neighborhood is shown in the
        tooltip. Through the interactive feature, which allows users to select a
        specific neighborhood on the map, one can dive deeper into the trends of
        both safety score and average rent over the years for that specific
        neighborhood. In general, the user can observe that as the safety score
        increases, the rent price increases.
      </p>
      <div class="container">
        <div class="row">
          <div class="col-md-6">
            <div id="select-year" style="text-align: center"></div>
            <div id="map-left">
              <!-- <svg id = "svg_chart"></svg> -->
            </div>
          </div>
          <div id="map-right" class="col-md-6">
            <h4 style="text-align: center">
              Safety Score Vs Rent price in LA by year
            </h4>
            <h6>* Line Chart Represents Rent Price</h6>
            <h6>* Bar Chart Represents Safety Score</h6>
            <div class="row" id="map-line2"></div>
            <div class="row" id="map-line"></div>
            <div id="area_name"></div>
            <!-- <svg class="row" id="bar_chart" width="100%" height="500px"></svg> -->
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import * as d3 from "d3";

export default {
  name: "CombinedChart",
  data: function () {
    return {
      chartData: null,
    };
  },
  methods: {
    CombinedChart() {
      var width = 500;
      var height = 600;
      var projection = d3
        .geoMercator()
        .scale(15000)
        // .scale(40000)
        // Center the Map in LA
        .center([-118.245, 34.05])
        .translate([width / 2, height / 2]);
      // var projection = d3.geoAlbersUsa()
      //     .translate([width / 2, height / 2])
      //     .scale([5000]);

      // var tooltip = d3.select("body").append("div").attr("class", "toolTip");
      var tooltip = d3
        .select("#map-left")
        .append("div")
        .attr("class", "toolTip");
      var tooltip_bar = d3
        .select("#map-right")
        .append("div")
        .attr("class", "toolTip");
      // var tooltip_bar = d3.select("body").append("div").attr("class", "toolTip");

      var path = d3.geoPath().projection(projection);
      var svg1 = d3
        .select("body")
        .select("div#map-left")
        .append("svg")
        // .attr("viewBox", "0 0 500 600");
        .attr("width", width)
        .attr("height", height);
      var color;
      // multiple async tasks

      var files = [
        "la-county.geojson",
        "area_data.json",
        "overall_data.json",
        "bar_data.json",
        "bar_overall.json",
      ];
      var promises = [];

      files.forEach(function (url) {
        promises.push(d3.json(url));
      });
      Promise.all(promises).then(function (values) {
        var geojson = values[0];
        var areadata = values[1];
        var overall = values[2];
        var bar_data = values[3];
        var bar_overall = values[4];
        overall_data = overall;
        bar_overall_data = bar_overall;
        area_data = d3.group(areadata, function (d) {
          return d["Area Name"];
        });
        area_data = Object.fromEntries(area_data);
        // .object(areadata);
        // d3
        // .nest()
        // .key(function (d) {
        //   return d["Area Name"];
        // })
        // .object(areadata);
        bar_area_data = bar_data;
        var json_features = dataPrep(geojson, areadata);
        // console.log(json_features);
        // var json_features1 = dataPrep1(geojson, bar_data);
        // col = ["#67001f","#b2182b","#d6604d","#f4a582","#fddbc7","#f7f7f7","#d1e5f0","#92c5de","#4393c3","#2166ac","#053061"]
        var col = [
          "#ffffcc",
          "#ffeda0",
          "#fed976",
          "#feb24c",
          "#fd8d3c",
          "#fc4e2a",
          "#e31a1c",
          "#bd0026",
          "#800026",
        ];
        color = d3.scaleQuantize().range(col);
        // .range(d3.schemeReds[9]);
        svg1
          .selectAll("path")
          .data(json_features)
          .enter()
          .append("path")
          .attr("class", "map")
          .attr("d", path)
          .on("click", function (e, d) {
            dispatch.call("areachange", this, d);
            // dispatch.call("areachange", this, d);
            d3.select(this).classed("selected", true);
          });
        // right part
        // line chart
        // initLine();
        // Adding legend
        var l_color = d3.scaleQuantize([0, 2332], col);
        var legendRectSize = 18;
        var legendSpacing = 4;
        var keys = [
          "$0 - $291.5",
          "$291.6 - $583",
          "$584 - $874.5",
          "$874.6 - $1166",
          "$1167 - $1457.5",
          "$1457.6 - $1749",
          "$1750 - $2040.5",
          "$2040.6 - $2332",
        ];
        // var keys = ["1% - 10%", "11% - 20%", "21% - 30%", "31% - 40%", "41% - 50%", "51% - 60%", "61% - 70%", "71% - 80%", "81% - 90%", "91% - 100%"];
        var legend = svg1
          .selectAll(".legend")
          .data([291.5, 583, 874.5, 1166, 1457.5, 1749, 2040.5, 2332])
          .enter()
          .append("g")
          .attr("class", "legend")
          .attr("fill-opacity", 0.7)
          .attr("transform", function (d, i) {
            var height = legendRectSize + legendSpacing;
            var horz = 5 * legendRectSize + 250;
            var vert = i * height + 380;
            return "translate(" + horz + "," + vert + ")";
          });

        legend
          .append("rect")
          .attr("width", legendRectSize)
          .attr("height", legendRectSize)
          .style("fill", l_color)
          .style("stroke", l_color);

        legend
          .append("text")
          .attr("x", legendRectSize + legendSpacing)
          .attr("y", legendRectSize - legendSpacing)
          .text(function (d, i) {
            return keys[i];
          });

        dispatch.call("load", this);
        dispatch.call("statechange", this, selected_year);
      });

      // var queue = d3.queue();

      // queue.defer(d3.json, "lapd-divisions.geojson")
      // queue.defer(d3.json, "data processing/dataByAreaV2.json")
      // queue.defer(d3.json, "data processing/dataOverall.json")

      // queue.defer(d3.json, "la-county.geojson");
      // queue.defer(d3.json, "data processing/area_data.json");
      // queue.defer(d3.json, "data processing/overall_data.json");
      // queue.defer(d3.json, "data processing/bar_data.json");
      // queue.defer(d3.json, "data processing/bar_overall.json");

      // queue.await(ready);

      // var select_years = ['All', '2017', '2016', '2015', '2014', '2013', '2012', '2011', '2010'];
      // var select_years = ["All"];

      // current selection on year and area, all times and all areas by default
      var selected_year = "All";
      var selected_area = null;
      var overall_data;
      var area_data;
      var bar_overall_data;
      // var bar_data;
      // var area_name;
      var bar_area_data;
      // dispatch
      var dispatch = d3.dispatch("load", "statechange", "areachange");

      dispatch.on("load.reset", function () {
        var button = d3
          .select("body")
          .select("div#select-year")
          .append("button")
          .attr("class", "btn btn-secondary")
          .attr("type", "button")
          .attr("disabled", "disabled")
          // .attr("disabled", null)
          .on("click", function () {
            dispatch.call("areachange", this, null);
          });
        button.text("RESET");

        dispatch.on("areachange.reset", function (d) {
          if (!d) {
            button.attr("disabled", "disabled");
            // button.attr("disabled", null);
            button.text("RESET");
          } else {
            button.attr("disabled", null);
            button.text("RESET");
          }
        });
      });

      dispatch.on("load.map", function () {
        var paths = svg1.selectAll("path");
        var paths_data = paths.data();
        // console.log(paths_data);
        paths.on("mouseout", function () {
          tooltip.style("display", "none");
        });
        // console.log(paths_data);

        // for (var j = 0; j < paths_data.length; j++) {
        //   paths_data[j].properties.byYear = Object.fromEntries(paths_data[j].properties.byYear);

        //   console.log(paths_data[j].properties.byYear);
        // }

        dispatch.on("statechange.map", function (y) {
          color.domain([
            Math.floor(
              d3.min(paths_data, function (d) {
                return d.properties.byYear[y][0]["count"];
              })
            ),
            Math.ceil(
              d3.max(paths_data, function (d) {
                return d.properties.byYear[y][0]["count"];
              })
            ),
          ]);
          paths
            .transition()
            .duration(800)
            .attr("fill", function (d) {
              return color(d.properties.byYear[y][0]["count"]);
            });
          paths.on("mousemove", function (event, d) {
            //event.pageX
            // console.log("inside mousemove",d)
            // const[x_point, y_point] = d3.pointer(d);
            tooltip.style("left", event.pageX - 230 + "px");
            tooltip.style("top", event.pageY - 650 + "px");
            tooltip.style("display", "inline-block");
            tooltip.html(
              "<b>" +
                d.properties.name +
                "</b><br>#Avg Rent: $" +
                d.properties.byYear[y][0]["count"]
            );
            // var area_name = d.properties.name;
          });
        });
      });

      dispatch.on("load.line", function () {
        var w = 500,
          h = 200;
        var margin = { top: 10, right: 20, bottom: 30, left: 50 },
          width = w - margin.left - margin.right,
          height = h - margin.top - margin.bottom;
        var svg = d3
          .select("body")
          .select("div#map-right")
          .select("div#map-line")
          .append("svg")
          .attr("width", w)
          .attr("height", h);
        var g = svg
          .append("g")
          .attr(
            "transform",
            "translate(" + margin.left + "," + margin.top + ")"
          );
        // var g_temp = svg
        //   .append("g")
        //   .attr(
        //     "transform",
        //     "translate(" + margin.left + "," + margin.top + ")"
        //   );
        g.append("g")
          .attr("transform", "translate(0," + height + ")")
          .attr("class", "xaxis");

        var yg = g.append("g").attr("class", "yaxis");

        yg.append("text")
          .attr("fill", "#000")
          .attr("transform", "rotate(-90)")
          .attr("y", 6)
          .attr("dy", "0.71em")
          .attr("text-anchor", "end")
          .text("#Rent Price");

        yg.append("text")
          .attr("fill", "#000")
          .attr("transform", "rotate(90)")
          .attr("x", 50)
          .attr("y", -width + 2)
          .attr("dy", "0.71em")
          .attr("text-anchor", "end")
          .style("stroke", "orange")
          .text("Safety Score");

        g.append("path")
          .attr("class", "path")
          .attr("fill", "none")
          .attr("stroke", " #800026")
          .attr("stroke-linejoin", "round")
          .attr("stroke-linecap", "round")
          .attr("stroke-width", 1.5);
        // g.append("g")
        //   .attr("fill", "steelblue")
        //   .attr("fill-opacity", 0.8)
        // .selectAll("rect")
        // .data("path")
        // .join("rect")
        //   .attr("x", d => x(d.year))
        //   .attr("width", x.bandwidth())
        //   .attr("y", d => y1(d.sales))
        //   .attr("height", d => y1(0) - y1(d.sales))
        var current_dataset;
        if (selected_area == null) {
          current_dataset = overall_data;
        } else {
          current_dataset = area_data[selected_area][0];
          // console.log(current_dataset);
        }
        dispatch.on("statechange.line", function (y) {
          if (y == "All") {
            // window.addEventListener("resize", drawLine);
            drawLine(current_dataset["CountByMonth"]);
          } else {
            var month_filtered = Object.keys(
              current_dataset["CountByMonth"]
            ).filter(function (key) {
              return key.includes(y);
            });
            var time_subset = {};
            for (var i = 0; i < month_filtered.length; i++) {
              time_subset[month_filtered[i]] =
                current_dataset["CountByMonth"][month_filtered[i]];
            }
            // window.addEventListener("resize", drawLine);
            drawLine(time_subset);
          }
        });
        dispatch.on("areachange.line", function (data) {
          var area;
          if (!data) {
            current_dataset = overall_data;
            // console.log(current_dataset)
            if (selected_year == "All") {
              // window.addEventListener("resize", drawLine);
              drawLine(current_dataset["CountByMonth"]);
            } else {
              var month_filtered = Object.keys(
                current_dataset["CountByMonth"]
              ).filter(function (key) {
                return key.includes(selected_year);
              });
              var time_subset = {};
              for (var i = 0; i < month_filtered.length; i++) {
                time_subset[month_filtered[i]] =
                  current_dataset["CountByMonth"][month_filtered[i]];
              }
              // window.addEventListener("resize", drawLine);
              drawLine(time_subset);
            }
          } else {
            area = data.properties.name;
            current_dataset = area_data[area][0];
            if (selected_year == "All") {
              // window.addEventListener("resize", drawLine);
              drawLine(current_dataset["CountByMonth"]);
            } else {
              month_filtered = Object.keys(
                current_dataset["CountByMonth"]
              ).filter(function (key) {
                return key.includes(selected_year);
              });
              time_subset = {};
              for (i = 0; i < month_filtered.length; i++) {
                time_subset[month_filtered[i]] =
                  current_dataset["CountByMonth"][month_filtered[i]];
              }
              // window.addEventListener("resize", drawLine);
              drawLine(time_subset);
            }
          }
        });

        function drawLine(data) {
          // customized multi time formats
          // var formatMillisecond = d3.timeFormat(".%L"),
          //   formatSecond = d3.timeFormat(":%S"),
          //   formatMinute = d3.timeFormat("%I:%M"),
          //   formatHour = d3.timeFormat("%I %p"),
          //   formatDay = d3.timeFormat("%a %d"),
          //   formatWeek = d3.timeFormat("%b %d"),
          //   formatMonth = d3.timeFormat("%b"),
          //   formatYear = d3.timeFormat("%Y");

          // function multiFormat(date) {
          //   return (d3.timeSecond(date) < date
          //     ? formatMillisecond
          //     : d3.timeMinute(date) < date
          //     ? formatSecond
          //     : d3.timeHour(date) < date
          //     ? formatMinute
          //     : d3.timeDay(date) < date
          //     ? formatHour
          //     : d3.timeMonth(date) < date
          //     ? d3.timeWeek(date) < date
          //       ? formatDay
          //       : formatWeek
          //     : d3.timeYear(date) < date
          //     ? formatMonth
          //     : formatYear)(date);
          // }
          // multiFormat()
          // if ("10/2017" in data) {
          //     delete data["10/2017"];
          // }

          // var parseTime = d3.timeParse("%m/%Y");
          // var parseTime = d3.timeParse("%Y");
          // data = Object.entries(data); // [{key:.., value:..}]
          // console.log(data);
          // data.forEach(function (entry) {
          //   entry["key"] = parseTime(entry["key"]);
          // });

          // data = Object.keys(data).sort();

          // var x = d3.scaleTime()
          //     .domain(d3.extent(data, function (d) { return d['key']; }))
          //     .rangeRound([0, width]);
          // console.log(Object.keys(data));

          var new_data = {};
          // console.log(data);
          data = Object.entries(data);
          data.forEach(function (d) {
            d[0] = d[0].slice(3);
            new_data[d[0]] = d[1];
          });
          // console.log(data1);
          // console.log(new_data);

          data = new_data;

          var x = d3
            .scaleBand()
            .padding(0.1)
            .domain(Object.keys(data))
            .rangeRound([0, width]);

          var y1 = d3
            .scaleLinear()
            .domain(d3.extent(Object.values(data)))
            .rangeRound([height, 0])
            .nice();

          // var y2 = d3.scaleLinear()
          //     .domain(d3.extent(data, function (d) { return d['value']; }))
          //     .rangeRound([height, 0])
          //     .nice();

          g.select("g.xaxis").transition().duration(400).call(d3.axisBottom(x));

          g.select("g.yaxis")
            .transition()
            .duration(400)
            .call(d3.axisLeft(y1).tickFormat(d3.format("$")));

          yg.selectAll("text")
            .style("stroke", "#800026")
            .attr("stroke-width", 0.2);

          data = Object.entries(data);
          // console.log(data);
          // console.log(temp_list);
          // console.log(Object.entries(data));
          g.select("path.path")
            .data([data])
            .transition()
            .duration(400)
            .style("stroke", "#800026")
            .attr(
              "d",
              d3
                .line()
                .x(function (d) {
                  // console.log(x(d[0])+30);
                  return x(d[0]) + 30;
                })
                .y(function (d) {
                  // console.log(y1(d[1]));
                  return y1(d[1]);
                })
            );
        }
      });

      dispatch.on("load.bar", function () {
        var w = 550,
          h = 200;
        // var theData = undefined;

        var margin = { top: 10, right: 20, bottom: 30, left: 100, extra: 50 };
        // width = w - margin.left - margin.right,
        // height = h - margin.top - margin.bottom;

        var x2 = d3.scaleBand().padding(0.1);
        var y2 = d3.scaleLinear();

        var svg2 = d3
          .select("body")
          .select("div#map-right")
          .select("div#map-line")
          .select("svg")
          .attr("width", w)
          .attr("height", h);

        var g2 = svg2
          .append("g")
          .attr(
            "transform",
            "translate(" + margin.extra + "," + margin.top + ")"
          );

        g2.append("g").attr("class", "axis axis--x");

        g2.append("g").attr("class", "axis axis--y");

        var current_dataset;
        if (selected_area == null) {
          current_dataset = bar_overall_data;
        } else {
          current_dataset = bar_area_data[selected_area][0];
        }

        dispatch.on("statechange.bar", function (y) {
          if (y == "All") {
            // window.addEventListener("resize", drawBar);
            drawBar(current_dataset["CountByMonth"]);
          } else {
            var month_filtered = Object.keys(
              current_dataset["CountByMonth"]
            ).filter(function (key) {
              return key.includes(y);
            });
            var time_subset = {};
            for (var i = 0; i < month_filtered.length; i++) {
              time_subset[month_filtered[i]] =
                current_dataset["CountByMonth"][month_filtered[i]];
            }
            // window.addEventListener("resize", drawBar);
            drawBar(time_subset);
          }
        });
        dispatch.on("areachange.bar", function (data1) {
          // console.log("areachange_bar",data1)
          var area;
          if (!data1) {
            current_dataset = bar_overall_data;
            if (selected_year == "All") {
              // window.addEventListener("resize", drawBar);
              drawBar(current_dataset["CountByMonth"]);
            } else {
              var month_filtered = Object.keys(
                current_dataset["CountByMonth"]
              ).filter(function (key) {
                return key.includes(selected_year);
              });
              var time_subset = {};
              for (var i = 0; i < month_filtered.length; i++) {
                time_subset[month_filtered[i]] =
                  current_dataset["CountByMonth"][month_filtered[i]];
              }
              // window.addEventListener("resize", drawBar);
              drawBar(time_subset);
            }
          } else {
            // this.__data__.properties.name
            area = data1.properties.name;
            for (i = 0; i < bar_area_data.length; i++) {
              if (bar_area_data[i]["Area Name"] == area) {
                current_dataset = bar_area_data[i];
              }
            }
            // console.log(current_dataset);
            // current_dataset = bar_area_data[area][0];
            if (selected_year == "All") {
              // window.addEventListener("resize", drawBar);
              drawBar(current_dataset["CountByMonth"]);
            } else {
              month_filtered = Object.keys(
                current_dataset["CountByMonth"]
              ).filter(function (key) {
                return key.includes(selected_year);
              });
              time_subset = {};
              for (i = 0; i < month_filtered.length; i++) {
                time_subset[month_filtered[i]] =
                  current_dataset["CountByMonth"][month_filtered[i]];
              }
              // window.addEventListener("resize", drawBar);
              drawBar(time_subset);
            }
          }
        });

        function drawBar(data1) {
          var bounds = svg2.node().getBoundingClientRect(),
            width = bounds.width - margin.left - margin.right,
            height1 = bounds.height - margin.top - margin.bottom;
          // height = bounds.height - margin.top - margin.bottom;

          // console.log(height1);
          var new_data = {};
          // console.log(data1);
          data1 = Object.entries(data1);
          data1.forEach(function (d) {
            d[0] = d[0].slice(3);
            new_data[d[0]] = d[1];
          });
          // console.log(data1);
          // console.log(new_data);

          data1 = new_data;

          x2.rangeRound([0, width]);
          y2.rangeRound([height1, 0]);

          x2.domain(Object.keys(data1));
          y2.domain([0, d3.max(Object.values(data1))]);

          g2.select(".axis--x")
            .attr("transform", "translate(0," + height + ")")
            .call(d3.axisBottom(x2));

          g2.select(".axis--y")
            .attr("transform", "translate(" + width + ",0)")
            .call(d3.axisRight(y2).tickFormat(d3.format("d")));

          g2.selectAll("text")
            .style("stroke", "orange")
            .attr("stroke-width", 0.2);

          data1 = Object.entries(data1);
          var bars = g2.selectAll(".bar").data(data1);
          // .enter().append("g").attr("class", "bar");

          // ENTER
          bars
            .enter()
            .append("rect")
            .attr("class", "bar")
            .attr("x", function (d) {
              return x2(d[0]);
            })
            .attr("y", function (d) {
              return y2(d[1]);
            })
            .attr("width", x2.bandwidth())
            .attr("height", function (d) {
              return height1 - y2(d[1]);
            });

          // UPDATE
          bars
            .attr("x", function (d) {
              return x2(d[0]);
            })
            .attr("y", function (d) {
              return y2(d[1]);
            })
            .attr("width", x2.bandwidth())
            .attr("height", function (d) {
              return height1 - y2(d[1]);
            });
          // bars
          //   .remove()
          //   .selectAll(".bar")
          //   .data(data1)
          //   .select("rect")
          //   .transition()
          //   .attr("x", function (d) {
          //     console.log(d[0]);
          //     return x2(d[0]);
          //   })
          //   .attr("y", function (d) {
          //     // console.log(d[1]);
          //     return y2(d[1]);
          //   })
          //   .attr("width", x2.bandwidth())
          //   .attr("height", function (d) {
          //     console.log(d[1]);
          //     return height1 - y2(d[1]);
          //   });

          bars.on("mousemove", function (event, d) {
            // const[x_point, y_point] = d3.pointer(d);
            tooltip_bar.style("left", event.pageX - 810 + "px");
            tooltip_bar.style("top", event.pageY - 550 + "px");
            tooltip_bar.style("display", "inline-block");
            tooltip_bar.html(
              "<b>Year: " + d[0] + "</b><br>Safety Score: " + d[1]
            );
          });

          bars.on("mouseout", function () {
            tooltip_bar.style("display", "none");
          });
          // EXIT
          bars.exit().remove();

          // dispatch.on("areachange.areaname", function (area_name) {
          //      d3.select('body')
          //         .select('div#map-right')
          //         .select("div#map-line")
          //         .select("#area_name")
          //         .text(area_name);
          // }

          // var x = d3.scaleTime()
          //     .domain(d3.extent(data, function (d) { return d['key']; }))
          //     .rangeRound([0, width]);
          // var y = d3.scaleLinear()
          //     .domain(d3.extent(data, function (d) { return d['value']; }))
          //     .rangeRound([height, 0])
          //     .nice();
          // var bar = d3.line()
          //     .x(function (d) { return x(d['key']); })
          //     .y(function (d) { return y(d['value']); });
          // g2.select("g.xaxis")
          //     .transition()
          //     .duration(400)
          //     .call(d3.axisBottom(x).tickFormat(multiFormat));
          // g2.select("g.yaxis")
          //     .transition()
          //     .duration(400)
          //     .call(d3.axisLeft(y).tickFormat(d3.format("$")));
          // g2.select("path.path")
          //     .datum(data)
          //     .transition()
          //     .duration(400)
          //     .attr("d", line2);
        }
      });

      dispatch.on("statechange.title", function (y) {
        d3.select("body")
          .select("div#area")
          .select("span#current-area")
          .text(
            (selected_area == null ? "All Divisions" : selected_area) +
              " - " +
              (y == "All" ? "All Times" : y)
          );
      });

      dispatch.on("areachange.title", function (data1) {
        d3.selectAll("path").classed("selected", false);
        if (data1) {
          selected_area = data1.properties.name;
        } else {
          selected_area = null;
        }

        // title on selected area
        d3.select("body")
          .select("div#map-right")
          .select("div#area_name")
          .text(selected_area ? selected_area : "All Neighborhood");
      });

      // function ready(error, geojson, areadata, overall, bar_data, bar_overall) {
      //   if (error) throw error;
      //   overall_data = overall;
      //   bar_overall_data = bar_overall;
      //   area_data = d3
      //     .group(function (d) {
      //       return d["Area Name"];
      //     })
      //     .object(areadata);
      //   // d3
      //   // .nest()
      //   // .key(function (d) {
      //   //   return d["Area Name"];
      //   // })
      //   // .object(areadata);
      //   bar_area_data = bar_data;
      //   console.log(bar_area_data);
      //   var json_features = dataPrep(geojson, areadata);
      //   // var json_features1 = dataPrep1(geojson, bar_data);
      //   // col = ["#67001f","#b2182b","#d6604d","#f4a582","#fddbc7","#f7f7f7","#d1e5f0","#92c5de","#4393c3","#2166ac","#053061"]
      //   var col = [
      //     "#ffffcc",
      //     "#ffeda0",
      //     "#fed976",
      //     "#feb24c",
      //     "#fd8d3c",
      //     "#fc4e2a",
      //     "#e31a1c",
      //     "#bd0026",
      //     "#800026",
      //   ];
      //   color = d3.scaleQuantize().range(col);
      //   // .range(d3.schemeReds[9]);
      //   svg1
      //     .selectAll("path")
      //     .data(json_features)
      //     .enter()
      //     .append("path")
      //     .attr("class", "map")
      //     .attr("d", path)
      //     .on("click", function (d) {
      //       dispatch.call("areachange", this, d);
      //       // dispatch.call("areachange", this, d);
      //       d3.select(this).classed("selected", true);
      //     });
      //   // right part
      //   // line chart
      //   // initLine();

      //   dispatch.call("load", this);
      //   dispatch.call("statechange", this, selected_year);
      // }

      function dataPrep(geojson, areadata) {
        var json_features = geojson.features;
        var crime_count = new Map();
        var year_area_count = [];
        for (var i = 0; i < areadata.length; i++) {
          var total_count = areadata[i]["count"];
          var years = Object.keys(areadata[i]["byYear"]);
          var area = areadata[i]["Area Name"];
          for (var j = 0; j < years.length; j++) {
            var count = areadata[i]["byYear"][years[j]]["count"];
            year_area_count.push({
              year: years[j],
              "Area Name": area,
              count: count,
            });
          }
          year_area_count.push({
            year: "All",
            "Area Name": area,
            count: total_count,
          });
        }
        var nested_data = d3.group(
          year_area_count,
          function (d) {
            return d["Area Name"];
          },
          function (d) {
            return d["year"];
          }
        );
        nested_data = Object.fromEntries(nested_data);
        // .object(year_area_count);
        // d3
        // .nest()
        // .key(function (d) {
        //   return d["Area Name"];
        // })
        // .key(function (d) {
        //   return d["year"];
        // })
        // .object(year_area_count);

        for (i = 0; i < areadata.length; i++) {
          crime_count.set(areadata[i]["Area Name"], +areadata[i].count);
        }
        for (i = 0; i < json_features.length; i++) {
          var cur_id = json_features[i].properties.name;
          if (cur_id in nested_data) {
            nested_data[cur_id] = Object.fromEntries(nested_data[cur_id]);
            json_features[i].properties.byYear = nested_data[cur_id];
          } else {
            var temp = [];
            temp.push({
              year: "All",
              "Area Name": json_features[i].properties.name,
              count: 0,
            });
            var temp2 = { All: temp };
            // console.log(temp2);
            json_features[i].properties.byYear = temp2;
          }
        }
        return json_features;
      }
    },
  },
  mounted: function () {
    // console.log("mounted");
    // console.log("CombinedChart packing", d3.version);
    this.CombinedChart();
  },
};
</script>

<!-- "scoped" attribute limits CSS to this component only -->
<style scoped>
>>> path.map {
  fill-opacity: 0.7;
  stroke: #fff;
  stroke-width: 1px;
}

>>> path.map:hover {
  fill-opacity: 1;
  stroke: #000;
  stroke-width: 1px;
}
>>> path.map.selected {
  fill-opacity: 0.75;
  fill: #000000;
}

>>> .toolTip {
  font-family: "Helvetica Neue", Helvetica, Arial, sans-serif;
  position: absolute;
  display: none;
  width: auto;
  height: auto;
  background: none repeat scroll 0 0 white;
  border: 0 none;
  border-radius: 8px 8px 8px 8px;
  box-shadow: -3px 3px 15px #888888;
  color: black;
  font: 12px sans-serif;
  padding: 5px;
  text-align: center;
}
>>> .line {
  fill: none;
  stroke: steelblue;
  stroke-width: 4px;
}

>>> .axisSteelBlue text {
  fill: steelblue;
}

>>> .axisRed text {
  fill: red;
}

>>> text {
  font-family: sans-serif;
}

>>> .area_text {
  font-family: sans-serif;
}

>>> .bar {
  fill: Orange;
  opacity: 0.4;
}

>>> .bar:hover {
  fill: pink;
}

>>> .axis--x path {
  display: none;
}

>>> .rightAxis {
  fill: #ffffcc;
}

>>> .leftAxis {
  color: #800026;
}

>>> .d3-legend {
  position: absolute;
  fill-opacity: 0.7;
  left: 500px;
  top: 450px;
}
</style>
