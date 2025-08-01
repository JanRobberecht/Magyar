var ss = SpreadsheetApp.openById("1g5JmkNgvd7EQfHiA1lc9NWtmj3n9K2Q5ruhdNNh7P6g")
var wsVocabulary = ss.getSheetByName("Vocabulary")
var wsSentences = ss.getSheetByName("Sentences")


function doGet() {

  return HtmlService.createTemplateFromFile("html-main").evaluate().addMetaTag('viewport', 'width=device-width, minimum-scale=1.0, maximum-scale=1.0, user-scalable=no1');
}


function include(filename){

  return HtmlService.createHtmlOutputFromFile(filename).getContent();
}

function getRow(sheet, id) {

  let lastRow = sheet.getLastRow()
  let columnToSearch = sheet.getRange(1, 1, lastRow, 1)
  let finder = columnToSearch.createTextFinder(id).findNext();

  if (finder) {
    return finder.getRow()
  }
}

function splitId(id) {

  let idLetter = id.charAt(0)
  let idNumber = parseInt(id.slice(1))
  let sheet, typeOfReadAll

  if (idLetter == "V") {
    sheet = wsVocabulary;
    typeOfReadAll = "vocabulary"
  }

  if (idLetter == "S") {
    sheet = wsSentences;
    typeOfReadAll = "sentences"
  }

  
  return [idNumber, sheet, typeOfReadAll]
}


function readAll(type) {

  if (type == "all") {
    return [readAllVocabulary(), readAllSentences()]
  }

  if (type == "vocabulary") {
    return [readAllVocabulary(), ""]
  }

  if (type == "sentences") {
    return ["", readAllSentences()]
  }

}

function readAllVocabulary() {
  let vocabulary =  wsVocabulary.getDataRange().getValues()
  vocabulary.shift()
  return vocabulary
}

function readAllSentences() {
  let sentences =  wsSentences.getDataRange().getValues()
  sentences.shift()
  return sentences
}

function saveOne(saved, type) {

  if (saved[0] == "") {
    return createOne(saved, type)
  } else {
    return updateOne(saved)
  }
}

function createOne(saved, type) {

  let lock = LockService.getScriptLock();
  lock.waitLock(30000);

  if (lock.hasLock()) {

   // Utilities.sleep(1000);

    let sheet = type == "vocabulary" ? wsVocabulary : wsSentences;
    let data = type == "vocabulary" ? readAll(type)[0] : readAll(type)[1];
    let lastId = data == "" ? 0 : data[data.length - 1][0]
    let newId = parseInt(lastId) +1
    saved[0] = newId

    sheet.appendRow(saved)

    //Utilities.sleep(1000)
    lock.releaseLock();

    return readAll(type)
  }
}

function updateOne(saved) {

  Logger.log(saved)
  let lock = LockService.getScriptLock();
  lock.waitLock(30000);

  if (lock.hasLock()) {

  //  Utilities.sleep(1000);

    idDetails = splitId(saved[0])
    let idNumber = idDetails[0]
    let sheet = idDetails[1]
    let type = idDetails[2]

    saved[0] = idNumber

    sheet.getRange(getRow(sheet, idNumber), 1, 1, 3).setValues([saved])

    lock.releaseLock();

    return readAll(type)
  }
}

function deleteOne(id) {

  let lock = LockService.getScriptLock();
  lock.waitLock(30000);

  if (lock.hasLock()) {

    //Utilities.sleep(1000);

    idDetails = splitId(id)
    let idNumber = idDetails[0]
    let sheet = idDetails[1]
    let type = idDetails[2]

    sheet.deleteRow(getRow(sheet, idNumber));

    lock.releaseLock();

    Logger.log(readAll(type))
    return readAll(type)

  }
}
  
