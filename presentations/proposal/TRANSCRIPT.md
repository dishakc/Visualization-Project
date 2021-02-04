# TRANSCRIPT

Topic: **Less Crime, More Dime**

Team name: The Vizards

Team members:

- Disha Kedige Chandrashekarachar <kedigech@usc.edu>
- Manan Rajdev <rajdev@usc.edu>
- Posha Dave <ppdave@usc.edu>
- Rhushabh Vaghela <rvaghela@usc.edu>

---

## Slide 1

Our project can be described by words such as Crime, Rent, Los Angeles, Neighborhood, Safety Precautions, Housing, and Real Estate. It is addressed to Residents of Los Angeles or people who are moving to Los Angeles. This web application will be helpful for residents to gauge the rent prices and crime rates around Los Angeles. This is an interesting project since the work has not been undertaken yet and through our application, we will be able to visually represent this correlation.

## Slide 2

The goal of our project is to allow users to visually understand the correlation between the rent price and crime in Los Angeles and make informed housing decisions. The story is to let us see how the average rent prices in Los Angeles and crime rates have changed throughout the years. By using the two datasets, we want users to be able to make informed decisions regarding housing by considering their safety and pricing range.

## Slide 3

We will be working on two datasets. One of them would be data on average rent of housing in Los Angeles from 2010 to 2016 with their geographical location and neighborhoods. The other dataset is of crimes falling under the same time frame of 2010 to 2016 with their crime type, geographical location and neighborhoods in the city of Los Angeles.
[Crime Dataset](https://data.lacity.org/A-Safe-City/Crime-Data-from-2010-to-2019/63jg-8b9z/data)
Crime Dataset Columns: Date Occurrence, Time Occurrence, Crime Description, Age, Gender, Victim Description, Premise Description, Lat,Lon  
[Housing Dataset](https://usc.data.socrata.com/Los-Angeles/Rent-Price-LA-/4a97-v5tx)
Housing Dataset Columns: Amount, Neighborhood, Location, Date

## Slide 4

All the other visualizations till now focused only either on the crime data/rent data. Currently, the work that has been done has heavily focused on the crime dataset. This includes a project done in this course called “Be Safe”. For this dataset, we will focus on aspects such as crime types per neighborhoods, which has not been addressed earlier. Besides this, there isn’t any visualization conducted for the housing dataset. In order to give better insights to the users, we have decided to use both these datasets.

## Slide 5

The secret sauce is our plan to merge the two datasets using their geographical locations and establish a correlation between them. For pre-processing, we will read the two data sets, which is, Rent Price LA and Crime Data in Python using Pandas. The two data sets will be merged using two common columns, that is, the latitude and longitude. For the Crime Data, we will need extract this information from the Location column by splitting it. Furthermore, a grid system will be developed by keeping margins for the latitude and longitude since an exact matching will be difficult to obtain while merging the datasets. Besides this, preprocessing steps to identify standardized crime types will be conducted.

## Slide 6

We will have three different sections for the web application. The first one will be the visualization for both rent and crime patterns in Los Angeles. This visualization will aim to show two major things: the trends over time and the trends based on geographical location. One of the major design considerations we have taken is to use simpler and less intricate charting methods. This is because the audience is an everyday user, who might not be familiar with enhanced charts. For this, we will be using a form of geospatial and mapping: thematic maps such as cartogram, proportional symbol map, or choropleth. The charts will be dynamically updated based on the attributes and database selected.

## Slide 7

The second and third visualization will be for rent and crime individually. We want our web application to give a wholesome picture of the entire situation in Los Angeles. Hence, using individual visualization techniques, we will aim to provide the users a comprehensive knowledge and information regarding the same. As stated earlier, we will abide by using simpler, yet multidimensional chart techniques and incorporate interactivity to give users more detailed information. For the rent data, we are planning to use time series plot using the year and rent amount, bubble cloud using the neighborhoods and the rent amount. For the crime data, we are planning to use coxcomb chart, reingold-tilford tree, word clous and sunburst for various crime types, gender, neighbourhood and year. All the charts will be dynamic and would allow users to interact and select the attributes for detailed visualizations.

## Slide 8

Currently, our plan is to use HTML, CSS, Javascript and D3 for the web application. Before building the application, we will build prototypes of the charts using Excel and SVG to understand how they will be inferred by the users. Using that feedback, we will update the final charts. Besides this we are also looking at other visualization tools in order to build a more interactive and user friendly web application.

## Slide 9

One of the biggest risks that we would have working with the datasets is not being able to find the correlation between the rent and crime. We would resolve it by just showing the visualization, regardless and still providing the important information. The second risk we would have is merging two structured datasets without a discrete column to merge on. We will be overcoming this by building boundaries and a grid system to merge the datasets based on the geographical location.

## Slide 10

We have divided the work into 4 major steps:
The first step is Data Preprocessing, which will be done by Manan and Disha. The second step is basic webapp structure, which will be done by Rhushabh and Posha. The third step, which is the major bulk of the project is Visualization. This will be done by all of us since we are building three different dashboards. The final step is finalizing the webpage, writing the final paper and building the video. This will also be done by everyone.
