var ss = SpreadsheetApp.openById("1g5JmkNgvd7EQfHiA1lc9NWtmj3n9K2Q5ruhdNNh7P6g")
var ws = ss.getSheetByName("List")


function doGet() {

  return HtmlService.createTemplateFromFile("html-main").evaluate().addMetaTag('viewport', 'width=device-width, minimum-scale=1.0, maximum-scale=1.0, user-scalable=no1');
}


function include(filename){

  return HtmlService.createHtmlOutputFromFile(filename).getContent();
}

function getRow(id) {

  let lastRow = ss.getLastRow()
  Logger.log(typeof lastRow)
  let columnToSearch = ws.getRange(1, 1, lastRow, 1)
  let finder = columnToSearch.createTextFinder(id).findNext();

  if (finder) {
    return finder.getRow()
  }
}


function readAll() {

  let data = ws.getDataRange().getValues()
  data.shift()

  return data

}

function saveOne(saved) {

  if (saved[0] == "") {
    Logger.log("create")
    return createOne(saved)
  } else {
    Logger.log("update")
    return updateOne(saved)
  }
}

function createOne(saved) {
  Logger.log(saved)
   let lock = LockService.getScriptLock();
  lock.waitLock(30000);

  if (lock.hasLock()) {

    Utilities.sleep(1000);

    let data = readAll()
    let lastId = data[data.length - 1][0]
    let newId = lastId +1
    saved[0] = newId

    Logger.log(saved)

    ws.appendRow(saved)

    lock.releaseLock();

    data.push(saved)
    return data;
  }
}

function updateOne(saved) {

  Logger.log(saved)
   let lock = LockService.getScriptLock();
  lock.waitLock(30000);

  if (lock.hasLock()) {

    Utilities.sleep(1000);
    ws.getRange(getRow(saved[0]), 1, 1, 3).setValues([saved])

    lock.releaseLock();

    let data = readAll()
    return data;
  }
}

function deleteOne(id) {

  let lock = LockService.getScriptLock();
  lock.waitLock(30000);

  if (lock.hasLock()) {

    Utilities.sleep(1000);

    ws.deleteRow(getRow(id));

    lock.releaseLock();

    let data = readAll()
    return data;
  }
}
  
