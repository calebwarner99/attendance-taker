/**
 * Accessor object that contains data cached from the
 *  tables of the Google Sheet. This cache minimizes the
 *  number of Google Sheet accesses, which are slow.
 * 
 * Fields:
 *  Directory: Directory data
 *  DirectoryObjects: Directory data already converted to
 *    object form. Maintains identifier references.
 *  Forms: Form submission data
 *  Headers: Header sheet data
 */
const cache = {
  "Directory": [],
  "DirectoryObjects": [],
  "Forms": [],
  "Headers": []
};


/**
 * Accessor object that contains data that is accessible
 *  and modifiable for working with and mapping header
 *  attributes and names.
 * 
 * Fields:
 *  Index: Current working header
 *  Names: Current array of names corresponding to index
 *  Attributes: Current array of attributes corresponding
 *    to index
 */
const workingHeader = {
  "Index": 0,
  "Names": [],
  "Attributes": []
}



/**
 * Returns a SpreadsheetApp sheet object with the given name.
 * 
 * @param {string} sheetName - String containing the name of the sheet to be opened.
 * @return {SpreadsheetApp sheet} - SpreadsheetApp sheet object with the given name; null otherwise
 */
function openSheet(sheetName) {
  return SpreadsheetApp.getActiveSpreadsheet().getSheetByName(sheetName);
}


/**
 * Gets all data in a sheet.
 * 
 * @param {string} sheetName - String containing the name of the sheet to be accessed.
 * @return {string[]} - Data from sheet
 */
function getData(sheetName) {
  let sheet = openSheet(sheetName);
  return sheet.getDataRange().getValues();
}


/**
 * Overwrites sheet given with data given.
 * (All previous data will be lost.)
 * 
 * @param {string} sheetName - String containing the name of the sheet to be overwritten.
 * @param {string[]} - Data to write to sheet
 */
function overwriteData(sheetName, headerIndex, data) {
  let header = getHeaderNames(headerIndex);
  data.unshift(header);
  let sheet = openSheet(sheetName);
  sheet.clear();
  sheet.getRange(1, 1, data.length, data[0].length).setValues(data);
}





/**
 * Sorts the directory based on first name.
 */
function sortDirectory() {
  let sheet = openSheet(configurations.DirectorySheet);

  sheet.sort(1);
}



/**
 * Gets all the data in the directory sheet and
 *  returns it as an array of objects. Excludes
 *  the header. Verifies the data has been
 *  cached and returns it.
 * 
 * @return {Object[]} - Table of directory data
 */
function getDirectoryObjects() {
  verifyDirectoryObjects();

  return cache.DirectoryObjects;
}


/**
 * Verifies that the directory objects have been cached
 *  in the cache global object. Retrieves them if not.
 */
function verifyDirectoryObjects() {
  if (cache.DirectoryObjects.length == 0) {
    // If it has not been cached yet, retrieve it
    let directoryTable = getDirectoryTable();

    cache.DirectoryObjects = convertTableToObjects(directoryTable, configurations.DirectoryHeaderIndex);
  }
}


/**
 * Gets all the data in the directory sheet and
 *  returns it as a table, excluding the header.
 * 
 * @return {Object[][]} - Directory table
 */
function getDirectoryTable() {
  let directory = getDirectoryData();

  return directory.slice(1);
}


/**
 * Gets all the data from the directory global
 *  cache object including the header. Verifies
 *  that the table has been cached and returns it.
 * 
 * @return {Object[][]} - Directory data
 */
function getDirectoryData() {
  verifyDirectory();

  return cache.Directory;
}


/**
 * Verifies that the directory data has been cached
 *  in the cache global object. Retrieves it if it
 *  has not.
 */
function verifyDirectory() {
  if (cache.Directory.length == 0) {
    // If it has not been cached yet, retrieve it
    cache.Directory = getData(configurations.DirectorySheet);
  }
}



/**
 * Gets the most recent form submitted to the
 *  form sheet and returns its data as an object.
 * 
 * @return {Object} - Form object
 */
function getLatestFormObject() {
  return getFormObject(0);
}


