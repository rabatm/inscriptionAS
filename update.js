Date.prototype.getWeek = function() {
    var onejan = new Date(this.getFullYear(),0,1);
    return Math.ceil((((this - onejan) / 86400000) + onejan.getDay()+1)/7);
} 
//retourne le nb à ajouter par rapport au jours de la semaine
let getNbDay = (dayLooking) => {
  let i=0;
  while ((dayLooking!=numDay[0] && numDay.length!=i)) {
    
    if (dayLooking==numDay[i][0]) {
      return numDay[i][1];
    }
    i=i+1;
  }
}
let getENDay = (dayLooking) => {
  let i=0;
  while ((dayLooking!=englishDay[0] && englishDay.length!=i)) {
    
    if (dayLooking==englishDay[i][0]) {
      return englishDay[i][1];
    }
    i=i+1;
  }
}
//retourne la couleur d'un groupe
let getColorGroupe = (groupName) => {
  let color = '#de1f40'
  //initialisation de la variable groupe
  for (var i = 0; i < 4; i++) {
    if (sheetCM.getRange(i+2,8).getValue()==groupName)
    {
      color=sheetCM.getRange(i+2,9).getBackground()
    }
  }
  return color;
}

let updateCM = () => {
  let CMV3=sheetCM.getRange("A:I")
  let lastRow = sheetCM.getLastRow();

  for (let i =1 ; i <lastRow; i++)
  {
    let groupe = CMV3.getValues()[i][2];
    let numDayRdv=getNbDay(CMV3.getValues()[i][3].toLowerCase());
    let dayEN=getENDay(CMV3.getValues()[i][3].toLowerCase());
    let matiereRdv=CMV3.getValues()[i][0];
    let heureDeb = new Date(CMV3.getValues()[i][4]);
    let heureFin = new Date(CMV3.getValues()[i][5]);
    let calendarName="GROUPE " + groupe;
    let rdvDeb = new Date( (dateSem[0].getMonth()+1) + "/" + (dateSem[0].getDate()+numDayRdv) + "/"+ dateSem[0].getFullYear() + "-" + heureDeb.getHours() + ":" + heureDeb.getMinutes() +":00");
    let rdvFin = new Date( (dateSem[0].getMonth()+1) + "/" + (dateSem[0].getDate()+numDayRdv) + "/"+ dateSem[0].getFullYear() + "-" + heureFin.getHours() + ":" + heureFin.getMinutes() +":00");
    let currentCalendar = CalendarApp.getCalendarsByName(calendarName);
    //si l'agenda n'hésite pas on le crée.
    if (currentCalendar.length==0) {
        currentCalendar=CalendarApp.createCalendar(calendarName,{
        color:getColorGroupe(groupe)
      });  
    }
  var eventSeries = CalendarApp.getCalendarsByName(calendarName)[0].createEventSeries("DM " + matiereRdv,
    new Date(rdvDeb),
    new Date(rdvFin),
    CalendarApp.newRecurrence().addWeeklyRule()
        .onlyOnWeekday(CalendarApp.Weekday[dayEN])
        .until(new Date(dateSem[1]))); 
  }
}

let updateTD = () => {
  let repS=sheetRep.getRange("A:F")
  let lastRow = repS.getLastRow();

  for (let i =1 ; i <10; i++)
  {
    let groupe = repS.getValues()[i][1];
    let user = repS.getValues()[i][0];
    let date = (repS.getValues()[i][3]).toString().split("-");
    console.log(date[0])
    day=date[0].replace(/\s/g, '');
    let heureDeb=date[1].replace(/\s/g, '');
    let heureFin=date[2].replace(/\s/g, '');
    let numDayRdv=getNbDay(day);
    
    let dayEN=getENDay(day.toLowerCase());
    let matiereRdv=CMV3.getValues()[i][0];
    let calendarName="GROUPE " + groupe;
    /*
    let rdvDeb = new Date( (dateSem[0].getMonth()+1) + "/" + (dateSem[0].getDate()+numDayRdv) + "/"+ dateSem[0].getFullYear() + "-" + heureDeb.getHours() + ":" + heureDeb.getMinutes() +":00");
    let rdvFin = new Date( (dateSem[0].getMonth()+1) + "/" + (dateSem[0].getDate()+numDayRdv) + "/"+ dateSem[0].getFullYear() + "-" + heureFin.getHours() + ":" + heureFin.getMinutes() +":00");
    let currentCalendar = CalendarApp.getCalendarsByName(calendarName);
    //si l'agenda n'hésite pas on le crée.
    if (currentCalendar.length==0) {
        currentCalendar=CalendarApp.createCalendar(calendarName,{
        color:getColorGroupe(groupe)
      });  
    }
  
  var eventSeries = CalendarApp.getCalendarsByName(calendarName)[0].createEventSeries("TD " + matiereRdv,
    new Date(rdvDeb),
    new Date(rdvFin),
    CalendarApp.newRecurrence().addWeeklyRule()
        .onlyOnWeekday(CalendarApp.Weekday[dayEN])
        .until(new Date(dateSem[1]))); 
  eventSeries.setDescription(eventSeries.getDescription + user); */
  }

 
}








