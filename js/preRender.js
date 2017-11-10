
// Client ID and API key from the Developer Console
var CLIENT_ID = '745028189108-k9dk9mp8ttpu3orj3p4brsro3btb68u4.apps.googleusercontent.com';
var API_KEY = 'AIzaSyBeigsvPpOn9AUPNPUP-VYETf2tJDaAihw';

// Array of API discovery doc URLs for APIs used by the quickstart
var DISCOVERY_DOCS = ["https://www.googleapis.com/discovery/v1/apis/drive/v3/rest"];

// Array of API discovery doc URLs for APIs used by the quickstart
var DISCOVERY_DOCS_AppsScript = ["https://script.googleapis.com/$discovery/rest?version=v1"];

// Authorization scopes required by the API; multiple scopes can be
// included, separated by spaces.
var SCOPES = 'https://www.googleapis.com/auth/drive.metadata.readonly https://www.googleapis.com/auth/drive https://www.googleapis.com/auth/drive.file https://www.googleapis.com/auth/drive.appdata';

// Token um Datei in Google Drive speichern zu können
var accessToken;
var globaleBelegDatei;

// Konfiguration
var OOVersion="0035";
var SteuerJahr="2017";
var defaultOOFolderName="EÜR und UStVA "+SteuerJahr;

// Key aus OORestAPI, weiss noch nicht wofür der gut ist...
var OORestAPIID = "MD63cf3nzAL_2sNVT2SrufBrwxofbW-GS";
var OORestAPIGCPClientID="55763199609-f68c4lephs94o5bin4cbm13l4pi5rshl.apps.googleusercontent.com";
var OORestAPIGCPKey="xVTYW8PGrZeq-iip4a-xoSu2";

/*global gapi,MediaUploader*/
/**
*  On load, called to load the auth2 library and API client library.
*/
 
function handleClientLoad() {
  gapi.load('client:auth2', initClientAppsScript);
  
}

/**
 *  Initializes the API client library and sets up sign-in state
 *  listeners.
 */
 
function initClientAppsScript() {
  gapi.client.init({
    discoveryDocs: DISCOVERY_DOCS_AppsScript,
    clientId: OORestAPIGCPClientID,
    scope: SCOPES
  }).then(function() {
    // Listen for sign-in state changes.
    gapi.auth2.getAuthInstance().isSignedIn.listen(updateSigninStatus);

    // Handle the initial sign-in state.
    updateSigninStatus(gapi.auth2.getAuthInstance().isSignedIn.get());

  });
}


/**
 *  Called when the signed in status changes, to update the UI
 *  appropriately. After a sign-in, the API is called.
 */
function updateSigninStatus(isSignedIn) {
  console.log("Google login Status AppsScriptApi:"+isSignedIn);
  if (!isSignedIn)gapi.auth2.getAuthInstance().signIn();
  if (isSignedIn)callScriptFunction();
}


      function callScriptFunction() {
        var scriptId = "MD63cf3nzAL_2sNVT2SrufBrwxofbW-GS";

        // Call the Execution API run method
        //   'scriptId' is the URL parameter that states what script to run
        //   'resource' describes the run request body (with the function name
        //              to execute)
        gapi.client.script.scripts.run({
          'scriptId': scriptId,
          'resource': {
            'function': 'getFoldersUnderRoot'
          }
        }).then(function(resp) {
          var result = resp.result;
          if (result.error && result.error.status) {
            // The API encountered a problem before the script
            // started executing.
            console.log('Error calling API:');
            console.log(JSON.stringify(result, null, 2));
          } else if (result.error) {
            // The API executed, but the script returned an error.

            // Extract the first (and only) set of error details.
            // The values of this object are the script's 'errorMessage' and
            // 'errorType', and an array of stack trace elements.
            var error = result.error.details[0];
            console.log('Script error message: ' + error.errorMessage);

            if (error.scriptStackTraceElements) {
              // There may not be a stacktrace if the script didn't start
              // executing.
              console.log('Script error stacktrace:');
              for (var i = 0; i < error.scriptStackTraceElements.length; i++) {
                var trace = error.scriptStackTraceElements[i];
                console.log('\t' + trace.function + ':' + trace.lineNumber);
              }
            }
          } else {
            // The structure of the result will depend upon what the Apps
            // Script function returns. Here, the function returns an Apps
            // Script Object with String keys and values, and so the result
            // is treated as a JavaScript object (folderSet).

            var folderSet = result.response.result;
            if (Object.keys(folderSet).length == 0) {
                console.log('No folders returned!');
            } else {
              console.log('Folders under your root folder:');
              Object.keys(folderSet).forEach(function(id){
                console.log('\t' + folderSet[id] + ' (' + id  + ')');
              });
            }
          }
        });
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

class OO{
  static getAusgabenInMonat(monat,callbackFunktion){
     var belege=["eins","zwei",monat];
  return belege;
  }
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

function mobilelog(message){
 var mobilelogElement=document.getElementById("mobileconsole");
 mobilelogElement.innerHTML+="<br>"+message;
}
  
 /*global localStorage*/ 
class OOBusinessObjects{
  static getByOfficeOneIDSpreadsheetNameSheetName(folderId,spreadsheetName,sheetName){
    var kontenArray = [
      { ID: "Porto", Konto: "GUV", MwSt: "7%" },
      { ID: "Benzin", Konto: "GUV", MwSt: "19%" },
      { ID: "Hotel", Konto: "GUV", MwSt: "19%" }
    ]
    return kontenArray;
  }
  static addAusgabe(buchungsperiode,betrag,konto,belegurl){
    var ausgabenArray=JSON.parse(localStorage.getItem("ausgabe"+buchungsperiode));
    if (!ausgabenArray)ausgabenArray=[];
    var neueAusgabe={buchungsperiode:buchungsperiode,betrag:betrag,konto:konto,belegurl:belegurl};
    ausgabenArray.push(neueAusgabe);
    localStorage.setItem("ausgabe"+buchungsperiode,JSON.stringify(ausgabenArray));
  }
  static saveFile(metadata, file, folderId) {
    console.log("Beleg in GoogleDrive speichern");
    var fileid;

    var fileMetadata = {
      "title": metadata.name,
      parents: [{id:folderId}],
      description: JSON.stringify(metadata)
    };

/*
    gapi.client.drive.files.create({
      resource: fileMetadata,
      fields: 'id'
    }).then(function(response) {
      fileid=response.result.id;
      console.log(fileid);
    });
*/

    var uploader = new MediaUploader({
      file: globaleBelegDatei,
      token: accessToken,
      metadata:fileMetadata,
      onComplete: function(data) {
        mobilelog(data);
      }
    });
    uploader.upload();

  }
  
}