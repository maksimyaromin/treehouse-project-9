# Create a Gallery App with React
I present to you my version of the implementation of Project 9 from Treehouse, which contains the application on React.

The application downloads and displays images from the Flicker service. To run the application, the user must register with Flicker and get the API key. Further, this key must be written to the file *config.js*, which has to be saved in *src* folder. The approximate content of the file should be as follows
```js
    const FLICKR_API_KEY = "YOUR_KEY_HERE";
    export default FLICKR_API_KEY;
```

The application is built with the help package [create-react-app](https://github.com/facebook/create-react-app), but I made some changes to the project. In particular, I do not like to dump everything (especially styles). I also do not like to use this package at all, but I want to control everything. I did not do *eject*, but I rendered the styles and images in a separate folder (*assets*), and to build them I added several Gulp-tasks (see *gulpfile.js*). I've slightly changed the standard commands in *package.json* so that you can work with this application as with a normal create-react-app application. So to run it is enough to restore the packages
```shell
    npm install
```
and run a command
```shell
    npm start
```
as you probably used to do, using create-react-app. I note that I wrote an observer for .scss styles. The only limitation is the availability of [Sass](https://sass-lang.com/) and [Compass](http://compass-style.org/), as far as I always use it. To change the styles they must be installed on your machine. If you do not want to or can not install them, then consider that I wrote the styles on pure CSS. To avoid rejection of the project due to the fact that the grader will get an error due to a lack of Compass, I commented out the active code in the *build:assets* and *watch:scss* tasks.So they are performed, but do not do anything. Also at the top *gulpfile.js* I commented out the line
```js
    sass = require("gulp-compass")
```
If you have Sass and Compass and want to see how everything works in a bundle, go to *gulpfile.js* and remove the relevant comments. By default, the project will use the styles and images I collected and located in the *public/assets* folder.To read them is certainly not very convenient, because they are processed with a gulp, but here we learn JS, and you can simply see the styles in the browser. Or see the file *assets/scss/styles.scss*.

You can also build a production version of the project using the npm and create-react-app standard command 
```shell
    npm run build
```

There are several components in the application for sharing responsibilities. The basic component with a state is called *Gallery* and is located in the *src/components/index.js* file. It contains all the logic of the application and the results of its work are transferred to the remaining components via *props*. All other components are state-independent.

The application supports several routes, including one multipurpose:
```js
    <Route exact path="/:tag" />
```
As you can see, you can download the pictures you are interested in using the address bar of the browser. But please note that the presence of the keyword *exact* route /sunsets is valid, and the route /sunset/red is not. This is done to show you the 404 page.

Also, a universal container is used to display images on any tag. In my opinion, this is a good decision in order not to violate the principle of DRY. It is not really important to make different components for displaying preset categories as written in your task.

There are three preset tags in application - Belarus, Azores, Sardinia, and also there is an opportunity to load pictures on any other tag or phrase. To do this, on the *Home* (/) page there is a search field at the top of the page. I could name this page Search, but please agree that this is more logical and better way.

### I hope you will enjoy it. Max Eremin