
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
  gapi.load('client:auth2', initClient);
  
}

/**
 *  Initializes the API client library and sets up sign-in state
 *  listeners.
 */
function initClient() {
  gapi.client.init({
    apiKey: API_KEY,
    clientId: CLIENT_ID,
    discoveryDocs: DISCOVERY_DOCS,
    scope: SCOPES
  }).then(function () {
    // Listen for sign-in state changes.
    gapi.auth2.getAuthInstance().isSignedIn.listen(updateSigninStatus);
    accessToken = gapi.auth2.getAuthInstance().currentUser.get().getAuthResponse().access_token;
 
    // Handle the initial sign-in state.
    updateSigninStatus(gapi.auth2.getAuthInstance().isSignedIn.get());
    //authorizeButton.onclick = handleAuthClick;
    //signoutButton.onclick = handleSignoutClick;
  });
}

/**
 *  Called when the signed in status changes, to update the UI
 *  appropriately. After a sign-in, the API is called.
 */
function updateSigninStatus(isSignedIn) {
  console.log("Google login Status:"+isSignedIn);
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