/* global firebase moment */
// Steps to complete:

// 1. Initialize Firebase
// 2. Create button for adding new employees - then update the html + update the database
// 3. Create a way to retrieve trains from the train database.
// 4. Create a way to calculate next arrival using difference between current time and frequency.
// 5. Create a way to calculate minutes away. Using difference between next arrival and current time.
// 6. Then use moment.js formatting to use military time.

// 1. Initialize Firebase
var config = {
  apiKey: "AIzaSyA_QypGPkcjPtylRDscf7-HQl8ribnFeIs",
  authDomain: "time-sheet-55009.firebaseapp.com",
  databaseURL: "https://time-sheet-55009.firebaseio.com",
  storageBucket: "time-sheet-55009.appspot.com"
};

firebase.initializeApp(config);

var database = firebase.database();

// 2. Button for adding Trains
$("#add-employee-btn").on("click", function(event) {
  event.preventDefault();

  // Grabs user input
  var trainName = $("#train-name-input")
    .val()
    .trim();
  var trainDest = $("#destination-input")
    .val()
    .trim();
  var trainInit = moment(
    $("#firstTime-input")
      .val()
      .trim(),
    "HH:mm"
  ).format("X");
  var trainFreq = $("#frequency-input")
    .val()
    .trim();

  // Creates local "temporary" object for holding employee data
  var newTrain = {
    name: trainName,
    destination: trainDest,
    firstTime: trainInit,
    frequency: trainFreq
  };

  // Uploads employee data to the database
  database.ref().push(newTrain);

  // Console Logs
  console.log(newTrain.name);
  console.log(newTrain.destination);
  console.log(newTrain.firstTime);
  console.log(newTrain.frequency);

  // Alert
  alert("Train successfully added");

  // Clears all of the text-boxes
  $("#train-name-input").val("");
  $("#destination-input").val("");
  $("#firstTime-input").val("");
  $("#frequency-input").val("");
});

// 3. Create Firebase event for adding train to database and row in the html when user adds entry.
database.ref().on("child_added", function(childSnapshot, prevChildKey) {
  console.log(childSnapshot.val());

  // Store everything into a variable.
  var trainName = childSnapshot.val().name;
  var trainDest = childSnapshot.val().role;
  var trainInit = childSnapshot.val().start;
  var trainFreq = childSnapshot.val().rate;

  // Train Console Logs
  console.log(trainName);
  console.log(trainDest);
  console.log(trainInit);
  console.log(trainFreq);

  // Prettify the employee start
  var trainInitPretty = moment.unix(trainInit).format("HH:mm");

  // Calculate the Next Arrival
  // To calculate next arrival(should be last arrival plus frequency MATH NOT RIGHT)
  var trainNext = moment().diff(moment.unix(trainInit, "X"), "frequency");
  console.log(trainNext);

  // Calculate Mintes Away (should be next arrival time minus current time NOT SURE WRITTEN RIGHT)
  var minAway = trainNext - moment;
  console.log(minAway);

  // Add each train's data into the table
  $("#train-table > tbody").append(
    "<tr><td>" +
      trainName +
      "</td><td>" +
      trainDest +
      "</td><td>" +
      trainNext +
      "</td><td>" +
      +"</td><td>" +
      minAway +
      "</td></tr>"
  );
});
