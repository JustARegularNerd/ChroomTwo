/// Global Variables
var busy = false;
var errorCodes = ["No error", "Username already exists", "Username is not alphanumeric", "Please check declaration of prepareChatBox()", "Username is too long", "Username is too short", "Please check declaration of renderMessage()"];
var version = "2.20171412";
var msgRenderMode = 1;

/// On Event triggers

// Hover over button descriptions
onEvent("buttonMainSignup", "mouseover", function() {
  if(busy === false) {
    setText("labelMainStatus", "Creates an account");
    showElement("labelMainStatus");
  }
});
onEvent("buttonMainSignup", "mouseout", function() {
  if(busy === false) {
    hideElement("labelMainStatus");
  }
});
onEvent("buttonMainView", "mouseover", function() {
  if(busy === false) {
    setText("labelMainStatus", "Views the chatroom without signing in.");
    showElement("labelMainStatus");
  }
});
onEvent("buttonMainView", "mouseout", function() {
  if(busy === false) {
    hideElement("labelMainStatus");
  }
});

// Main menu button actions
onEvent("buttonMainSignup", "click", function() {
  busy = true;
  var error = 0;
  
  showElement("labelMainStatus");
  setText("labelMainStatus", "Validating username..");
  readRecords("userbase", {username:getText("inputMainName")}, function(record) {
    for(var i = 0; i < record.length; i++) {
      if(record[i].name === getText("inputMainName")) {
        error = 1;
      }
    }
    if(isAlphaNumeric(getText("inputMainName")) === false) {
      error = 2;
    }
    if(getText("inputMainName").length > 16) {
      error = 4;
    }
    if(getText("inputMainName").length < 3) {
      error = 5;
    }
    if(error !== 0) {
      setText("labelMainStatus", "Error: " + errorCodes[error]);
    } else {
      showElement("labelMainStatus");
      setText("labelMainStatus", "Validation successful, creating account..");
      createRecord("userbase", {username:getText("inputMainName"), userID:getUserId(), banState:false, nameChanges:0}, function() {
        hideElement("labelMainStatus");
        setScreen("screenRoom");
        prepareRoom(1);
      });
    }
    busy = false;
  });
});
onEvent("buttonMainView", "click", function() {
  prepareRoom(0);
});

/// Pre-defined functions
function isAlphaNumeric(str) {
  var code, i, len;
  for (i = 0, len = str.length; i < len; i++) {
    code = str.charCodeAt(i);
    if (!(code > 47 && code < 58) && // numeric (0-9)
        !(code > 64 && code < 91) && // upper alpha (A-Z)
        !(code > 96 && code < 123)) { // lower alpha (a-z)
      return false;
    }
  }
  return true;
}
function prepareRoom(mode) {
  // mode is int expecting 0 or 1
  setText("textRoomChatbox", "");
  if(mode === 1) {
    setText("labelRoomStatus", "Loading, please wait..");
    showElement("labelRoomStatus");
      
    hideElement("buttonRoomBack");
    showElement("inputRoomChat");
      
      readRecords("userbase", {userID:getUserId()}, function(record) {
      writeToBox("Welcome to Chroom 2, " + record[0].username + ".");
      writeToBox("You are using build " + version);
      writeToBox("---");
      readRecords("history", {}, function(record) {
        for(var i = 0; i < record.length; i++) {
          renderMessage(record[i].time, record[i].username, record[i].message, msgRenderMode);
        }
        hideElement("labelRoomStatus");
      });
    });
  }
  if(mode === 0) {
    setText("labelRoomStatus", "Loading, please wait..");
    showElement("labelRoomStatus");
    showElement("buttonRoomBack");
    hideElement("inputRoomChat");
      
    writeToBox("Welcome to Chroom 2, Guest.");
    writeToBox("You are using build " + version);
    writeToBox("---");
    readRecords("history", {}, function(record) {
      for(var i = 0; i < record.length; i++) {
        renderMessage(record[i].time, record[i].username, record[i].message, msgRenderMode);
      }
      hideElement("labelRoomStatus");
    });
  }
}
function writeToBox(input) {
  setText("textRoomChatbox", input + "\n" + getText("textRoomChatbox"));
}
function renderMessage(time, name, message, mode) {
  switch(mode) {
    case 0:
      writeToBox("[" + time + "] [" + name + "]: " + message);
      break;
    case 1: 
      writeToBox(name + ": " + message);
      break;
    default:
      console.log(errorCodes[6]);
      break;
  }
}

/// Direct code

// Check if user already has an account, and if so, automatically sign in
readRecords("userbase", {userID:getUserId()}, function(record) {
  for(var i = 0; i < record.length; i++) {
    if(record[i].userID === getUserId()) {
      setScreen("screenRoom");
      prepareRoom(1);
    }
  }
  
});
