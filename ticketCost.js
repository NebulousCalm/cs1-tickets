const fs = require('fs');

const dayConversion = {
  Monday: 'weekday',
  Tuesday: 'weekday',
  Wednesday: 'weekday',
  Thursday: 'weekday',
  Friday: 'weekday',
  Saturday: 'weekend',
  Sunday: 'weekend'
}

const calcTicketCost = (day, strAge, discount) =>{
  const dayOfWeek = day;
  const dayType = dayConversion[dayOfWeek];
  let age = parseInt(strAge);
  console.log('Input Parameters: ', dayType, age, discount);
  if (dayType == 'weekend'){
    return '$10';
  } else if (age <= 18 && dayType == 'weekday'){
    return '$5';
  } else if (discount == 'FREEDFRIDAY' && day == 'Friday'){
    return '$0';
  }

  return "$10";
}


// ----------------------------

const updateTicket = (locale) =>{
  const filename = 'ticket.json';
  let local = parseInt(locale);
  fs.readFile(filename, 'utf8', (err, data) => {
    if (err) {
      console.error(err);
      return;
    }
    // Parse the JSON data into an object
    const jsonData = JSON.parse(data);
    // Update the value in the object
    jsonData[local - 1].id = true;
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

// updateTicket();

module.exports = { calcTicketCost, updateTicket };