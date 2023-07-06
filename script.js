'use strict';

/*
//////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////    
//////////////////////////////////////////////////////////////////        
//////////////////////////////////////////////////////////////////    
------------------------------------------------------------------------------------------------------------------------------------------------                                                       USING GEOLOCATION API
------------------------------------------------------------------------------------------------------------------------------------------------And the geoloaction API is called an API because it is infact, a 'browser API' just like for example, 'internationalization' or 'timers' , or really anything that the browser "gives us".
And so Geolocation is just another API like that, but it's also a very modern one, and actually there are many other "modern APIs like that", for eg, to "access the user's camera" or "even to make user's phone vibrate". 
*/

class Workout {
  date = new Date();
  id = (Date.now() + '').slice(-10);
  //However here we're simply using "cutting edge javaScript" and so something that's probably gonna become part of JavaScript pretty soon. In the real world, we usually always use some kind of 'library' in order to create good and "unique ID numbers". So usually "we should never create 'IDs' on our own" but always let some library take care of that because this is a very importatnt part of any application.
  clicks = 0;
  constructor(coords, distance, duration) {
    // this.date = ...(...means define them here)
    // this.id = ... // so what we are doing here is actually using a very "modern specification of JavaScript" which is not even yet part of the "official JavaScript language". Then if we want to make it sure that this is gonna work at least with 'ES6' then we would have to do, is to define these 'fields' in the constructor like this.
    this.coords = coords; // [lat, lng]
    this.distance = distance; // in km
    this.duration = duration; // in min
  }
  _setDescription() {
    // prettier-ignore
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

    this.description = `${this.type[0].toUpperCase()}${this.type.slice(1)} on ${
      months[this.date.getMonth()]
    } ${this.date.getDate()}`;
  }
  click() {
    this.clicks++;
  }
}
//The ids in the both classes were actually the same so basically they were created at the same time. But later in the real world as we use our application ofcourse it's gonna be impossible to create "two new objects" at the same time. And so then that's gonna work just fine. When you're really working with the real world then probably you have many users using the same application. And ofcourse some users can create objects at the same time and so by then relying on the time to create ID's is gonna be a really bad idea.
class Running extends Workout {
  type = 'running';
  constructor(coords, distance, duration, cadence) {
    super(coords, distance, duration);
    this.cadence = cadence;
    this.calcPace();
    this._setDescription();
  }

  calcPace = function () {
    // min/km
    this.pace = this.duration / this.distance;
    return this.pace;
  };
}
class Cycling extends Workout {
  type = 'cycling';
  constructor(coords, distance, duration, elevationGain) {
    super(coords, distance, duration);
    this.elevationGain = elevationGain;
    this.calcSpeed();
    this._setDescription();
  }
  calcSpeed() {
    // km/h
    this.speed = this.distance / (this.duration / 60);
    return this.speed;
  }
}

// const run1 = new Running([39, -12], 5.2, 24, 178);
// const cycling1 = new Cycling([39, -12], 27, 95, 523);
// console.log(run1, cycling1);

////////////////////////////////////////////////////////////
//APPLICATION ARCHITECTURE
const form = document.querySelector('.form');
const containerWorkouts = document.querySelector('.workouts');
const inputType = document.querySelector('.form__input--type');
const inputDistance = document.querySelector('.form__input--distance');
const inputDuration = document.querySelector('.form__input--duration');
const inputCadence = document.querySelector('.form__input--cadence');
const inputElevation = document.querySelector('.form__input--elevation');

//This application does not need any arguments and in our application we don't have any parameters in this method. Because right now we don't need any 'inputs' in our application. If we needed then we could add that into our constructor but in this case, that's just not necessary. One example that we could use for 'inputs' in an application like this would be for example, an object of 'options', which is pretty common in "third party libraries". So if we are building a library for some other people to use, then we could allow these developers to customize(modify) the library, using some options. But again that's just not necessary in this case.
console.log('Welcome!');
class App {
  #map; //SO here in the form.addEventListner() in the constructor function we are starting to see two problems here actually. SO here we're trying to use two variables that do not exist in current scope. So we're trying to access "map" and also "mapEvent". Now this map here is easy to fix so it is defined inside the callback function of the geolocation API. But all we have to is to basically create a "global variable" like this we're creating here. Now for the map Event we actually have to do the exact same thing.
  #mapEvent; //So both of these variables now have became private 'instance properties'. So properties that gonna be present on all the instances created through this "class".
  #workouts = [];
  #mapZoomLevel = 13;