/**
 * Gets the data of the form with formIndex
 *  and returns its data as an object.
 * 
 * @param {integer} formIndex - Index of the form
 * @return {Object} - Form object
 */
function getFormObject(formIndex) {
  let formEntry = getFormEntry(formIndex);

  let formObject = convertArrayToObject(formEntry, configurations.FormHeaderIndex);

  return formObject;
}


/**
 * Gets the form with the specified index
 *  and returns its data as an array.
 *  Use (0) for the most recent form submitted.
 * 
 * @param {integer} formIndex - Index of the form
 * @return {Object[]} - Data of the form
 */
function getFormEntry(formIndex) {
  return getFormTable()[formIndex];
}


/**
 * Gets all the data in the form sheet and
 *  returns it as a table. Excludes the header.
 * 
 * @return {Object[][]} - Table of form data
 */
function getFormTable() {
  let sheet = openSheet(configurations.FormSheet);

  // Reverse sort all submissions; most recent ones 
  //  are now at the top
  sheet.sort(1, false);

  return getData(configurations.FormSheet).slice(1);
}



/**
 * Gets an identifier list from the formObject.
 * 
 * An identifier list contains an array of objects,
 *  each containing fields that can be used to identify
 *  each person in the form within the directory. In
 *  most cases with the directory, the identifier is
 *  firstName, lastName (which must be unique for
 *  eah person across the directory).
 * 
 * @param {Object} - Form object
 * @return {Object[]} - Identifier list
 */
function getIdentifierList(formObject) {
  let nameArray = getNameArray(formObject);

  let identifierList = convertTableToObjects(nameArray, configurations.IdentifierHeaderIndex);

  return identifierList;
}


/**
 * Gets a name array from a formObject by combining
 *  the name fields, cleaning the data, and splitting
 *  the data into its components in an array of arrays
 *  of name components.
 * 
 * @param {Object} formObject - Form object
 * @return {Object[][]} - Name array of arrays
 */
function getNameArray(formObject) {
  let nameString = formObject.names1 + "," + formObject.names2;

  // Array of full names with no empty entries
  let fullNameArray = nameString.split(",").filter((name) => {
    return Boolean(name.trim());
  });

  // Array of split names with no empty component
  let nameArray = fullNameArray.map((fullName) => {
    return fullName.trim().split(" ").filter(Boolean);
  });

  return nameArray;
}



/**
 * Resets the header. Sets the current index
 *  in the global workingHeader object and clears the
 *  cache of the Names and Attributes fields.
 * 
 * @param {integer} headerIndex - Header index
 */
function resetHeaders(headerIndex) {
  workingHeader.Index = headerIndex;
  workingHeader.Names = [];
  workingHeader.Attributes = [];
}


/**
 * Gets front-end header row names.
 * 
 * If optional headerIndex is specified, it resets
 *  the header to that value.
 * 
 * @param {integer} [headerIndex] - Header index
 * @return {string[]} - Array of header names
 */
function getHeaderNames(headerIndex) {
  if (arguments.length > 0) {
    resetHeaders(headerIndex);
  }

  verifyHeaders();

  return workingHeader.Names;
}


/**
 * Gets back-end header attribute labels.
 * 
 * If optional headerIndex is specified, it resets
 *  the header to that value.
 * 
 * @param {integer} [headerIndex] - Header index
 * @return {string[]} - Array of header attributes
 */
function getHeaderAttributes(headerIndex) {
  if (arguments.length > 0) {
    resetHeaders(headerIndex);
  }

  verifyHeaders();

  return workingHeader.Attributes;
}


/**
 * Verifies that workingHeader object is cached with
 *  both the names and attributes fields. Fills those
 *  fields if they are empty.
 */
function verifyHeaders() {
  if (workingHeader.Names.length == 0 ||
      workingHeader.Attributes.length == 0) {
    cacheHeaders();
  }
}


/**
 * Uses the workingHeader Index value to cache the
 *  headers from the HeaderSheet to the Names
 *  and Attributes fields in the global
 *  workingHeader object.
 */
function cacheHeaders() {
  let data = getData(configurations.HeaderSheet);

  workingHeader.Names = data[workingHeader.Index];
  workingHeader.Attributes = data[workingHeader.Index + 1];
}

