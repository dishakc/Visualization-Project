# TRANSCRIPT

Topic: **Less Crime, More Dime**

Team name: The Vizards

Team members:

- Disha Kedige Chandrashekarachar <kedigech@usc.edu>
- Manan Rajdev <rajdev@usc.edu>
- Posha Dave <ppdave@usc.edu>
- Rhushabh Vaghela <rvaghela@usc.edu>

---

## Slide 0: Introduction

Hello everyone, I am Rhushabh Vaghela. The name of our group is The Vizards and the topic of our project is “Less Crime, More Dime”. We have Disha, Manan, Posha, and I as our team members. Our project is based on Crime Rate and Housing Price in Los Angeles.

## Slide 1: Project Description

The project can be described by words such as Residents, Police, Crime, Victim, Rent, Los Angeles, Neighborhood, Safety Precautions, Housing, and Real Estate. It is addressed to Residents of Los Angeles or people who are moving to Los Angeles. It will be helpful for residents to gauge the rent prices and crime rates around Los Angeles. This is an interesting project since the work has not been undertaken yet and through our application, we will be able to visually represent the correlation between the rent price and crime rates in LA neighborhoods.

## Slide 2: Work Distribution

I worked on building the d3 map with the interactive combined bar and line chart for crime frequency and average rent by year in LA.
Manan worked on building JSON files for various charts and is currently working on zoomable circle packing for crime frequency by victim description.
Posha worked on the Mapbox functionality with heat map and will be continuing work on the d3 word cloud for rent.
Disha worked on setting up the Vue application, integrating the d3 charts on Vue, and deploying the application.

## Slide 3: Datasets

We are working on two datasets. The first dataset is on the average rent of housing in Los Angeles from 2010 to 2016 with their geographical location and neighborhoods. The second dataset is of crimes falling under the same time frame with their crime type, geographical location, and neighborhoods in the city of Los Angeles.  
[Crime Dataset](https://data.lacity.org/A-Safe-City/Crime-Data-from-2010-to-2019/63jg-8b9z/data)
Crime Dataset Columns: Date Occurrence, Time Occurrence, Crime Description, Age, Gender, Victim Description, Premise Description, Lat,Lon  
[Housing Dataset](https://usc.data.socrata.com/Los-Angeles/Rent-Price-LA-/4a97-v5tx)
Housing Dataset Columns: Amount, Neighborhood, Location, Date

## Slide 4: Past Work

All the other visualizations till now have focused only either on the crime data/rent data. Currently, the work that has been done has heavily focused on crime datasets. Moreover, other attempts at similar projects aren't easy to use, depend on shoddy data, or invade your privacy in some way. For this project, we have focused on aspects such as crime types per neighborhood, which have not been addressed earlier. Besides this, there isn’t any visualization conducted for the housing dataset. In order to give better insights to the users, we decided to use both of these datasets.

## Slide 5: Secret Sauce

The secret sauce is our plan to merge the two datasets using their geographical locations and establish a correlation between them. This type of merging required us to use latitude and longitude and preprocessing steps to identify standardized crime types. To merge the data sets using the coordinates, we had to build a grid system. For better visibility of the areas in LA, we used geographical maps with their rent, the number of crimes, and crime types over the year. This approach will allow us to get better insight from the data.

## Slide 6: Layout

Currently, our web application can be thought of as a storyboard tab on different visualizations. It starts with a circle packing visualization on the crime frequency in LA based on the neighborhood and victim description, following a heatmap showing the intensity of crime frequency on a LA Map. The next component showcases the word cloud of the top 10 neighborhoods with the highest rent by year. Finally, the last component is the comparison of crime frequency and rent based on the year and neighborhood using the d3 map.

## Slide 7: Story

We were inspired to create this tool that friends, family, and other people who want to become more aware of their safety situation could use. So, we decided to abide by using simpler, yet multidimensional chart techniques and incorporate interactivity to give users more detailed information if needed. This can be witnessed through the heatmap on Mapbox where the users can zoom in on specific areas to see the magnitude of the crime and through interactive pie charts for victim gender by year. By segregating these interactions, we were able to optimize the information gain for individual residents.

## Slide 8: Visualization showing Originality

We have used the LA county map in order to represent the correlation between the rent prices and crime rates in all the neighborhoods. Once clicked on the neighborhood, the bar chart indicates the crime frequency for years from 2010 to 2016, and the line chart represents the average rent during the same period. This chart allows us to conduct a comparison between the two and find a correlation for each neighborhood.

## Slide 9: Tools

We have used HTML, CSS, Javascript, and D3 for the web application. Along with this, we have used the Vue framework to bundle up the application and deploy it. Since this was our first time using the Vue framework, we had to reconsider a lot of design elements of our visualization which did not work appropriately on Vue.

## Slide 10: Future Work

In the coming week, our plan is to include dynamic pie charts and bar charts to show the basic statistics for the users to get a thorough understanding. If we have more time, we will work on interactivity within the Mapbox and allow users to navigate to each neighborhood and indicate the crime frequency and rent using a bar and line chart on a pop-up window. Moreover, we will build a cohesive one-page scrolling web application to encompass everything as a long poster.