  constructor() {
    // Get user's position
    this._getPosition();
    // Get data from local storage
    this._getLocalStorage();
    this.addnewFeature();
    // Attach event handlers
    form.addEventListener('submit', this._newWorkout.bind(this)); //now keep in mind that this method here is basically an 'event-handler' function. It's a function that's gonna be called by an "event listner".
    //And an event handler, 'function' will always have the "this" keyword of the "DOM element" onto which it is 'attatched'. And in this case that's gonna be the "form element". So again inside of the '_newWorkout' method here the "this keyword" is gonna point on 'Form' and no longer to the "app object".
    //WE need to fix that using 'bind'. And this is actually a real "pain point" of working with 'event handlers' in classes like we are doing right now. So even if you are working in the real world you will be binding the this keywords all the time because otherwise many parts of your code are not gonna work.

    //Submitting the 'form' for the newWorkout will of course "create a new workout".

    inputType.addEventListener('change', this._toggleElevationField); //Now this here actually does not use any "this" keyword anywhere and so, here it does not matter what the "this" keyword will be like. And so therefore we don't have to bind it manually here because it doesn't matter.

    containerWorkouts.addEventListener('click', this._moveToPopup.bind(this));
  }
  addnewFeature() {
    console.log('WElcome ot the application!');
  }
  _getPosition() {
    if (navigator.geolocation)
      //just to make sure that we don't get any errors in an old browser, we can test if this navigator.geolocation actually exists.
      navigator.geolocation.getCurrentPosition(
        this._loadMap.bind(this),
        function () {
          alert('Could not get your position');
        }
      );
  }
  //For calling the 1st function in this class we need to say this._loadMap.
  //And so JavaScript, will then call the '1st callback function' here and "pass in the 'position' argument", as soon as the "current position" of the 'user' is determined. And so that event is basically this "receive position".

  //so right here "this" points to the current object.

  /*

Sometimes the bind() method has to be used to prevent losing 'this'.
  example : In a regular function call the "this" keyword is undefined.

       In JavaScript, the "this" keyword refers to an object. Which object depends on how this is being invoked (used or called).  The this keyword refers to different objects depending on how it is used:


       //In an object method, this refers to the object. 
       //Alone, this refers to the global object.
       //In a function, this refers to the global object.
       // In a function, in strict mode, this is undefined.
       // In an event, this refers to the element that received the event.
      // Methods like call(), apply(), and bind() can refer this to any object.

*/
  //Now this 'function' here takes as an input "two Callback functions". And the 1st one is the callback function that will be 'called on success'. So "whenever the browser successfully got the "coordinates" of the 'current position' of the user" and the 2nd callback is the "error callback" which is the one that is gonna be called when there happened an error while getting the coordinates.

  //The 1st function will always be called with a parameter which we call the 'position parameter' and as always we can give it any name that we want.

  //It is simply 'JavaScript' who will call this function here in case of 'success'. And it will pass in an "argument" and we can then use that here.
  /*
------------------------------------------------------------------------------------------------------------------------------------------------  So, the 'L is essentially a "global variable" inside of the script of Leaflet'. The "L variable is a 'global variable' that we then can access from all the other scripts".

  Any variable that is global in any script will be available to all the 'other scripts'. So 'script.Js' has access to 'other global variables' in 'other.js' and 'leaflet.js'. But other.Js doesn't have access to anything from script.js because it appears afterwards.
------------------------------------------------------------------------------------------------------------------------------------------------

*/

