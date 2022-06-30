/*//VARIABLES GLOBALES
let PARAMTAB = 'PARAMETRES';
let IDSHEET ='1n4WSYjQVtDX_g285HVzyu1LA055OrFeitWy6assiw5c';
let IDPLANNING='1HbsoCzlyqMf0gQt1YtY9xpVlnC2YauYtxeOavUlcKwI';
let ss = SpreadsheetApp.openById(IDSHEET);
let ssP = SpreadsheetApp.openById(IDPLANNING);

let sheetPARAM = ss.getSheetByName(PARAMTAB);
let sheetRep = ss.getSheetByName("Réponses");
let sheetCM = ss.getSheetByName("CM");

let titre="";
let description="";
let horaire=[];

function doGet() {
    UpdateWeb();
    var template = HtmlService.createTemplateFromFile('index');
    return template.evaluate().setSandboxMode(HtmlService.SandboxMode.IFRAME);
  }
  function checkMAIL(mail)
  {
    let find="WARNING"
    mail=mail.replace(/\s/g, '');
    var textFinder = sheetRep.createTextFinder(mail);
    // Returns the first occurrence of mail in the spreadsheet.
    var firstOccurrence = textFinder.findNext();

    if (firstOccurrence) {
        find="OK"
        let rang='D' + firstOccurrence.getRowIndex().toString()
        if (sheetRep.getRange(rang).getValue().toString() != '')
        {
            find="ERROR"
        }

    }

    return find;
  }
    function UpdateWeb()
    {
      //on ouvre le formulaire à partir de l'id situé dans le sheet.
     //on récupére la derniére ligne
      let lasRow = sheetPARAM.getLastRow();
     titre = (sheetPARAM.getRange('A2:A2').getValue().toString())
      // on récupére la description du formulaire situé dans A3 et on l'assigne au form en cours.
      description=(sheetPARAM.getRange('A3:A3').getValue().toString())
      //On récupére les différents TD stocké dans la colonne C.
      let rangeTD = 'C2' + ':C' + lasRow
      let range = sheetPARAM.getRange(rangeTD).getValues();
      

    }

    function saveForm(MAIL,TD,COM)
    { //on récupére le formulaire actif
        let groupe='C';
        
        let horaire = getHoraire();
        let nRepArray = [];
        nRepArray.push(MAIL);
        nRepArray.push(groupe);
        nRepArray.push(COM);

        for (let j = 0; j < TD.length; j++) {
            idTD=TD[j].substring(TD[j].length-1);
            jour=TD[j].substring(0,TD[j].length-1)
            nRepArray.push(jour + ' - ' + horaire[idTD].toString());
        }
        sheetRep.appendRow(nRepArray);
    }

    function getTitre()
    {
        return titre;
    }
    
    function getDescription()
    {
        return description;
    }
    function getTD()
    {
        return sheetPARAM.getRange("C2:C4").getValues();  
    }

    function getHoraire()
    {
        return sheetPARAM.getRange("D2:D9").getValues();
    }


function insertCM(sheet,color,MATIERE,SALLE,JOUR,HDEB,HFIN,SIZE,TMERGE)
{
  let sheetP = ssP.getSheetByName(sheet);
  //let lastRow = rangeData.getLastColumn();

  var findJ = sheetP.createTextFinder(JOUR).findNext();
    if (findJ) {
    var col = findJ.getColumn();
    }
    
  var findH = sheetP.createTextFinder(HDEB).findNext();
    if (findH) {
    var rowH=findH.getRowIndex();
    }
  var findHF = sheetP.createTextFinder(HFIN).findNext();
  if (findHF) {
    var rowHF=findHF.getRowIndex();
  }
  if (sheetP.getRange(rowH,col,rowHF-rowH,TMERGE).isPartOfMerge())
  {
    console.log("erreur deja remplis")
  }
  else
  {
  sheetP.getRange(rowH,col,rowHF-rowH,TMERGE).merge();
  sheetP.getRange(rowH,col,rowHF-rowH,TMERGE).setFontColor('#ffffff');
  sheetP.getRange(rowH,col,rowHF-rowH,TMERGE).setVerticalAlignment("center");
  sheetP.getRange(rowH,col,rowHF-rowH,TMERGE).setHorizontalAlignment("center");
  sheetP.getRange(rowH,col,rowHF-rowH,TMERGE).setFontSize(SIZE);
  //.setFontWeight('bold')
  sheetP.getRange(rowH,col).setValue(MATIERE);
  sheetP.getRange(rowH,col).setBackground(color);
  }
}


function cleanCM(sheet,color)
{
let sheetP = ssP.getSheetByName(sheet);
let rangeData=sheetP.getDataRange();
let lastColumn = rangeData.getLastRow();
let lastRow = rangeData.getLastColumn();
let mergedRanges = rangeData.getMergedRanges();

//on Défusionne les cellules qui on étaient fusionné
for (var i = 0; i < mergedRanges.length; i++) {
  if ( mergedRanges[i].getBackground() === color)
    {
      mergedRanges[i].breakApart();
      mergedRanges[i].setBackground('#ffffff');
      mergedRanges[i].setValue('');
      mergedRanges[i].setBorder(true, true, true, true, true, true);
    }
}

for (var j=1; j < lastColumn;j++ )
{
  for (var i=1; i <  lastRow ; i++)
  {
    if (sheetP.getRange(j,i).getBackground()  === color)
  { 
      sheetP.getRange(j,i).setBackground('#ffffff')
      sheetP.getRange(j,i).setValue('')

      sheetP.getRange(j,i).setBorder(true, true, true, true, true, true);
  }
  }
}

}
function updateTD()
{
  let lastRow = sheetRep.getLastRow();
  let lastCol = sheetRep.getLastColumn();

  for (var i=2; i< lastRow ; i++)
  {
    //on récupére le mail
    var mail=sheetRep.getRange(i,1).getValue();
    //on récupére le groupe
    var groupe=sheetRep.getRange(i,2).getValue();
    console.log(groupe[0])
    //nom du TD
    j=4;
    while (sheetRep.getRange(1,j).getValue()!='')
    {
    console.log(sheetRep.getRange(1,j).getValue())
    //on récupére Le jour l'heure de début, l'heure de fin en divisant les données
    // 0 correspond au jour, 1 heure de début, 2 heure de fin.
    var TD = sheetRep.getRange(i,j).getValue().toString().split(" - ");
  
    insertCM(groupe[0],'#dcedc1',groupe + ' - '+  sheetRep.getRange(1,j).getValue(),'',TD[0],TD[1],TD[2],'8',1)
    j=j+1;
    }
  }
}



function updateCM ()
{
  //on récupérer les CMs
  var CMV3=sheetCM.getRange("A:F")
  let lastRow = sheetCM.getLastRow();

  //on supprime d'abort les anciennes valeurs.
  for (var i = 1; i < 4; i++) {
    cleanCM(sheetCM.getRange(i+1,8).getValue(),sheetCM.getRange(i+1,9).getBackground())
    for (var j=1; j< lastRow+1; j++)
    {
      if( CMV3.getValues()[j][2] === sheetCM.getRange(i+1,8).getValue())
        {
        insertCM(CMV3.getValues()[j][2],sheetCM.getRange(i+1,9).getBackground(),CMV3.getValues()[j][0],CMV3.getValues()[j][1],CMV3.getValues()[j][3],CMV3.getValues()[j][4],CMV3.getValues()[j][5],14,3)
        }
    }
  }
}

function TEST()
{
    let sheetP = ssP.getSheetByName("B");

    console.log(sheetP.getRange(20,15,3,3).isPartOfMerge());

}
*/

