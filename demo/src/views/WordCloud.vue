<template>
  <div class="WordCloud">
    <div class="jumbotron">
      <h4>Know the Neighborhoods of LA!</h4>
      <br />
      <p>
        To understand various neighborhoods of Los Angeles, four criterions were
        selected and a word cloud was built using the top 10 neighborhoods.
        Through this, we can directly check the best ten and worst ten
        neighborhoos to live in as well as the safest ten and most dangerous ten
        neighborhoods to live in. The best neighborhoods represent the lowest
        rent and lowest crime rates and the worst represent the highest rent and
        highest crime rate areas. The safe neighborhoods are the neighborhoods
        with the lowest crime rates and dangerous neighborhoods are the
        neighborhoods with the highest crime rates. Moreover, an option of
        selecting the information per year has also been included.
      </p>
      <p>
        * Select a year from drop down menu and select the options from the
        buttons to get the desired results
      </p>
      <b
        >YEAR:
        <select id="selectButton"></select>
      </b>
      <div class="commands">
        <br />
        <span class="button" id="best">Best 10 Neighborhood</span>
        <span class="button" id="worst">Worst 10 Neighborhood</span>
        <span class="button" id="safest">Safest 10 Neighborhood</span>
        <span class="button" id="unsafe">Dangerous 10 Neighborhood</span>
      </div>
      <br />
      <svg id="word_cloud"></svg>
    </div>
  </div>
</template>
<!--<script src="d3.layout.cloud.js"></script>
<script src="https://rawgit.com/jasondavies/d3-cloud/master/build/d3.layout.cloud.js"></script> -->
<script>
import * as d3 from "d3";
import * as cloud from "d3-cloud";

