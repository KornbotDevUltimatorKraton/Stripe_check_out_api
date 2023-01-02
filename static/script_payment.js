var stripe = Stripe('pk_test_51MFwAsDwkKIbSR1RL8A968XXyVoIhCTyvP86LbLm3jhbqBjNH82clDRMxj5Au2tMe5NHAOFDDVpRtMoWaypDBkLe00IxEwu3XR');
//var stripe = Stripe('pk_live_51MFwAsDwkKIbSR1RXM0XJ1qy3MkiPqj4iMqeklMIkNUGnPH9sPhcOsV4wH1BA1BRKcg54nSHAxWP3UpELhhjZvZB00litqFVDM')
var elements = stripe.elements();
client_current = {} // Getting the client current data 
var card = elements.create('card', {
  hidePostalCode: true,
  style: {
    base: {
      iconColor: '#666EE8',
      color: '#31325F',
      lineHeight: '40px',
      fontWeight: 300,
      fontFamily: 'Helvetica Neue',
      fontSize: '15px',

      '::placeholder': {
        color: '#CFD7E0',
      },
    },
  }
});
card.mount('#card-element');

function setOutcome(result) {
  var successElement = document.querySelector('.success');
  var errorElement = document.querySelector('.error');
  successElement.classList.remove('visible');
  errorElement.classList.remove('visible');

  if (result.token) {
    // In this example, we're simply displaying the token
    successElement.querySelector('.token').textContent = result.token.id;
    //successElement.classList.add('visible');
    console.log(result.token.id);   
    // In a real integration, you'd submit the form with the token to your backend server
    //var form = document.querySelector('form');
    //form.querySelector('input[name="token"]').setAttribute('value', result.token.id);
    //form.submit();
    // POST
    fetch('/clients_data', {

  // Declare what type of data we're sending
  headers: {
    'Content-Type': 'application/json'
  },

  // Specify the method
  method: 'POST',

  // A JSON payload
  body: JSON.stringify({"token":{
      "Token": String(result.token.id),"Client_data":client_current  
  }})
}).then(function (response) { // At this point, Flask has printed our JSON
return response.text();
}).then(function (text) {

  console.log('POST response: ');

  // Should be 'OK' if everything was successful
  console.log(text);
});

  } else if (result.error) {
    errorElement.textContent = result.error.message;
    errorElement.classList.add('visible');
  }
}

card.on('change', function(event) {
  setOutcome(event);
});

document.querySelector('form').addEventListener('submit', function(e) {
  e.preventDefault();
  var options = {
    name: document.getElementById('first-name').value + " " + document.getElementById('last-name').value,
    address_line1: document.getElementById('address-line1').value,
    address_line2: document.getElementById('address-line2').value,
    address_city: document.getElementById('address-city').value,
    address_state: document.getElementById('address-state').value,
    address_zip: document.getElementById('address-zip').value,
    address_country: document.getElementById('address-country').value,
  };
  stripe.createToken(card, options).then(setOutcome);
  //console.log(options); // Display options of the text input from the payment form 
  full_name = Object.values(options)[0]; //Getting the full name append into the json of client_current 
  client_current['client_data'] = options //Getting the client current data 

});
