<template>
<div id="app">
  <!-- <div class="topnav">
  <a class="active" href="#home">Home</a>
  <a href="#news">News</a>
  <a href="#contact">Contact</a>
  <a href="#about">About</a>
</div> -->
    <div class="topnav">
      <div id="nav">
      <router-link to="/">Home</router-link> 
      <router-link to="/CrimeDataAnalysis">Crime Data Analysis</router-link> 
      <router-link to="/SafetyAndRent">Safety and Rent correlation</router-link> 
      <router-link to="/Overview">Quick Overview</router-link> 
      <router-link to="/about">About Us</router-link>
    </div>
    </div>
    <router-view/>

  </div>
</template>

<style>
#app {
  font-family: Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

#nav {
  padding: 15px;
}

#nav a {
  font-weight: bold;
  color: #ebcda1;
}

#nav a.router-link-exact-active {
  color: #c78119;
}

/* Add a black background color to the top navigation */
.topnav {
  background-color: #333;
  overflow: hidden;
}

/* Style the links inside the navigation bar */
.topnav a {
  float: center;
  color: #f2f2f2;
  text-align: center;
  padding: 0px 18px;
  text-decoration: none;
  font-size: 17px;
}

/* Change the color of links on hover */
.topnav a:hover {
  background-color: rgb(87, 84, 84);
  color: black;
}

/* Add a color to the active/current link */
.topnav a.active {
  background-color: #ebcda1;
  color: white;
}

</style>
