/**
 * Converts an array of arrays into an array of objects.
 * If optional headerIndex is specified, it uses that
 *  header to map attributes. Otherwise, the previous
 *  header is used.
 * 
 * @param {Object[][]} table - An array of arrays containing table's data
 * @param {integer} [headerIndex] - Index of header to map attributes to
 * @return {Object[]} - An array of objects
 */
function convertTableToObjects(table, headerIndex) {
  if (arguments.length >= 2) {
    resetHeaders(headerIndex);
  }

  // Anonymous function is to avoid passing index
  //  as headerIndex in convertArrayToObject
  return table.map((array) => {
    return convertArrayToObject(array);
  });
}


/**
 * Converts one array into an object.
 * If optional headerIndex is specified, it uses that
 *  header to map attributes. Otherwise, the previous
 *  header is used.
 * 
 * @param {Object[]} array - Array to be converted
 * @param {integer} [headerIndex] - Index of header to map attributes to
 * @return {Object} - Object with attributes from array
 */
function convertArrayToObject(array, headerIndex) {
  if (arguments.length >= 2) {
    resetHeaders(headerIndex);
  }

  return array.reduce(addAttributeToObject, {});
}


/**
 * Adds an attribute to an accumulating object.
 * Function to be called by reduce() in convertArrayToObject.
 * 
 * @param {Object[]} accumulator - Array of objects being reduced
 * @param {} currentAttribute - Current attribute to be added
 * @param {integer} index - Attribute index
 * @return {Object} - Object with new attribute
 */
function addAttributeToObject(accumulator, currentAttribute, index) {
  accumulator[mapAttribute(index)] = currentAttribute;
  return accumulator;
}


/**
 * Maps an index to an attribute.
 * 
 * @param {integer} attributeIndex - Index value to be mapped.
 * @return {string} attributeName - String the index value maps to.
 */
function mapAttribute(attributeIndex) {
  return getHeaderAttributes()[attributeIndex];
}



/**
 * Converts an array of objects into an array of arrays.
 * 
 * @param {Object[]} objects - An array of objects
 * @return {Object[][]} - An array of arrays containing table's data
 */
function convertObjectsToTable(objects) {
  let table = [];

  objects.forEach((object) => {
    table.push(convertObjectToArray(object));
  });

  return table;
}


/**
 * Converts an object into an array.
 * 
 * @param {Object} object - An object
 * @return {Object[]} - An array containing object's data
 */
function convertObjectToArray(object) {
  return Object.values(object);
}

