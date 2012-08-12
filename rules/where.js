// Initializing variables

var friends = [
        { name : "Jenny Jenny", phoneNumber : "867.5309" }
      //, { name : "Benny Benny", phoneNumber : "+1 (555) 555-5555" }
    ]
;

var messageText = "Where?";

// End of variables initializing

console.log('Started script: When VIPs text me \"' +  messageText + '\" reply automatically with my location');

// Clean numbers and save them
friends.forEach(function( friend, i ) {
  friends[i].cleanNumber = numberCleaner(friend.phoneNumber);
});

//  Register callback on sms received event
device.messaging.on('smsReceived', function( sms ) {
  if (sms.data.body.toLowerCase() === messageText.toLowerCase()) {
    friends.forEach(checkIsFriend(sms.data.from));
  }
});

function checkIsFriend( whom ) {
  whom = numberCleaner(whom);

  return function( friend ) {
    var diff = whom.length - friend.cleanNumber.length;

    if (whom.indexOf(friend.cleanNumber, diff) >= 0) {
      console.log('Responding to ' + friend.name + ' with my location');

      // getting location from cell, which is accurate enough in this case, time interval is 100  milliseconds, to get immediate location sample
      var locListener = device.location.createListener('CELL', 100);

      locListener.on('changed', function( signal ) {
        // stop listening to location changed events after getting the current location
        locListener.stop();

        var mapUrl =  'https://maps.google.com/?q=' + signal.location.latitude + ',' + signal.location.longitude;

        // sending text message  with the current location
        device.messaging.sendSms({
            to: friend.phoneNumber,
            body: 'Hi, I am here: ' + mapUrl
        }, sendCallback);
      });

      locListener.start();
    }
  };
}

function sendCallback( err ) {
  if (err) {
    console.error('Error sending text message: ' + JSON.stringify(err));
  }
}

function numberCleaner( number ) {
  return number.replace(/[^0-9]/g, "");
}

console.log('Completed script: When VIPs text me \"' +  messageText + '\" reply automatically with my location');
