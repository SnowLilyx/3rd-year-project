# 3rd-year-project
A copy of the code used in my 3rd year project, a web app to help teach A-level students about 3D linear transformations

NOTE: You will need to host the page on a local server running in the main directory for it to work properly, just clicking the HTML file will not work.

NOTE: The entire three.js code is also in the directory, the files that are my own work are detailed below.

index.html - The HTML file for the webpage, including all the buttons for adding, merging and deleting matrices and the display of the current matrices

code/style.ccs - Short stylesheet to format the webpage

code/uiutils.js - Various functions for dealing with adding, merging and deleting various matrices, allowing the drag and drop of them in the UI and the various forms to create them.

code/ui.js - Short file that initiates the UI in the correct starting setup using the functions from uiutils.js

code/linalg.js - Various functions implementing the required linear algebra functions

code/main.js - The main JavaScript file, sets up the three.js interface and implements the mathematics for interpolating the cube on arbitrary linear transformations.

A large portion of the work of this project was in working out the mathematics for interpolating linear transformations in a visually acceptable way as I could not find any methods in the literature.
