# If-on-a-winters-night
A node-based clone of the word counting program described in Italo Calvino's If on a winter's night a traveler... Takes in a text and displays data displays a graph of most commonly used words, excluding such meaning-sparse words such as 'as' or 'or'.

## Use
This application has three main pages: the list page, the add-story page, and the graph page. These page titles are self explanatory. The list page (/displayAll) lists all stories currently contained in the database. The add-story page (also the homepage) has a form that allows you to add a new story to the database via copy/paste or, if you really feel the urge, typing the story in completely. Finally, the graph view page (/graph/{id}) displays data about the text.

### List page
Lists each text by name and number of non-excluded words. Has options to either delete each text (texts are deleted permenantly), or view its graph.

### Add-story
Displays a form with two text boxes, one small for text title, one large for full text. Upon hitting submit, the application takes in the data, strips the excluded words, and saves a list of words as an array to the database.

### Graph view
Displays a graph of the most commonly used words, up to a certain cutoff. Hovering over each bar displays information about each term. 

## Future plans
* Find a natural language library to group similar words, such as 'see' and 'saw', or 'father' and 'dad'
* Give the user the option of choosing the cut-off used for common words
* Find analytical uses for the data--predict themes based on common words, for example