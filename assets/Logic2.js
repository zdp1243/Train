// 1. Initialize Firebase
// 2. Create button for adding new employees - then update the html + update the database
// 3. Create a way to retrieve trains from the train database.
// 4. Create a way to calculate next arrival using difference between current time and frequency.
// 5. Create a way to calculate minutes away. Using difference between next arrival and current time.
// 6. Then use moment.js formatting to use military time and convert military time to regular time in table.

// 1. Initialize Firebase

var config = {
  apiKey: "AIzaSyDhiGsGexqn6ivUb3Lxc5M7ZW5Agj6d2SY",
  authDomain: "train-times-5a2c4.firebaseapp.com",
  databaseURL: "https://train-times-5a2c4.firebaseio.com",
  projectId: "train-times-5a2c4",
  storageBucket: "",
  messagingSenderId: "662661765353"
};
firebase.initializeApp(config);

var database = firebase.database();

// 2. Button for adding Trains
$("#add-train-btn").on("click", function(event) {
  event.preventDefault();

  // Grabs user input
  var trainName = $("#train-name-input")
    .val()
    .trim();
  var trainDest = $("#destination-input")
    .val()
    .trim();
  var trainInit = $("#firstTime-input")
    .val()
    .trim();
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
  var trainDest = childSnapshot.val().destination;
  var trainInit = childSnapshot.val().firstTime;
  var trainFreq = childSnapshot.val().frequency;

  // Train Console Logs
  console.log(trainName);
  console.log(trainDest);
  console.log(trainInit);
  console.log(trainFreq);

  // Prettify time of first train  Get Initial train time Get current time run modulo on current time v initial time=time past last train
  //then take frequency - time past last train gives minutes until next train

  var trainInitPretty = moment()
    .utc(trainInit)
    .format("HH:mm");
  console.log(trainInitPretty);
  // Calculate the Next Arrival
  // To calculate next arrival(should be last arrival plus frequency)

  var trainNext = moment()
    .utc(trainInit)
    .diff(moment(trainInit), "minutes")
    .format("HH:mm");

  console.log(trainNext);

  var remainder = trainNext % trainFreq;
  console.log(remainder);
  // Calculate Minutes Away (should be next arrival time minus current time)
  var minAway = trainFreq - remainder;
  console.log(minAway);

  var nextTrain = moment()
    .utc()
    .add(moment(minAway), "mm");
  //var nextTrain = 7;
  console.log(nextTrain);
  // Add each train's data into the table
  $("#train-table > tbody").append(
    "<tr><td>" +
      trainName +
      "</td><td>" +
      trainDest +
      "</td><td>" +
      trainFreq +
      "</td><td>" +
      nextTrain +
      "</td><td>" +
      minAway +
      "</td></tr>"
  );
});
