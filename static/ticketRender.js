// ticketRender.js

window.onload = function onload() {
  fetch('https://cs1-tickets.onrender.com/api')
    .then(response => response.json())
    .then(data => renderSeats(data))
    .catch(error => alert('Error fetching seat data: ' + error.message));

  document.addEventListener('click', function(event) {
    if (event.target.classList.contains('seat')) {
      const seatPosition = event.target.getAttribute('data-position');
      if (seatPosition) {
        const seatUrl = getSeatUrl(seatPosition);
        if (seatUrl) {
          window.location.href = seatUrl;
        }
      }
    }
  });
};

function renderSeats(seatsData) {
  const appendee = document.getElementById('appendee');

  seatsData.forEach((seat, index) => {
    const seatElement = document.createElement('p');
    seatElement.classList.add('seat');
    seatElement.setAttribute('data-position', `${index + 1}`);
    
    if (!seat.id) {
      seatElement.classList.add('empty');
    }

    appendee.appendChild(seatElement);
  });
}

const getSeatUrl = x => `/ticket?loca=${x}`;
//&day=${day}&age=${age}&discount=${discount}