  _loadMap(position) {
    const { latitude } = position.coords;
    const { longitude } = position.coords;
    console.log(`https://www.google.co.in/maps/@${latitude},${longitude},15z`); //now what we want to do with these coordinates is basically load a map and centre that map on this position.

    const coords = [latitude, longitude];

    //console.log(this);

    //WE are getting an error here, indeed we get "cannot set property #map of 'undefined' ". And so the error message says that "we cannot set the property on 'this' keyword". It means that something must be wrong with the 'this' keyword. And so in the console indeed it is 'undefined'. So, why is   that.     Well this "_loadMap" method is actually called by the "getCurrentPosition" function here. And infact this is actually called as "a regular function call", not as a "method call". So again since it is a 'callback function' we're not calling it ourselves. It is the "getCurrentPosition" function that will call this 'callback function' once that it gets the 'current position' of the 'user'. And when it calls this 1st function, then it does so, as a "regular function" call. "And as we learned before in 'regular function call' the "this keyword" is set to 'undefined'. And so that's why in here the "this keyword" is undefined." But fortunately for us, there is a good solution that we already know about . And that solution is to manually "bind" the 'this' keyword to whatever we need.

    //Remember that binds simply returns a 'new function' and all of this is still a function that JavaScript can then call whenever it needs to.

    //this.#map is now like a property that gonaa be defined on the object itself.
    this.#map = L.map('map').setView(coords, this.#mapZoomLevel); //whatever string that we pass into this map function must be the 'ID' name of an 'element' in our HTML. And 'it is in that element where the map will be displayed'.

    //this "L" here this is basically the 'main function' that Leaflet gives us as an "entry point". So, basically this is kind of "name space" for eg, a little bit like 'Intl' namespace for the "interlization" API.

    //And so leaflet basically gives us this 'L' 'namespace' here and then that L has a couple of methods that we can use. And one of them is this 'map' method.

    // console.log(map);
    L.tileLayer('https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png', {
      //So the map that we see on the page is basically made up of a small tiles and these tiles they come from this URL which is basically from "openstreetmap". It's basically an open source map that everyone can use it free.
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(this.#map); //so this should probably reder a map on our page.

    /*
    ------------------------
    Handling clicks on map
    ------------------------

    If we simply attach a 'event listner' on the 'map' than that wouldn't really work because then we would have no way of knowing where exactly the user clicked here on the "map". 
    So basically we would have no way of knowing the 'GPS coordinates' of whatever location the user clicked here on the map. Because that is the data that only map knows. Again this on method is not coming from the 'JavaScript' itself it is coming from the leaflet library. 
    
    So this map object here is in fact an object that was generated by leaflet. And we can see that because of this L here and therefore this is gonna be a special object with a couple of methods and properties on it.
    */ this.#map.on('click', this._showForm.bind(this));

    this.#workouts.forEach(work => {
      this._renderWorkoutMarker(work);
    });
  }

  _showForm(mapE) {
    this.#mapEvent = mapE; //So when leaflet calls this function here it will do so with a special "map event". So just like in a standard JavaScript we get access of an event but this event is created by leaflet. So the mapEvent we will get the access of it in the event handler of map.on(). It is inside of this event handler that we get access to the "map event". So to that object, which will contain the "coordinates". However we don't really need it here.

    //So here we are only displaying the form but "where we need it is later when that form is actually submitted". And so basically as a way of passing it here, we will simply also define the map event as a "global variable" too.

    form.classList.remove('hidden');
    inputDistance.focus();
  }

  _hideForm() {
    //Empty inputs
    inputDistance.value =
      inputDuration.value =
      inputCadence.value =
      inputElevation.value =
        '';
    form.style.display = 'none';
    form.classList.add('hidden');
    setTimeout(() => (form.style.display = 'grid'), 1000);
  }

  _toggleElevationField() {
    inputElevation.closest('.form__row').classList.toggle('form__row--hidden');
    inputCadence.closest('.form__row').classList.toggle('form__row--hidden');
    //By toggling the same class on both of them, we make sure that it's always one of them that's 'hidden' and the other one 'visible'.
  }

  _newWorkout(e) {
    const validInputs = (...inputs) =>
      inputs.every(inp => Number.isFinite(inp));
    //Basically this will loop over the array and for all of them it will check whether the number is finite or not. And in the end the every() method will only return true if this value here is true for all of them. So for all elements in the array. But if only one of these values here was not finite, so if the result here was 'false' for one of the elements of the array, then every will return "false" and then that will be the return value of the arrow function.

    const allPositive = (...inputs) => inputs.every(inp => inp > 0);
    e.preventDefault();

    // Get data from form
    const type = inputType.value;
    const distance = +inputDistance.value;
    const duration = +inputDuration.value;
    const { lat, lng } = this.#mapEvent.latlng;
    let workout;

    // If workout running, create running object
    if (type === 'running') {
      const cadence = +inputCadence.value;
      //Check if data is valid : Data is valid means first of all the data should be a number.
      if (
        // !Number.isFinite(distance) ||
        // !Number.isFinite(duration) ||
        // !Number.isFinite(cadence)
        !validInputs(distance, duration, cadence) ||
        !allPositive(distance, duration, cadence)
      )
        //Guard clause: A guard clause means is that we will basically check for the opposite of what we are originally intrested in and if that opposite is true then we simply return the function immediately.
        return alert('Inputs have to be positive numbers!'); //this should happen whenever one of these three here is "not a number" and not when all of them are invalid numbers. And so that's exactly OR means.

      workout = new Running([lat, lng], distance, duration, cadence);
    }

    // If workout cycling, create cycling object
    if (type === 'cycling') {
      const elevation = +inputElevation.value;
      //Check if data is valid
      if (
        !validInputs(distance, duration, elevation) ||
        !allPositive(distance, duration)
      )
        return alert('Inputs have to be positive numbers!');

      workout = new Cycling([lat, lng], distance, duration, elevation);
    }

    // Add new object to workout array
    this.#workouts.push(workout);
    console.log(workout);

    // Render workout on map as marker
    this._renderWorkoutMarker(workout);

    // Render workout on list
    this._renderWorkout(workout);

    // Hide form + clear input fields
    this._hideForm();

    // Set local storage to all workouts
    this._setLocalStorage();
  }
  _renderWorkoutMarker(workout) {
    L.marker(workout.coords)
      .addTo(this.#map)
      .bindPopup(
        L.popup({
          maxWidth: 250,
          minwidth: 100,
          autoClose: false, //So we use this one when we want to overwrite the default behavior of the popup closing when another pop up is open by default it's true and let's set it to 'false'.
          closeOnClick: false,
          className: `${workout.type}-popup`, //we can use className to assign any css className that we want to the popup.
        })
      )
      .setPopupContent(
        `${workout.type === 'running' ? '🏃‍♂️' : '🚴‍♀️'} ${workout.description}`
      )
      .openPopup(); //namespace "l.marker" creates the marker and "addTo ()" adds it to the map and "bindPopup" which will then create a popup and bind it to the marker and here we simply pass in that string "Workout". Now, so that's why we get to work out in all of the markers. But here instead of specifying a string we can also create a brand new popup object, which will then contain a couple of options.
  }
  _renderWorkout(workout) {
    let html = `
      <li class="workout workout--${workout.type}" data-id="${workout.id}">
                <h2 class="workout__title">${workout.description}</h2>
                <div class="workout__details">
                  <span class="workout__icon">${
                    workout.type === 'running' ? '🏃‍♂️' : '🚴‍♀️'
                  }</span>
                  <span class="workout__value">${workout.distance}</span>
                  <span class="workout__unit">km</span>
                </div>
                <div class="workout__details">
                  <span class="workout__icon">⏱</span>
                  <span class="workout__value">${workout.duration}</span>
                  <span class="workout__unit">min</span>
                </div>`;

    if (workout.type === 'running')
      html += `
                <div class="workout__details">
                <span class="workout__icon">⚡️</span>
                <span class="workout__value">${workout.pace.toFixed(1)}</span>
                <span class="workout__unit">min/km</span>
               </div>
               <div class="workout__details">
                <span class="workout__icon">🦶🏼</span>
                <span class="workout__value">${workout.cadence}</span>
                <span class="workout__unit">spm</span>
               </div>
               </li>`;

    if (workout.type === 'cycling')
      html += `
               <div class="workout__details">
               <span class="workout__icon">⚡️</span>
               <span class="workout__value">${workout.speed.toFixed(1)}</span>
               <span class="workout__unit">km/h</span>
             </div>
             <div class="workout__details">
               <span class="workout__icon">⛰</span>
               <span class="workout__value">${workout.elevationGain}</span>
               <span class="workout__unit">m</span>
             </div>
           </li>
               `;

    form.insertAdjacentHTML('afterend', html);
  }
  _moveToPopup(e) {
    const workoutEl = e.target.closest('.workout');
    console.log(workoutEl); //So we will get the "entire element" here so the closest method takes care of really then selecting this entire element. Now why is that so important? Well it's because it is right there where we have the 'ID' and this ID that we will now use to actually find the "workout" in the 'workouts array'. We put this here because with this, we can then basically "build a bridge" between the 'user interface' and "the data that we have actually in our application". So in this case our data in the workouts array because if didn't have this ID here stored in the user interface, then how would we know which is the "objects" in the 'workouts array' that we need to scroll to.
    if (!workoutEl) return;

    const workout = this.#workouts.find(
      work => work.id === workoutEl.dataset.id
    );
    console.log(workout);

    this.#map.setView(workout.coords, this.#mapZoomLevel, {
      animate: true,
      pan: {
        duration: 1,
      },
    });
    //using the public interface
    // workout.click();
  }
  //Let's now use localStorage API in order to make the workout data persist(continue to exist; be prolonged.) across multiple page reloads. whenever a new workout is added, then all the workouts will be added to local storage.
  //Local storage is a place in a "browser" where we can "store data" that will stay there even after we close the page.  So basically the data is basically linked to the 'URL' on which we are using the application.
  _setLocalStorage() {
    localStorage.setItem('workouts', JSON.stringify(this.#workouts)); //localStorage is a very simple API that the browser provides for us and that we can use. The 1st argument in the localStorage API is the name that we want to set and the 2nd argument needs to be a string that we want to store and which will be associated with this key 'workouts' here. Basically localStorage is simply a key: value store and so we need a key and a simple value which must also be string. WE can convert an object into a string by doing JSON.stringify(this.#workouts). With this we are setting all the workouts to locat storage.  And so it is only advised to use for "small amounts of data". That's because local storage is "blocking". You shouldn't use localStorage to store large amounts of data, because that will surely slow down your application. WE could store everything that's in the application in local storage. We would just have to define one key for each of them, and then we could use that key to basically retrive it back.
  }
  _getLocalStorage() {
    const data = JSON.parse(localStorage.getItem('workouts')); // JSON.parse will convert all string back into the object.
    console.log(data);

    if (!data) return;
    this.#workouts = data;

    this.#workouts.forEach(
      work => {
        this._renderWorkout(work);
      } //Get into the habit of "exporting functionality" into its own methods or in own functions.

      // this._renderWorkoutMarker(work) So indeed, we get an error when we try to add this first workout also to the map. REmember this that this method is executed right at the beginning, so right after the page loaded. And so we are trying to add this marker to the map right at the beginning. However at this point the map has actually not yet been loaded. So essentially we are trying to add a marker, to the map (this.#map) which is this one whicch isn't yet defined at this point. And so, this is a first glimpse into the nature of "asynchronous JavaScript". So, first the position of the user needs to be get usning geoloction, and after that the map has also to be loaded.  So ther is a lot of stuff that has to happend before we can actually render any markers on the map. So instead of trying render the markers right at the beginning we should only do that once the map has been loaded.

      //So, when we converted objects to a string, and then back from the string to objects we lost the prototype chain. And so these new objects here that we recovered form the local storage are now just regular objects. There are no longer objects that were created by running or by the "cycling class." And therefore they will not be able to inherit any of thier methods.
    );
  }
  reset() {
    localStorage.removeItem('workouts');
    location.reload(); //location is basically a big object that contains a lot of methods and properties in the browser. And one of the method is the ability to reload the page.
  }
} //NOw another thing that's intresting to see here in the documentation is that all these methods always returned "this". So, basically the "current object" which then makes all of these methods 'chainable'.

