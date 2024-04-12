const { calcTicketCost, updateTicket } = require('./ticketCost.js');

const express = require('express');
const path = require('path');
const ejs = require('ejs');

const app = express();

app.use('/static/', express.static("./static"));
app.use(express.urlencoded({ extended: true }));
app.engine('html', ejs.renderFile);

app.get('/', (req, res) => { // get all routes and redirect to index.html
  res.render('index.html');
});

app.get('/api', (req, res) =>{
  res.header("Content-Type",'application/json');
  const __dirname = path.resolve();
  res.sendFile(path.join(__dirname, 'ticket.json'));
});

app.get('/ticket', (req, res) =>{
  updateTicket(req.query.loca);
  
  res.render('ticket.html');
});

app.get('/register', (req, res) => {
  let day = req.query.day;
  let age = req.query.age;
  let discount = req.query.discount;

  const cost = calcTicketCost(day, age, discount);
  console.log(cost);
  res.render('complete.html', { cost });
});

/* ---- RUN SERVER ---- */
 
app.listen(process.env.PORT || 3000, () => {
  console.log('Server started');
})