// cloud = require("d3-cloud")
("WordCloud");
export default {
  name: "WordCloud",
  data: function () {
    return {
      WordCloudData: null,
    };
  },
  methods: {
    main_function() {
      //Simple animated example of d3-cloud - https://github.com/jasondavies/d3-cloud
      //Based on https://github.com/jasondavies/d3-cloud/blob/master/examples/simple.html

      // Encapsulate the word cloud functionality
      function wordCloud(selector) {
        // var fill = d3.scaleOrdinal(d3.schemeCategory10);
        // ["red", "green", "blue", "#6b486b", "#a05d56", "#d0743c", "#ff8c00"]
        var fill = d3
          .scaleOrdinal()
          .range([
            "#8c510a",
            "#bf812d",
            "#dfc27d",
            "#fdae61",
            "#f46d43",
            "#b35806",
            "#80cdc1",
            "#35978f",
            "#01665e",
          ]);

        //Construct the word cloud's SVG element
        var width = 1000;
        var height = 1000;
        var svg = d3
          .select(selector)
          .select("#word_cloud")
          // .attr("x", 300)
          // .attr("y", 1000)
          // .attr("width", 600)
          // .attr("height", 600)
          .attr(
            "viewBox",
            "0 0 " + Math.min(width, height) + " " + Math.min(width, height)
          )
          // .attr('preserveAspectRatio','xMinYMin')
          // .attr("viewbox", `0 0 600 600`)
          .append("g")
          .attr(
            "transform",
            "translate(" + width / 2 + "," + (height / 2 - 180) + ")"
          );
        // .attr("transform", "translate(500,300)");

        var allGroup = [
          "all",
          "2010",
          "2011",
          "2012",
          "2013",
          "2014",
          "2015",
          "2016",
        ];

        // add the options to the button
        d3.select("#selectButton")
          .selectAll("myOptions")
          .data(allGroup)
          .enter()
          .append("option")
          .text(function (d) {
            return d;
          }) // text showed in the menu
          .attr("value", function (d) {
            return d;
          }); // corresponding value returned by the button

        function toggle(id) {
          d3.selectAll(".button").style("background-color", "#ddd");
          d3.select(id).style("background-color", "#fdae6b");
        }

        toggle("#best");
        d3.select("#selectButton").on("change", function () {
          var selectedOption = d3.select(this).property("value");
          showNewWords(myWordCloud, selectedOption, 0);
          toggle("#best");
        });

        //🚧  implement click events to sort temperature and gravity here
        d3.select("#best").on("click", () => {
          var selectedOption = d3.select("#selectButton").property("value");
          showNewWords(myWordCloud, selectedOption, 0);
          toggle("#best");
        });
        d3.select("#worst").on("click", () => {
          var selectedOption = d3.select("#selectButton").property("value");
          showNewWords(myWordCloud, selectedOption, 1);
          toggle("#worst");
        });

        //🚧  implement click events to sort temperature and gravity here
        d3.select("#safest").on("click", () => {
          var selectedOption = d3.select("#selectButton").property("value");
          showNewWords(myWordCloud, selectedOption, 2);
          toggle("#safest");
        });
        d3.select("#unsafe").on("click", () => {
          var selectedOption = d3.select("#selectButton").property("value");
          showNewWords(myWordCloud, selectedOption, 3);
          toggle("#unsafe");
        });

        //Draw the word cloud
        function draw(words) {
          // console.log("Draw", words);
          var cloud1 = svg.selectAll("g text").data(words, function (d) {
            return d.text;
          });

          //Entering words
          cloud1
            .enter()
            .append("text")
            .style("font-family", "Impact")
            .style("fill", function (d, i) {
              return fill(i);
            })
            .attr("text-anchor", "middle")
            .style("font-size", function (d) {
              return d.size + "px";
            })
            .attr("transform", function (d) {
              return (
                "translate(" + [d.x + 10, d.y] + ")rotate(" + d.rotate + ")"
              );
            })
            .text(function (d) {
              return d.text;
            });

          //Entering and existing words
          cloud1
            .transition()
            .duration(600)
            .style("font-size", function (d) {
              return d.size + "px";
            })
            .attr("text-anchor", "middle")
            .attr("transform", function (d) {
              return (
                "translate(" + [d.x + 10, d.y] + ")rotate(" + d.rotate + ")"
              ); //d.rotate
            })
            .style("fill-opacity", 1);

          //Exiting words
          cloud1
            .exit()
            .transition()
            .duration(200)
            .style("fill-opacity", 1e-6)
            .attr("font-size", 30)
            .remove();
        }

        //Use the module pattern to encapsulate the visualisation code. We'll
        // expose only the parts that need to be public.
        return {
          //Recompute the word cloud for a new set of words. This method will
          // asycnhronously call draw when the layout has been computed.
          //The outside world will need to call this function, so make it part
          // of the wordCloud return value.
          update: function (words) {
            // console.log("Update", words);
            // console.log("Update", cloud().words(words));
            cloud()
              .size([600, 600])
              .words(words)
              // .padding(2)
              .font("Impact")
              .rotate(function () {
                return ~~(Math.random() * 2) * 90;
              })
              .fontSize(function (d) {
                return d.size;
              })
              .on("end", draw)
              .start();

            // cloud().stop();
          },
        };
      }

      var data = {
        all: [
          "Long_Beach Long_Beach Long_Beach Long_Beach Long_Beach Long_Beach Long_Beach Long_Beach Long_Beach Long_Beach Covina Covina Covina Covina Covina Covina Covina Covina Covina Azusa Azusa Azusa Azusa Azusa Azusa Azusa Azusa Glendale Glendale Glendale Glendale Glendale Glendale Glendale Santa_Monica Santa_Monica Santa_Monica Santa_Monica Santa_Monica Santa_Monica Inglewood Inglewood Inglewood Inglewood Inglewood Burbank Burbank Burbank Burbank Beverly_Hills Beverly_Hills Beverly_Hills Pasadena Pasadena Lynwood",
          "Downtown Downtown Downtown Downtown Downtown Downtown Downtown Downtown Downtown Downtown Westlake Westlake Westlake Westlake Westlake Westlake Westlake Westlake Westlake Hollywood Hollywood Hollywood Hollywood Hollywood Hollywood Hollywood Hollywood Vermont_Knolls Vermont_Knolls Vermont_Knolls Vermont_Knolls Vermont_Knolls Vermont_Knolls Vermont_Knolls Koreatown Koreatown Koreatown Koreatown Koreatown Koreatown Pico-Union Pico-Union Pico-Union Pico-Union Pico-Union Vermont-Slauson Vermont-Slauson Vermont-Slauson Vermont-Slauson Florence Florence Florence Vermont_Vista Vermont_Vista Baldwin_Hills/Crenshaw",
          "Lynwood Lynwood Lynwood Lynwood Lynwood Lynwood Lynwood Lynwood Lynwood Lynwood Azusa Azusa Azusa Azusa Azusa Azusa Azusa Azusa Azusa La_Mirada La_Mirada La_Mirada La_Mirada La_Mirada La_Mirada La_Mirada La_Mirada Rosemead Rosemead Rosemead Rosemead Rosemead Rosemead Rosemead Del_Aire Del_Aire Del_Aire Del_Aire Del_Aire Del_Aire Covina Covina Covina Covina Covina Quartz_Hill Quartz_Hill Quartz_Hill Quartz_Hill Altadena Altadena Altadena Athens Athens Claremont",
          "Westlake Westlake Westlake Westlake Westlake Westlake Westlake Westlake Westlake Westlake Koreatown Koreatown Koreatown Koreatown Koreatown Koreatown Koreatown Koreatown Koreatown Downtown Downtown Downtown Downtown Downtown Downtown Downtown Downtown Hollywood Hollywood Hollywood Hollywood Hollywood Hollywood Hollywood East_Hollywood East_Hollywood East_Hollywood East_Hollywood East_Hollywood East_Hollywood Florence Florence Florence Florence Florence Pico-Union Pico-Union Pico-Union Pico-Union Boyle_Heights Boyle_Heights Boyle_Heights Van_Nuys Van_Nuys Historic_South-Central",
        ],
        2010: [
          "Azusa Azusa Azusa Azusa Azusa Azusa Azusa Azusa Azusa Azusa Inglewood Inglewood Inglewood Inglewood Inglewood Inglewood Inglewood Inglewood Inglewood Santa_Monica Santa_Monica Santa_Monica Santa_Monica Santa_Monica Santa_Monica Santa_Monica Santa_Monica Lynwood Lynwood Lynwood Lynwood Lynwood Lynwood Lynwood Long_Beach Long_Beach Long_Beach Long_Beach Long_Beach Long_Beach Lomita Lomita Lomita Lomita Lomita Pasadena Pasadena Pasadena Pasadena Torrance Torrance Torrance Paramount Paramount Whittier",
          "Downtown Downtown Downtown Downtown Downtown Downtown Downtown Downtown Downtown Downtown Westlake Westlake Westlake Westlake Westlake Westlake Westlake Westlake Westlake Hollywood Hollywood Hollywood Hollywood Hollywood Hollywood Hollywood Hollywood Florence Florence Florence Florence Florence Florence Florence Pico-Union Pico-Union Pico-Union Pico-Union Pico-Union Pico-Union Baldwin_Hills/Crenshaw Baldwin_Hills/Crenshaw Baldwin_Hills/Crenshaw Baldwin_Hills/Crenshaw Baldwin_Hills/Crenshaw Broadway-Manchester Broadway-Manchester Broadway-Manchester Broadway-Manchester South_Park South_Park South_Park Vermont_Square Vermont_Square Central-Alameda",
          "Lynwood Lynwood Lynwood Lynwood Lynwood Lynwood Lynwood Lynwood Lynwood Lynwood Azusa Azusa Azusa Azusa Azusa Azusa Azusa Azusa Azusa Lomita Lomita Lomita Lomita Lomita Lomita Lomita Lomita Torrance Torrance Torrance Torrance Torrance Torrance Torrance La_Puente La_Puente La_Puente La_Puente La_Puente La_Puente Paramount Paramount Paramount Paramount Paramount Whittier Whittier Whittier Whittier Santa_Fe_Springs Santa_Fe_Springs Santa_Fe_Springs Avalon Avalon Pasadena",
          "Westlake Westlake Westlake Westlake Westlake Westlake Westlake Westlake Westlake Westlake Koreatown Koreatown Koreatown Koreatown Koreatown Koreatown Koreatown Koreatown Koreatown Hollywood Hollywood Hollywood Hollywood Hollywood Hollywood Hollywood Hollywood Downtown Downtown Downtown Downtown Downtown Downtown Downtown Florence Florence Florence Florence Florence Florence East_Hollywood East_Hollywood East_Hollywood East_Hollywood East_Hollywood Pico-Union Pico-Union Pico-Union Pico-Union Boyle_Heights Boyle_Heights Boyle_Heights Van_Nuys Van_Nuys Historic_South-Central",
        ],
        2011: [
          "Pasadena Pasadena Pasadena Pasadena Pasadena Pasadena Pasadena Pasadena Pasadena Pasadena Downey Downey Downey Downey Downey Downey Downey Downey Downey Santa_Monica Santa_Monica Santa_Monica Santa_Monica Santa_Monica Santa_Monica Santa_Monica Santa_Monica Quartz_Hill Quartz_Hill Quartz_Hill Quartz_Hill Quartz_Hill Quartz_Hill Quartz_Hill Long_Beach Long_Beach Long_Beach Long_Beach Long_Beach Long_Beach Claremont Claremont Claremont Claremont Claremont Burbank Burbank Burbank Burbank Culver_City Culver_City Culver_City Duarte Duarte Avalon",
          "Downtown Downtown Downtown Downtown Downtown Downtown Downtown Downtown Downtown Downtown Westlake Westlake Westlake Westlake Westlake Westlake Westlake Westlake Westlake Hollywood Hollywood Hollywood Hollywood Hollywood Hollywood Hollywood Hollywood Pico-Union Pico-Union Pico-Union Pico-Union Pico-Union Pico-Union Pico-Union Vermont_Knolls Vermont_Knolls Vermont_Knolls Vermont_Knolls Vermont_Knolls Vermont_Knolls Florence Florence Florence Florence Florence South_Park South_Park South_Park South_Park Central-Alameda Central-Alameda Central-Alameda Baldwin_Hills/Crenshaw Baldwin_Hills/Crenshaw Exposition_Park",
          "Claremont Claremont Claremont Claremont Claremont Claremont Claremont Claremont Claremont Claremont Duarte Duarte Duarte Duarte Duarte Duarte Duarte Duarte Duarte Quartz_Hill Quartz_Hill Quartz_Hill Quartz_Hill Quartz_Hill Quartz_Hill Quartz_Hill Quartz_Hill Avalon Avalon Avalon Avalon Avalon Avalon Avalon La_Puente La_Puente La_Puente La_Puente La_Puente La_Puente Carson Carson Carson Carson Carson Santa_Fe_Springs Santa_Fe_Springs Santa_Fe_Springs Santa_Fe_Springs Huntington_Park Huntington_Park Huntington_Park Downey Downey Pasadena",
          "Westlake Westlake Westlake Westlake Westlake Westlake Westlake Westlake Westlake Westlake Koreatown Koreatown Koreatown Koreatown Koreatown Koreatown Koreatown Koreatown Koreatown Hollywood Hollywood Hollywood Hollywood Hollywood Hollywood Hollywood Hollywood Downtown Downtown Downtown Downtown Downtown Downtown Downtown East_Hollywood East_Hollywood East_Hollywood East_Hollywood East_Hollywood East_Hollywood Pico-Union Pico-Union Pico-Union Pico-Union Pico-Union Florence Florence Florence Florence Boyle_Heights Boyle_Heights Boyle_Heights Van_Nuys Van_Nuys South_Park",
        ],
        2012: [
          "Covina Covina Covina Covina Covina Covina Covina Covina Covina Covina Long_Beach Long_Beach Long_Beach Long_Beach Long_Beach Long_Beach Long_Beach Long_Beach Long_Beach Beverly_Hills Beverly_Hills Beverly_Hills Beverly_Hills Beverly_Hills Beverly_Hills Beverly_Hills Beverly_Hills Pasadena Pasadena Pasadena Pasadena Pasadena Pasadena Pasadena Bellflower Bellflower Bellflower Bellflower Bellflower Bellflower Lancaster Lancaster Lancaster Lancaster Lancaster Inglewood Inglewood Inglewood Inglewood West_Carson West_Carson West_Carson East_Los_Angeles East_Los_Angeles Huntington_Park",
          "Downtown Downtown Downtown Downtown Downtown Downtown Downtown Downtown Downtown Downtown Westlake Westlake Westlake Westlake Westlake Westlake Westlake Westlake Westlake Vermont_Knolls Vermont_Knolls Vermont_Knolls Vermont_Knolls Vermont_Knolls Vermont_Knolls Vermont_Knolls Vermont_Knolls Hollywood Hollywood Hollywood Hollywood Hollywood Hollywood Hollywood Pico-Union Pico-Union Pico-Union Pico-Union Pico-Union Pico-Union Vermont-Slauson Vermont-Slauson Vermont-Slauson Vermont-Slauson Vermont-Slauson Baldwin_Hills/Crenshaw Baldwin_Hills/Crenshaw Baldwin_Hills/Crenshaw Baldwin_Hills/Crenshaw Broadway-Manchester Broadway-Manchester Broadway-Manchester Koreatown Koreatown Florence",
          "West_Carson West_Carson West_Carson West_Carson West_Carson West_Carson West_Carson West_Carson West_Carson West_Carson Lancaster Lancaster Lancaster Lancaster Lancaster Lancaster Lancaster Lancaster Lancaster Huntington_Park Huntington_Park Huntington_Park Huntington_Park Huntington_Park Huntington_Park Huntington_Park Huntington_Park Covina Covina Covina Covina Covina Covina Covina Pasadena Pasadena Pasadena Pasadena Pasadena Pasadena Bellflower Bellflower Bellflower Bellflower Bellflower South_Gate South_Gate South_Gate South_Gate Altadena Altadena Altadena Monterey_Park Monterey_Park Bel-Air",
          "Westlake Westlake Westlake Westlake Westlake Westlake Westlake Westlake Westlake Westlake Koreatown Koreatown Koreatown Koreatown Koreatown Koreatown Koreatown Koreatown Koreatown Downtown Downtown Downtown Downtown Downtown Downtown Downtown Downtown Hollywood Hollywood Hollywood Hollywood Hollywood Hollywood Hollywood East_Hollywood East_Hollywood East_Hollywood East_Hollywood East_Hollywood East_Hollywood Florence Florence Florence Florence Florence Pico-Union Pico-Union Pico-Union Pico-Union Boyle_Heights Boyle_Heights Boyle_Heights Van_Nuys Van_Nuys Panorama_City",
        ],
        2013: [
          "Glendale Glendale Glendale Glendale Glendale Glendale Glendale Glendale Glendale Glendale Santa_Monica Santa_Monica Santa_Monica Santa_Monica Santa_Monica Santa_Monica Santa_Monica Santa_Monica Santa_Monica Bellflower Bellflower Bellflower Bellflower Bellflower Bellflower Bellflower Bellflower Paramount Paramount Paramount Paramount Paramount Paramount Paramount Bell_Gardens Bell_Gardens Bell_Gardens Bell_Gardens Bell_Gardens Bell_Gardens Del_Aire Del_Aire Del_Aire Del_Aire Del_Aire Pico_Rivera Pico_Rivera Pico_Rivera Pico_Rivera Torrance Torrance Torrance Burbank Burbank Long_Beach",
          "Downtown Downtown Downtown Downtown Downtown Downtown Downtown Downtown Downtown Downtown Westlake Westlake Westlake Westlake Westlake Westlake Westlake Westlake Westlake Hollywood Hollywood Hollywood Hollywood Hollywood Hollywood Hollywood Hollywood Pico-Union Pico-Union Pico-Union Pico-Union Pico-Union Pico-Union Pico-Union Vermont_Knolls Vermont_Knolls Vermont_Knolls Vermont_Knolls Vermont_Knolls Vermont_Knolls Vermont-Slauson Vermont-Slauson Vermont-Slauson Vermont-Slauson Vermont-Slauson Broadway-Manchester Broadway-Manchester Broadway-Manchester Broadway-Manchester Baldwin_Hills/Crenshaw Baldwin_Hills/Crenshaw Baldwin_Hills/Crenshaw Florence Florence Vermont_Square",
          "Paramount Paramount Paramount Paramount Paramount Paramount Paramount Paramount Paramount Paramount Pico_Rivera Pico_Rivera Pico_Rivera Pico_Rivera Pico_Rivera Pico_Rivera Pico_Rivera Pico_Rivera Pico_Rivera Del_Aire Del_Aire Del_Aire Del_Aire Del_Aire Del_Aire Del_Aire Del_Aire Torrance Torrance Torrance Torrance Torrance Torrance Torrance Bellflower Bellflower Bellflower Bellflower Bellflower Bellflower Bell_Gardens Bell_Gardens Bell_Gardens Bell_Gardens Bell_Gardens West_Carson West_Carson West_Carson West_Carson Pomona Pomona Pomona Claremont Claremont Norwalk",
          "Westlake Westlake Westlake Westlake Westlake Westlake Westlake Westlake Westlake Westlake Koreatown Koreatown Koreatown Koreatown Koreatown Koreatown Koreatown Koreatown Koreatown Hollywood Hollywood Hollywood Hollywood Hollywood Hollywood Hollywood Hollywood Downtown Downtown Downtown Downtown Downtown Downtown Downtown East_Hollywood East_Hollywood East_Hollywood East_Hollywood East_Hollywood East_Hollywood Pico-Union Pico-Union Pico-Union Pico-Union Pico-Union Florence Florence Florence Florence Van_Nuys Van_Nuys Van_Nuys Boyle_Heights Boyle_Heights Panorama_City",
        ],
        2014: [
          "Long_Beach Long_Beach Long_Beach Long_Beach Long_Beach Long_Beach Long_Beach Long_Beach Long_Beach Long_Beach Burbank Burbank Burbank Burbank Burbank Burbank Burbank Burbank Burbank Downey Downey Downey Downey Downey Downey Downey Downey La_Mirada La_Mirada La_Mirada La_Mirada La_Mirada La_Mirada La_Mirada Rosemead Rosemead Rosemead Rosemead Rosemead Rosemead Santa_Monica Santa_Monica Santa_Monica Santa_Monica Santa_Monica Beverly_Hills Beverly_Hills Beverly_Hills Beverly_Hills Avalon Avalon Avalon Florence-Firestone Florence-Firestone Lopez/Kagel_Canyons",
          "Downtown Downtown Downtown Downtown Downtown Downtown Downtown Downtown Downtown Downtown Westlake Westlake Westlake Westlake Westlake Westlake Westlake Westlake Westlake Hollywood Hollywood Hollywood Hollywood Hollywood Hollywood Hollywood Hollywood Vermont_Knolls Vermont_Knolls Vermont_Knolls Vermont_Knolls Vermont_Knolls Vermont_Knolls Vermont_Knolls Vermont-Slauson Vermont-Slauson Vermont-Slauson Vermont-Slauson Vermont-Slauson Vermont-Slauson Koreatown Koreatown Koreatown Koreatown Koreatown Vermont_Vista Vermont_Vista Vermont_Vista Vermont_Vista Baldwin_Hills/Crenshaw Baldwin_Hills/Crenshaw Baldwin_Hills/Crenshaw Broadway-Manchester Broadway-Manchester Vermont_Square",
          "La_Mirada La_Mirada La_Mirada La_Mirada La_Mirada La_Mirada La_Mirada La_Mirada La_Mirada La_Mirada Rosemead Rosemead Rosemead Rosemead Rosemead Rosemead Rosemead Rosemead Rosemead Avalon Avalon Avalon Avalon Avalon Avalon Avalon Avalon Lopez/Kagel_Canyons Lopez/Kagel_Canyons Lopez/Kagel_Canyons Lopez/Kagel_Canyons Lopez/Kagel_Canyons Lopez/Kagel_Canyons Lopez/Kagel_Canyons Torrance Torrance Torrance Torrance Torrance Torrance Athens Athens Athens Athens Athens Bellflower Bellflower Bellflower Bellflower West_Compton West_Compton West_Compton Topanga Topanga La_Puente",
          "Westlake Westlake Westlake Westlake Westlake Westlake Westlake Westlake Westlake Westlake Koreatown Koreatown Koreatown Koreatown Koreatown Koreatown Koreatown Koreatown Koreatown Downtown Downtown Downtown Downtown Downtown Downtown Downtown Downtown Hollywood Hollywood Hollywood Hollywood Hollywood Hollywood Hollywood East_Hollywood East_Hollywood East_Hollywood East_Hollywood East_Hollywood East_Hollywood Pico-Union Pico-Union Pico-Union Pico-Union Pico-Union Florence Florence Florence Florence Van_Nuys Van_Nuys Van_Nuys Boyle_Heights Boyle_Heights Vermont-Slauson",
        ],
        2015: [
          "Culver_City Culver_City Culver_City Culver_City Culver_City Culver_City Culver_City Culver_City Culver_City Culver_City Glendale Glendale Glendale Glendale Glendale Glendale Glendale Glendale Glendale Alhambra Alhambra Alhambra Alhambra Alhambra Alhambra Alhambra Alhambra Chatsworth Chatsworth Chatsworth Chatsworth Chatsworth Chatsworth Chatsworth Ladera_Heights Ladera_Heights Ladera_Heights Ladera_Heights Ladera_Heights Ladera_Heights Torrance Torrance Torrance Torrance Torrance Lake_View_Terrace Lake_View_Terrace Lake_View_Terrace Lake_View_Terrace Beverly_Hills Beverly_Hills Beverly_Hills Burbank Burbank Shadow_Hills",
          "Downtown Downtown Downtown Downtown Downtown Downtown Downtown Downtown Downtown Downtown Westlake Westlake Westlake Westlake Westlake Westlake Westlake Westlake Westlake Hollywood Hollywood Hollywood Hollywood Hollywood Hollywood Hollywood Hollywood Vermont_Knolls Vermont_Knolls Vermont_Knolls Vermont_Knolls Vermont_Knolls Vermont_Knolls Vermont_Knolls Koreatown Koreatown Koreatown Koreatown Koreatown Koreatown Pico-Union Pico-Union Pico-Union Pico-Union Pico-Union Florence Florence Florence Florence Exposition_Park Exposition_Park Exposition_Park Vermont_Vista Vermont_Vista Vermont-Slauson",
          "Alhambra Alhambra Alhambra Alhambra Alhambra Alhambra Alhambra Alhambra Alhambra Alhambra Torrance Torrance Torrance Torrance Torrance Torrance Torrance Torrance Torrance Ladera_Heights Ladera_Heights Ladera_Heights Ladera_Heights Ladera_Heights Ladera_Heights Ladera_Heights Ladera_Heights Chatsworth_Reservoir Chatsworth_Reservoir Chatsworth_Reservoir Chatsworth_Reservoir Chatsworth_Reservoir Chatsworth_Reservoir Chatsworth_Reservoir Carson Carson Carson Carson Carson Carson El_Segundo El_Segundo El_Segundo El_Segundo El_Segundo Burbank Burbank Burbank Burbank Bel-Air Bel-Air Bel-Air View_Park-Windsor_Hills View_Park-Windsor_Hills Veterans_Administration",
          "Westlake Westlake Westlake Westlake Westlake Westlake Westlake Westlake Westlake Westlake Koreatown Koreatown Koreatown Koreatown Koreatown Koreatown Koreatown Koreatown Koreatown Downtown Downtown Downtown Downtown Downtown Downtown Downtown Downtown Hollywood Hollywood Hollywood Hollywood Hollywood Hollywood Hollywood East_Hollywood East_Hollywood East_Hollywood East_Hollywood East_Hollywood East_Hollywood Florence Florence Florence Florence Florence Pico-Union Pico-Union Pico-Union Pico-Union Van_Nuys Van_Nuys Van_Nuys Boyle_Heights Boyle_Heights North_Hollywood",
        ],
        2016: [
          "Glendale Glendale Glendale Glendale Glendale Glendale Glendale Glendale Glendale Glendale Shadow_Hills Shadow_Hills Shadow_Hills Shadow_Hills Shadow_Hills Shadow_Hills Shadow_Hills Shadow_Hills Shadow_Hills Burbank Burbank Burbank Burbank Burbank Burbank Burbank Burbank Inglewood Inglewood Inglewood Inglewood Inglewood Inglewood Inglewood East_Los_Angeles East_Los_Angeles East_Los_Angeles East_Los_Angeles East_Los_Angeles East_Los_Angeles Lopez/Kagel_Canyons Lopez/Kagel_Canyons Lopez/Kagel_Canyons Lopez/Kagel_Canyons Lopez/Kagel_Canyons Torrance Torrance Torrance Torrance Brentwood Brentwood Brentwood El_Segundo El_Segundo Ladera_Heights",
          "Downtown Downtown Downtown Downtown Downtown Downtown Downtown Downtown Downtown Downtown Westlake Westlake Westlake Westlake Westlake Westlake Westlake Westlake Westlake Hollywood Hollywood Hollywood Hollywood Hollywood Hollywood Hollywood Hollywood Vermont_Knolls Vermont_Knolls Vermont_Knolls Vermont_Knolls Vermont_Knolls Vermont_Knolls Vermont_Knolls Koreatown Koreatown Koreatown Koreatown Koreatown Koreatown Pico-Union Pico-Union Pico-Union Pico-Union Pico-Union Florence Florence Florence Florence Vermont_Vista Vermont_Vista Vermont_Vista Vermont-Slauson Vermont-Slauson Baldwin_Hills/Crenshaw",
          "Lopez/Kagel_Canyons Lopez/Kagel_Canyons Lopez/Kagel_Canyons Lopez/Kagel_Canyons Lopez/Kagel_Canyons Lopez/Kagel_Canyons Lopez/Kagel_Canyons Lopez/Kagel_Canyons Lopez/Kagel_Canyons Lopez/Kagel_Canyons Torrance Torrance Torrance Torrance Torrance Torrance Torrance Torrance Torrance Alhambra Alhambra Alhambra Alhambra Alhambra Alhambra Alhambra Alhambra Ladera_Heights Ladera_Heights Ladera_Heights Ladera_Heights Ladera_Heights Ladera_Heights Ladera_Heights El_Segundo El_Segundo El_Segundo El_Segundo El_Segundo El_Segundo Chatsworth_Reservoir Chatsworth_Reservoir Chatsworth_Reservoir Chatsworth_Reservoir Chatsworth_Reservoir Burbank Burbank Burbank Burbank Carson Carson Carson Bel-Air Bel-Air Beverly_Crest",
          "Westlake Westlake Westlake Westlake Westlake Westlake Westlake Westlake Westlake Westlake Koreatown Koreatown Koreatown Koreatown Koreatown Koreatown Koreatown Koreatown Koreatown Downtown Downtown Downtown Downtown Downtown Downtown Downtown Downtown Hollywood Hollywood Hollywood Hollywood Hollywood Hollywood Hollywood Florence Florence Florence Florence Florence Florence Boyle_Heights Boyle_Heights Boyle_Heights Boyle_Heights Boyle_Heights East_Hollywood East_Hollywood East_Hollywood East_Hollywood Pico-Union Pico-Union Pico-Union Van_Nuys Van_Nuys Historic_South-Central",
        ],
      };

      //Prepare one of the sample sentences by removing punctuation,
      // creating an array of words and computing a random size attribute.
      function getWords(selectedOption, i) {
        // console.log(selectedOption)
        // console.log(i)
        // console.log(d3.rollups(words[selectedOption][i].split(" "), v => v.length, d => d).sort(([, a], [, b]) => d3.descending(a, b)).slice(0, 250))
        return d3
          .rollups(
            data[selectedOption][i].split(" "),
            (group) => group.length * 4 + 15,
            (w) => w
          )
          .sort(([, a], [, b]) => d3.descending(a, b))
          .slice(0, 250)
          .map(([text, size]) => ({ text, size }));
      }

      //This method tells the word cloud to redraw with a new set of words.
      //In reality the new words would probably come from a server request,
      // user input or some other source.
      function showNewWords(vis, selectedOption, i) {
        // var j = function b(val){
        //           return (val==null || val===false);
        //       }
        // i = i || 0;
        vis.update(getWords(selectedOption, i));
      }

      //Create a new instance of the word cloud visualisation.
      var myWordCloud = wordCloud("body");
      showNewWords(myWordCloud, "all", 0);
    },
  },
  mounted: function () {
    // console.log("mounted");
    // console.log("WordCloud ", d3.version);
    this.main_function();
  },
};
</script>

<!-- "scoped" attribute limits CSS to this component only -->
<style scoped>
>>> .button {
  border-radius: 3px;
  background-color: #fdd49e;
  padding: 5px;
  margin: 5px;
  color: #444;
  display: inline-block;
  cursor: default;
}

>>> div.commands {
  font-family: Courier;
  font-size: 0.85em;
  font-weight: bold;
  text-align: center;
  cursor: default;
  user-select: none;
}
</style>
