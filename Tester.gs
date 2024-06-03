/**
 * All the following tests rely on the "Test Sheet" sheet to
 * exist and contain A1:D4 in cells A1:D4.
 * 
 * The following are control objects containing that data.
 */
const testData = [["A1", "B1", "C1", "D1"],
                ["A2", "B2", "C2", "D2"],
                ["A3", "B3", "C3", "D3"],
                ["A4", "B4", "C4", "D4"]];

const testObjects = [{"firstName":"A1","lastName":"B1","gender":"C1","year":"D1"},
                   {"firstName":"A2","lastName":"B2","gender":"C2","year":"D2"},
                   {"firstName":"A3","lastName":"B3","gender":"C3","year":"D3"},
                   {"firstName":"A4","lastName":"B4","gender":"C4","year":"D4"}];



/**
 * Run all tests.
 */
function testAllTests() {
  resetTestSheet();

  testOpenSheet();
  testOpenSheetNull();
  testGetData();
  testOverwriteData();
  testAppendData();
  testConvertTableToObjects();
  testConvertObjectsToTable();
}


/**
 * Resets the test sheet.
 */
function resetTestSheet() {
  let sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(configurations.TestSheet);
  sheet.clear();
  sheet.getRange("A1:D4").setValues(testData);
}


/**
 * Logs test case results based on status.
 * 
 * @param {boolean} status - The status of the test case.
 * @param {string} test - The test case name
 */
function logTestResults(status, test) {
  if (test) {
    status ? Logger.log(test + " Passed") : Logger.log(test + " Failed");
  } else {
    status ? Logger.log("Passed") : Logger.log("Failed");
  }
}


/**
 * Checks if two arrays are equal, and returns a boolean of the result.
 * 
 * @param {Array[*]} controlArray - Array to test with.
 * @param {Array[*]} testArray - Array to test against.
 * @return {boolean}
 */
function compareArrays(controlArray, testArray) {
  return JSON.stringify(controlArray) == JSON.stringify(testArray);
}


/**
 * Tests openSheet(); nominal case.
 */
function testOpenSheet() {
  let sheet = openSheet(configurations.TestSheet);
  let data = sheet.getDataRange().getValues();

  logTestResults(compareArrays(data, testData), "testOpenSheet");
}


/**
 * Tests openSheet(); null case.
 */
function testOpenSheetNull() {
  let sheet = openSheet("NonexistantSheet");

  logTestResults(sheet == null, "testOpenSheetNull");
}


/**
 * Tests getData(); nominal case.
 */
function testGetData() {
  let data = getData(configurations.TestSheet);

  let correctData = testData;

  logTestResults(compareArrays(data, correctData), "testGetData");
}


/**
 * Tests overwriteData(); nominal case.
 */
function testOverwriteData() {
  overwriteData(configurations.TestSheet, testData.slice(2));
  let data = getData(configurations.TestSheet);

  let correctData = testData.slice(2);

  logTestResults(compareArrays(data, correctData), "testOverwriteData");

  resetTestSheet();
}


/**
 * Tests convertTableToObjects(); nominal case.
 */
function testConvertTableToObjects() {
  let objects = convertTableToObjects(testData, configurations.DirectoryHeaderIndex);
  let correctObjects = testObjects;

  logTestResults(compareArrays(objects, correctObjects), "testConvertTableToObjects");
}

/**
 * Tests convertObjectsToTable(); nominal case.
 */
function testConvertObjectsToTable() {
  let table = convertObjectsToTable(testObjects);
  let correctTable = testData;

  logTestResults(compareArrays(table, correctTable), "testConvertObjectsToTable");
}

























