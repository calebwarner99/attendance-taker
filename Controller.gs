/**
 * Initiates data handling on form submit.
 */
function onFormSubmit() {
  processFormSubmission();
}


/**
 * Does all handling necessary for a form submission.
 *  This includes processing the form, updating lastSeenDate
 *  for all entries in the form, and adding new names
 *  to the directory.
 */
function processFormSubmission() {
  let formObject = getLatestFormObject();
  let identifierList = getIdentifierList(formObject);
  takeAttendance(identifierList, formObject.date);
}


/**
 * Finds all people in identifierList that
 *  match an entry in the directory, and modifies
 *  the lastSeenDate fields to reflect their attendance.
 *  Afterwards, it returns an identifier list of
 *  any name combination that was not found in the
 *  directory.
 * 
 * @param {Object[]} identifierList - A list of identifiers
 * @param {Date} date - The date of the event
 * @return {Object[]} - A list of identifiers that were not found
 *                       in the directory with lastSeenDate filled in
 */
function takeAttendance(identifierList, date) {
  let attendees = findDirectoryEntries(identifierList);

  addNewNames(attendees, identifierList);

  // Update lastSeenDate field for each attendee
  attendees.filter(Boolean).forEach((attendee) => {
    if (date > attendee.lastSeenDate) {
      updateField(attendee, "lastSeenDate", date);
    }
  });

  overwriteData(configurations.DirectorySheet, configurations.DirectoryHeaderIndex, convertObjectsToTable(cache.DirectoryObjects));
  sortDirectory();
}


/**
 * Finds all the directory entries of an identifier
 *  list and returns an array containing references
 *  to them. An element of the array will be null
 *  if no directory entries matched.
 * 
 * @param {Object[]} identifierList - A list of identifiers
 * @return {Object[]} - Array of directory matches
 */
function findDirectoryEntries(identifierList) {
  return identifierList.map(findDirectoryEntry);
}


/**
 * Finds a single entry in the directory matching
 *  the given identifier. Returns null if no
 *  matching directory entries were found.
 * 
 * @param {Object} - Identifier
 * @return {Object} - Directory object reference
 */
function findDirectoryEntry(identifier) {
  let directory = getDirectoryObjects();

  return directory.find((entry) => {
    return entry.firstName == identifier.firstName &&
          entry.lastName == identifier.lastName;
  });
}


/**
 * Creates a list that contains names for each entry
 *  in identifierList that did not have a coresponding
 *  entry in attendees, thus those names do not have
 *  an entry in the directory and they are new.
 * 
 * @param {Object[]} attendees - Directory references to attendees
 * @param {Object[]} identifierList - A list of identifiers
 * @return {Object[]} newNamesList - List of identifiers that are new names
 */
function addNewNames(attendees, identifierList) {
attendees.forEach((attendee, index) => {
    if (!attendee) {
      attendees[index] = createNewDirectoryObject(identifierList[index]);
      cache.DirectoryObjects.push(attendees[index]);
    }
  });
}


/**
 * Creates a new directory object using the first and last
 *  name given from an identifier.
 * 
 * @param {Object} identifier - Identifier with name to use
 * @return {Object} - New directory object with name filled in
 *                      but other fields empty
 */
function createNewDirectoryObject(identifier) {
  let header = getHeaderAttributes(configurations.DirectoryHeaderIndex);

  let tempArray = Array(header.length).fill("");
  tempArray[0] = identifier.firstName;
  tempArray[1] = identifier.lastName;

  return convertArrayToObject(tempArray);
}


/**
 * Updates a specified field to newValue.
 * 
 * @param {Object[]} attendee - Attendee
 * @param {Object} field - Field
 * @param {Object} newValue - New value
 */
function updateField(attendee, field, newValue) {
  attendee[field] = newValue;
}