const app = new App();

//app._getPosition();
/*
*************************************                         IMPORTANT                                  ************************************** 
------------------------------------------------------------------------------------------------------------------------------------------------
So inside of the class we also have a 'method' that automatically gets called as the 'page loads'. So inside of the class we also have "method" that gets "exectued" as soon as "this app" here is created.

And that is the "constructor method" so this "constructor method is called immediately "when a new object is created" from this class" and this object that is created so this 'app object' is created right in the beginning as the page loads. So that means that "the constructor" is also 'executed' immediately as the "page loads".
And so what we can do is to simply "get the position" into the 'constructor'. And in the constructor all we have to do is to put "this" in place of "app" and here the this keyword denotes to the "current object".
------------------------------------------------------------------------------------------------------------------------------------------------





*/
/*
//////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////
------------------------------------------------------------------------------------------------------------------------------------------------  DISPLAYING A MAP USING THIRD PARTY LIBRARY (LEAFLET LIBRARY)                                                
------------------------------------------------------------------------------------------------------------------------------------------------
Google leaflet library 
This is an open source JavaScritp library for mobile friendly interactive maps. So essentially this is a library that some other developers wrote and we can now include it for free in our own code and use it. And in this case we can use it to display maps.

//And whenever we use third party library the first thing to do is basically include it in our site.
Here we can download leaflet to our computer if we wanted or we can also use a "hoisted version" of Leaflet. And this basically means that we can use a version of this library that is already hoisted by someone else. So in this case it is CDN which is a Content Delivery Network. So actually we will need a CSS file and also we will need a JavaScript file.
grab the code and paste it into the html head but always before our own script.
And of course it is in our "scirpt" where we will then use the Leaflet Library. 
And so 'by the time that our script loads', "the browser has must already downloaded the Leaflet Library" because otherwise our code will not be able to work with library.

So as we learned we should never put any JavaScript in header without any of the "defer" or "async" attributes. And since the order matters here so remember, we must then use the Differ attribute.

So we already included the library into our site, but of course we need to do something with it.  So on its own the leaflet script here doesn't do anything. 
So we now need to use basically the functions that are defined in this library to our advantage.
*/
/*
//////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////
------------------------------------------------------------------------------------------------------------------------------------------------  DISPLAYING A MAP MARKER                                             
------------------------------------------------------------------------------------------------------------------------------------------------
The first thing that we need to do is to actually add the event handler to the map so that we can then handle any incoming clicks. 
Now how we're gonna do that ? should we simply attach an 'event listener' to 'the whole map element' here? 

That wouldn't really work because then we would have no way of knowing where exactly the user clicked here on the map. 
So bascially we would have no way of knowing "the GPS coordinates" of whatever location the user clicked here on the map. 
Because that is data that only map knows. 
It's onto the map object here where we can now basically add an event listner. So the idea is similar to what we do using add event listner but on the map, we can simply do this so 
map.on();
here is on the on method that we are now gonna use instead of the standard built-in add event listener method.





*/
/*
//////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////
------------------------------------------------------------------------------------------------------------------------------------------------ARCHITECTURE: INTIAL APPROACH                                       
------------------------------------------------------------------------------------------------------------------------------------------------
Now there are some quite 'advanced architectrue patterns' in JavaScript. 
In this 'small project' we will simply use "OOP" just like we learned in the last section. And this way you can use these 'concepts' here in a "real project". 
And remember that Architectre is all about 'giving the project a structure'. 
And in that structure we can then develop the "functionality". 
And in this project we decided that the "main structure" will come from 'classes' and 'objects'.

ONe of the most important aspects of any architecture "is to decide 'where' and 'how' to store the data". Because data is probably the most fundamental part of any application.
Because without data it doesn't even make sense to have an application in the first place. 
What would be the application be about if not about some sort of data.

Now in this case, the data that "we need to 'store' and to 'manage'" comes directly from the 'user stories'. 

So right in the "first user story" we can already see that we will somehow need to store the location, distance, time, pace, and steps per minute.
And to fit the "2nd user story" we will have to implement basically the same data. So again location, distance, time and speed but then also "the elevation gain" instead of the 'steps per minute'.
And so we will design our 'classes', so that they can create objects that will hold this kind of data.

All we have to do now is to create different functions that will handle these different events. And in fact, what we are gonna do is to create a big class called App that will basically hold all of these functions as methods.

Having a class that contains all the data and methods about the application, like we have here is a pretty common thing that you will see in simple "JavaScript applications" like this one.

Now if the application was a bit more complex, then we could divide this Architecture even further and create one class that would only be concerned with the "user interface" and one class for the so called "Business Logic". So basically the logic that works only with the underlying data. But in this case we can just keep it simple like this.


------------------------------------------------------------------------------------------------------------------------------------------------
10 Additional feature Ideas : Challenges 
1. Ability to edit workout;
2. Ability to delete a workout; 
3. Ability to delete all workouts; "right from the user interface"

4. Abitliy to sort workouts by a certain field (e.g. distance); You can look for Bankist application for this.
5. Re-build Running and Cycling objects coming from Local Storage.
6. More realistic 'error' and 'confirmation' messages; Maybe you could even have them fade out after some time.

7. Ability to position the map to show all workouts [very hard]. So let's say you went to some country and did some workouts there. And so your workouts are all over the map. And so therefore it would be nice to have a button which shows all the workouts on the map at once.  (To solve this problem you have to do a lot of Googling about the leaflet library and dig deep into the documentation).

8. Ability to draw lines and shapes instead of just points. 

9. "Geocode location" from coordinates ("Run in Faro, Portugal") [only after asynchronous JavaScript section] So you could use third party API to plug in the coordinates and that would then give you back the real location. So for example you could then call the run a "Run in Faro, Portugal" Because the third party web API would give you that location data. So the description of the location not just raw coordinates.

10. Display the weather data for workout time and place. [only after asynchronous JavaScript section] 

------------------------------------------------------------------------------------------------------------------------------------------------












*/
