// Initializing variables

var wakeRange = {
        start: "4:00 AM"
      , end: "9:00 AM"
    }
  , calendarRange = {
        start: "8:00 AM"
      , end: "10:00 AM"
    }
;

// End of variables initializing

console.log('Started script: Alert me of my first early morning meeting');

var lastDateScreenUnlocked = Date.now()
  , screenUnlockOffset = 12 * 60 * 60 * 1000 // Snooze 12hrs
;

// register callback to device unlocked event
device.screen.on('unlock', function() {
  var thisMoment = Date.now();

  if (thisMoment < lastDateScreenUnlocked + screenUnlockOffset) return;
  lastDateScreenUnlocked = thisMoment;

  var day = new Date().toDateString()
    , wakeStart = new Date(day + ' ' + wakeRange.start)
    , wakeEnd = new Date(day + ' ' + wakeRange.end)
    , calStart = new Date(day + ' ' + calendarRange.start)
    , calEnd = new Date(day + ' ' + calendarRange.end)
  ;

  // check if the time permits to set the ringer mode
  if (thisMoment >= wakeStart && thisMoment <= wakeEnd) {
    // query for first appointment
    var firstAppt = device.calendar.today[0];

    if (firstAppt) {
      var apptStart = new Date(firstAppt.startTime)
        , apptTimeStr = apptStart.toTimeString().substring(0, 5)
      ;

      if (apptStart >= calStart && apptStart <= calEnd) {
        console.log('Alerting about ' + firstAppt.title + ' at ' + apptTimeStr);

        var notification = device.notifications.createNotification(firstAppt.title);
        notification.content = (firstAppt.description || '') + " at " + apptTimeStr;
        notification.show();
      }
    }
  }
});

console.log('Completed script: Alert me of my first early morning meeting');
