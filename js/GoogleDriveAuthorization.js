// Client ID and API key from the Developer Console
var CLIENT_ID = '745028189108-k9dk9mp8ttpu3orj3p4brsro3btb68u4.apps.googleusercontent.com';
var API_KEY = 'AIzaSyBeigsvPpOn9AUPNPUP-VYETf2tJDaAihw';

// Array of API discovery doc URLs for APIs used by the quickstart
var DISCOVERY_DOCS = ["https://www.googleapis.com/discovery/v1/apis/drive/v3/rest"];


// Authorization scopes required by the API; multiple scopes can be
// included, separated by spaces.
var SCOPES = 'https://www.googleapis.com/auth/drive.metadata.readonly https://www.googleapis.com/auth/drive https://www.googleapis.com/auth/drive.file https://www.googleapis.com/auth/drive.appdata';

// Token um Datei in Google Drive speichern zu können
var accessToken;
var globaleBelegDatei;

/*global gapi,MediaUploader*/
/**
*  On load, called to load the auth2 library and API client library.
*/
 
function handleClientLoad() {
  gapi.load('client:auth2', initClientDriveApi);
  
}

function initClientDriveApi() {
  gapi.client.init({
    apiKey: API_KEY,
    clientId: CLIENT_ID,
    discoveryDocs: DISCOVERY_DOCS,
    scope: SCOPES
  }).then(function () {
    // Listen for sign-in state changes.
    gapi.auth2.getAuthInstance().isSignedIn.listen(updateSigninStatusDriveApi);
    accessToken = gapi.auth2.getAuthInstance().currentUser.get().getAuthResponse().access_token;
 
    // Handle the initial sign-in state.
    updateSigninStatusDriveApi(gapi.auth2.getAuthInstance().isSignedIn.get());
    //authorizeButton.onclick = handleAuthClick;
    //signoutButton.onclick = handleSignoutClick;
  });
}

/**
 *  Called when the signed in status changes, to update the UI
 *  appropriately. After a sign-in, the API is called.
 */
function updateSigninStatusDriveApi(isSignedIn) {
  console.log("Google login Status DriveApi:"+isSignedIn);
  if (!isSignedIn)gapi.auth2.getAuthInstance().signIn();
    
  OOGoogleConnector.getOrCreateOOFolder();
  
}

class OOGoogleConnector{
  static getOrCreateOOFolder(){
    var OORootFolder= gapi.client.drive.files.list({
      "q": "fullText contains 'oofolderv0035'"
    })
        .then(function(response) {
          // Handle the results here (response.result has the parsed body).
          console.log("Response", response);
        }, function(error) {
          console.error("Execute error", error);
        });
    console.log("OORootFolder:");
    console.log(OORootFolder);
  }
}