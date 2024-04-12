<a align="center" href="https://cs1-tickets.onrender.com/" target="_blank">web version (let it start)</a>

<h1 align="center">Tickets</h1>
<p align="center">i got kinda bored over the weekend.</p>

## So I decided to take a simple Comp. Sci. project and make it a bit fancy. I thought initially it would be a decently long project, but ultimately... me and 2 hours in Webstorm proved that wrong.

> It was a pretty fun little thing overall, it's kinda scuffed but I don't mind

> the code (what you care about)

`index.js` this is the server file

```js
const { calcTicketCost, updateTicket } = require('./ticketCost.js'); // importing from a local `ticketCost.js` file

/* --- LIBS --- */

const express = require('express'); // express handles all of the http requests
const path = require('path'); // used for navigating the file structure
const ejs = require('ejs'); // ejs is the templating engine. It allows me to render my html files while passing content from my js to them

const app = express(); // instantiating the class

app.use('/static/', express.static("./static")); // Setting the route of `https://www.example.com/static` to be the route where my 'static files are held'
app.use(express.urlencoded({ extended: true })); // urlencoding things
app.engine('html', ejs.renderFile); // default directory for ejs rendering is `./views` and I'm setting it to render *.html files

app.get('/', (req, res) => { // get all routes and redirect to index.html
  res.render('index.html');
});

app.get('/api', (req, res) =>{ // serves up the `/api` route with my json api
  res.header("Content-Type",'application/json'); // set the header of the webpage to be json so I don't have to convert it later from default html
  const __dirname = path.resolve(); // get the current file location
  res.sendFile(path.join(__dirname, 'ticket.json')); // send up the json file at the current directory to the route
});

app.get('/ticket', (req, res) =>{
  updateTicket(req.query.loca); // get the query parameter for `loca` (location) and send it to the `updateTicket` function
  
  res.render('ticket.html');
});

app.get('/register', (req, res) => { // register ticket on form submission 
  let day = req.query.day; // get the value of ?day=*
  let age = req.query.age; // get the value of ?age=*
  let discount = req.query.discount; // get the value of ?discount=*

  const cost = calcTicketCost(day, age, discount); // get the calculated ticket cost based off of factors

  res.render('complete.html', { cost }); // render file known as complete.html and pass the variable `cost` into the DOM
});

/* ---- RUN SERVER ---- */
 
app.listen(process.env.PORT || 3000, () => { // starts the server on port 3000
  console.log('Server started');
})
```

`ticketCost.js` the functions file
```js
const fs = require('fs'); // library for handling the file system

const dayConversion = { // converts days into what type of day of the week when accessed. 
  Monday: 'weekday',
  Tuesday: 'weekday',
  Wednesday: 'weekday',
  Thursday: 'weekday',
  Friday: 'weekday',
  Saturday: 'weekend',
  Sunday: 'weekend'
}

const calcTicketCost = (day, strAge, discount) =>{ // function takes in `day`, `strAge`, and `discount`
  const dayType = dayConversion[day]; // converts into day of week
  let age = parseInt(strAge); // makes sure that the age is an integer

  /* --- handling the cost --- */
  if (dayType == 'weekend'){
    return '$10';
  } else if (age <= 18 && dayType == 'weekday'){
    return '$5';
  } else if (discount == 'FREEDFRIDAY' && day == 'Friday'){
    return '$0';
  }

  return "$10"; // by default
}


// ----------------------------

const updateTicket = (locale) =>{ // updates the ticket (converts it from true/false)
  const filename = 'ticket.json'; // gets file
  let local = parseInt(locale); // makes sure its an integer
  fs.readFile(filename, 'utf8', (err, data) => { // opens file
    if (err) { // error handling
      console.error(err);
      return;
    }

    const jsonData = JSON.parse(data); // Parse the JSON data into an object
    jsonData[local - 1].id = true; // Update the value in the object

    // Write the updated object back to the JSON file
    fs.writeFile(filename, JSON.stringify(jsonData, null, 2), (err) => {
      if (err) {
        console.error(err);
        return;
      }
      console.log('Value updated successfully!');
    });
  });
}

module.exports = { calcTicketCost, updateTicket }; // exports the functions to be used in 'index.js'
```

`/static/ticketRender.js` all of the mess that literally just creates squares...
```js
// ticketRender.js

window.onload = function onload() { // on page load
  fetch('https://cs1-tickets.onrender.com/api') // get the api url 
    .then(response => response.json()) // make sure its json
    .then(data => renderSeats(data)) // then call render seats function
    .catch(error => alert('Error fetching seat data: ' + error.message)); // err handling

  document.addEventListener('click', function(event) { // on any click inside the DOM
    if (event.target.classList.contains('seat')) { // if it has the class .seat 
      const seatPosition = event.target.getAttribute('data-position'); // get the data-position attribute (rendered as: data-position='')
      if (seatPosition) { // if seatPosition is true (which it is)
        const seatUrl = getSeatUrl(seatPosition); // get the url from the function 'getSeatUrl'
        if (seatUrl) { 
          window.location.href = seatUrl; // change browser window location
        }
      }
    }
  });
};

function renderSeats(seatsData) { // render seats function (it renders squares)
  const appendee = document.getElementById('appendee'); // appending div tag

  seatsData.forEach((seat, index) => { // for how many seats there are in the passed in JSON data
    const seatElement = document.createElement('p'); // creates the element 'p' for all the cubes
    seatElement.classList.add('seat'); // adds a class .seat
    seatElement.setAttribute('data-position', `${index + 1}`); sets the 'data-position' attribute to them
    
    if (!seat.id) { // if the seat id in the JSON data is false, then add an 'empty' tag
      seatElement.classList.add('empty');
    }

    appendee.appendChild(seatElement); // append everything
  });
}

const getSeatUrl = x => `/ticket?loca=${x}`; // shortened function for the location redirect on click
```

`/static/ticket.styles.css` what makes it look (not) pretty

```css
body{
  background-color: #121314; /* set the entire screens background color to this */
}

*{ /* setting defaults so that no browser styling overrides */
  margin: 0; 
  padding: 0;
}

.seat{ /* all "seats" (squares) */
  width: 50px; /* 50px wide */
  height: 50px; /* 50px tall */
  margin: 25px 0; /* has a vertical space (top and bottom) of 25px (total height is now 100, but height with color is only half) */
  border: 0.5px solid #333; /* setting the border width, the type (solid) and the color */
  border-radius: 3px; /* rounding the edges */
  background-color: #E74C3C; /* setting a default background color */
}

.seat:hover{ /* hover stylings for fanci */
  cursor: pointer; 
  filter: brightness(0.35);
}

.empty{
  background-color: #2ECC71 !important; /* if not taken, they become green */
}

div{ /* the container for all of the squares */
  place-items: center; // center aligns them all
  display: grid;
  grid-template-columns: 16.5vw 16.5vw 16.5vw 16.5vw 16.5vw 16.5vw; // creates 6 colums for the grid all 16.5 viewport(screen) width wide
}
```
