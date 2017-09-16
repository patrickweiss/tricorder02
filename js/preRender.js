  //we can later change to indexedDB


  function loadState() {
    var triStateJSON = localStorage.getItem("triStateJSON");
    console.log("String aus localStorage:"+triStateJSON);
    var triState = {};

    if (triStateJSON == null) {
      //Initialzustand herstellen
      triState["Gewinn"] = "Yipi- Gewinn";
      triState["Ausgaben"] = {};
   
       triStateJSON = JSON.stringify(triState);
    localStorage.setItem("triStateJSON", triStateJSON);
    }else   triState = JSON.parse(triStateJSON);

    console.log("triState Objekt:"+JSON.stringify(triState));
       return triState;
  }


  function storeState(state) {
    triStateJSON = JSON.stringify(state);
    console.log("State in localStorage speichern:"+triStateJSON);
    localStorage.setItem("triStateJSON", triStateJSON);
  }
  
  
  class OOBusinessObjects{
    static getByOfficeOneIDSpreadsheetNameSheetName(folderId,spreadsheetName,sheetName){
      var kontenArray = [
        { ID: "Porto", Konto: "GUV", MwSt: "7%" },
        { ID: "Benzin", Konto: "GUV", MwSt: "19%" }
        { ID: "Hotel", Konto: "GUV", MwSt: "19%" }
      ]
      return kontenArray;
    }
  }