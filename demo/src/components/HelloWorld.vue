<template>
  <div class="hello">
    <br/>
    <h2 style="color:#c78119" >{{ msg }}</h2>
    <h3>Motivation</h3>
    <p>
      Rent prices in urban localities are affected by a number of factors:
      neighborhood, socioeconomic status of the residents, proximity to
      amenities, the quality of schooling, crime rates, etc. Los Angeles, a
      sprawling urban metropolis, thus serves as an ideal candidate for us to
      observe this cause-and-effect relationship at play. A major concern for
      residents and students living within and around the University of Southern
      California Parkside Campus is a comparably high crime rate, and as rent
      paying residents, we are particularly curious about how rent prices in
      this vicinity are impacted by the crime rate.
    </p>
    <!-- <p>
      <a href="https://cli.vuejs.org" target="_blank" rel="noopener">vue-cli documentation</a>.
    </p> -->
    <h3>Datasets</h3>
    <p>
      To understand the crime patterns in Los Angeles and the relationship
      between the rent price and the crime rate, we have used two different
      datasets. 
    </p>
    <h5><a href="https://data.lacity.org/A-Safe-City/Crime-Data-from-2010-to-2019/63jg-8b9z/data" target="_blank">Crime Data</a></h5>
    <p>
      This dataset was made available through the City of Los Angeles, via the
      Office of the Mayor. The data available here was extremely detailed and
      comprehensive and was meticulously kept up to date by the city, i.e. any
      and all reported crime between 2010 and 2019 was logged here and included
      information such as Date and Time of Occurrence, Area, Victim Age/Sex/Race
      Description, Crime Description, Location, Weapon Used, Crime Code etc.
      <br /><br />

      For the intents and purposes of this project, we have used the following attributes:
      <br />
      <table style="width: 100%">
      <tr>
        <th>Attribute</th>
        <th>Description</th>
      </tr>
      <tr>
        <td>Date Of Occurrence</td>
        <td>This states the date of occurrence of a reported crime. This was used to extract the year in which
      the crime was committed and would later be used to merge it with rent
      listings from that same year (within a specified radius).</td>
      </tr>
      <tr>
        <td>Crime Code Description</td>
        <td>This would state the type
      of crime committed for each report logged. There were 141 unique crime
      codes and therefore 141 crime code descriptions. These descriptions would
      later be used to assess the seriousness of each crime.</td>
      </tr>
      <tr>
        <td>Latitude and Longitude</td>
        <td>These variables state the
      latitude and longitude value of each crime reported. They would later be
      utilized to filter crimes occurring within a specified vicinity of a
      reported rent listing.</td>
      </tr>
      <tr>
        <td>Victim Age, Gender and Race</td>
        <td>These variables give a
      brief description of the victim pool. This is extremely useful to conduct
      initial analysis.</td>
      </tr>
      </table>

    </p>

    <h5><a href="https://usc.data.socrata.com/Los-Angeles/Rent-Price-LA-/4a97-v5tx" target="_blank">Rent Data</a></h5>
    <p>
      The dataset, Rent Price LA, prepared by USC Sol Price Center for
      Social Innovation provided median rent price data for the city of Los
      Angeles from the years 2006 to 2016. This dataset included information
      such as Year, Neighborhood, GEOID, Location, Date, Amount, Tract etc. 
      <br/><br/>  
      For this project, the following attributes were chosen: 
      <br/>
      <table style="width: 100%">
      <tr>
        <th>Attribute</th>
        <th>Description</th>
      </tr>
      <tr>
        <td>Amount</td>
        <td>This value was the median gross rent amount in US Dollars of a rental listing in the rent database. 
          The median gross rent used here is the “measure of
          the average level of housing affordability in an area”. </td>
      </tr>
      <tr>
        <td>Year</td>
        <td>This was the year
      of the rental listing. This would be used as a filter to merge with crimes
      that occurred during that year (within a specified vicinity).</td>
      </tr>
      <tr>
        <td>Location</td>
        <td>This variable stored
      the latitude and longitude value of the rental listing. The Latitude and
      Longitude values would be extracted and then used to merge with crime
      occurrences for a given year, if they occurred within a specified radius.</td>
      </tr>
      <tr>
        <td>Neighborhood</td>
        <td>This variable stored the name of the neighborhood for the
      rental listing.</td>
      </tr>
      </table>
    </p>

    <h5>Merging Dataset</h5>
    <p>
      The first task for pre-processing the data was to read the Rent Price LA dataset and extract only the variables needed for the data frame from the available list, i.e. Year, Amount, Location and Neighborhood. 
      Subsequently, the location data was split into two, i.e. Latitude and Longitude, and the Location column was then removed.
    </p>
    <p>
      The next task was to merge the two datasets, by obtaining a list of names of all the 141 unique crime descriptions from the crime data set and adding each as a column to the Rent Price LA data frame. Following this, the datasets were iterated over year by year, starting off with 2010 and ending at 2016. For a given datapoint in the Rent Price LA dataset, a filter of ± 0.005 degrees Latitude and Longitude of the given location was applied for the crime dataset. Iterating over each incident in the crime data subset, the frequency of each type of crime for that rent listing was incremented. Once completed, the data frame now provides a comprehensive view of all crimes in the vicinity of each listing as well as their frequencies. 
      This data frame was saved as an intermediate database to be used for collective analysis.

      Since the crime dataset spanned from 2010 to 2019 and the rent dataset spanned 
      to 2016, the visualization consisting of both datasets span from 2010 to 2016.
    </p>
    <h3>Brief Overview</h3>
    <p>
      We have divided the analysis into three major sections: 
      <table style="width: 100%">
      <tr>
        <th>Page</th>
        <th>Description</th>
      </tr>
      <tr>
        <td><router-link to="/CrimeDataAnalysis">Crime Data Analysis</router-link></td>
        <td>This page has been built to provide the users with a brief overview of the crime and victim patterns by neighborhood. 
      It will allows users to get a high level insights on the crime statistics in Los Angeles. </td>
      </tr>
      <tr>
        <td><router-link to="/SafetyAndRent">Safety and Rent correlation</router-link></td>
        <td>This page allows users to understand the correlation between the safety score and rent over the years from 2010 to 2016 in the neighborhoods of Los Angeles. 
      In general, users can observe that as the safety score increases, the rent increases as well.  The page also describes how the safety score has been calculated.</td>
      </tr>
      <tr>
        <td><router-link to="/Overview">Quick Overview</router-link></td>
        <td>This page has been intended for users who want a quick overview on which neighborhoods to consider for living purposes. 
      It provides the best 10 neighborhoods and worst 10 neighborhoods to live in. It also shows the top 10 safest neighborhoods and top 10 most dangerous neighborhoods.</td>
      </tr>
      <router-view/>
      </table>
      <!-- <br /> 
      <span> <b> 1) Crime Data Analysis: </b> </span> This page has been built to provide the users with a brief overview of the crime and victim patterns by neighborhood. 
      It will allows users to get a high level insights on the crime statistics in Los Angeles. 
      <br />
      <span> <b> 2) Safety and Rent Correlation: </b> </span> This page allows users to understand the correlation between the safety score and rent over the years from 2010 to 2016 in the neighborhoods of Los Angeles. 
      In general, users can observe that as the safety score increases, the rent increases as well.  The page also describes how the safety score has been calculated.
      <br />
      <span> <b> 3) Quick Overview: </b> </span> This page has been intended for users who want a quick overview on which neighborhoods to consider for living purposes. 
      It provides the best 10 neighborhoods and worst 10 neighborhoods to live in. It also shows the top 10 safest neighborhoods and top 10 most dangerous neighborhoods. -->
    </p>
    <h3>Conclusion</h3>
    <p>
      We were inspired to create this tool that friends, family, and other people who want to become more aware of their safety situation could use. Through this application, our hope is that users can get a much more clear picture regarding the crime and rent in Los Angeles. 
      This will definitely be more helpful for international students/new residents looking to move to Los Angeles.
    </p>
  </div>
</template>

<script>
export default {
  name: "HelloWorld",
  props: {
    msg: String,
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #2c3e50;
  text-decoration-line: underline;
}
table,
th,
td {
  border: 1px solid black;
  border-collapse: collapse;
}
th,
td {
  padding: 15px;
  text-align: left;
}
</style>
