<template>
  <div class="about">
    <div class="jumbotron">
    <div class="row">
      <div class="column">
        <div class="card">
          <img src="../assets/Disha_KC.jpg" alt="Disha" style="width: 100%" />
          <div class="container">
            <h2>Disha K C</h2>
            <p>USC ID: kedigech@usc.edu</p>
            <p>USC NUMBER: 8056024888</p>
            <p><a href="mailto:kedigech@usc.edu"><button class="button">Contact</button></a></p>
          </div>
        </div>
      </div>

      <div class="column">
        <div class="card">
          <img src="../assets/Manan_Rajdev_resized.png" alt="Manan" style="width: 100%" />
          <div class="container">
            <h2>Manan Rajdev</h2>
            <p>USC ID: rajdev@usc.edu</p>
            <p>USC NUMBER: 9967684420</p>
            <p><a href="mailto:rajdev@usc.edu"><button class="button" >Contact</button></a></p>
          </div>
        </div>
      </div>

      <div class="column">
        <div class="card">
          <img src="../assets/Posha.jpeg" alt="Posha" style="width: 100%" />
          <div class="container">
            <h2>Posha Dave</h2>
            <p>USC ID: ppdave@usc.edu</p>
            <p>USC NUMBER: 3705035871</p>
            <p><a href="mailto:ppdave@usc.edu"><button class="button" >Contact</button></a></p>
          </div>
        </div>
      </div>

      <div class="column">
        <div class="card">
          <img src="../assets/Rhushabh.jpeg" alt="Rhushabh" style="width: 100%" />
          <div class="container">
            <h2>Rhushabh Vaghela</h2>
            <p>USC ID: rvaghela@usc.edu</p>
            <p>USC NUMBER: 4281957181</p>
            <p><a href="mailto:rvaghela@usc.edu"><button class="button" >Contact</button></a></p>
          </div>
        </div>
      </div>

    </div>
  </div>
  </div>
</template>
<style scoped>
.about{
  padding: 50px;
}
/* Three columns side by side */
.column {
  float: left;
  width: 25%;
  margin-bottom: 16px;
  padding: 0 8px;
}

/* Display the columns below each other instead of side by side on small screens */
@media screen and (max-width: 650px) {
  .column {
    width: 100%;
    display: block;
  }
}

/* Add some shadows to create a card effect */
.card {
  box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2);
}

/* Some left and right padding inside the container */
.container {
  padding: 0 16px;
}

/* Clear floats */
.container::after, .row::after {
  content: "";
  clear: both;
  display: table;
  /* padding: 10px; */
}

.title {
  color: grey;
}

.button {
  border: none;
  outline: 0;
  display: inline-block;
  padding: 8px;
  color: white;
  background-color: #000;
  text-align: center;
  cursor: pointer;
  width: 100%;
}

.button:hover {
  background-color: #555;
}
</style>