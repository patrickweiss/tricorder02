

// Konfiguration
var OOVersion="0035";
var SteuerJahr="2017";
var defaultOOFolderName="EÜR und UStVA "+SteuerJahr;



 /*global localStorage*/ 

 




class OO{
  static getAusgabenInMonat(monat,callbackFunktion){
     var belege=["eins","zwei",monat];
  return belege;
  }
}



function mobilelog(message){
 var mobilelogElement=document.getElementById("mobileconsole");
 mobilelogElement.innerHTML+="<br>"+message;
}
  

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