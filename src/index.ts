import CSnippet from "./converter";

/**
 * @module c-snippet module for converting snippets from selected editors to other editors
 * @version 1.0.0
 * @requires xml2js https://www.npmjs.com/package/xml2js
 * @requires cson-parser https://www.npmjs.com/package/cson-parser
 * 
 * @example   
 * const cSnippet = new CSnippet(snippets, <targetEditors>, optional: <sourceEditor>);
 * const parsedSnippets = cSnippet.parse(optional: <source>);
 * cSnippet.convert(parsedSnippets);
 * 
 * 
 * @param {string} snippets - Snippets to be converted
 * @param {Array} target - Target editors to convert to
 * @param {String} source - Source editor to convert from
 * 
 * @returns {CSnippet} - Returns a new instance of CSnippet with the given parameters
 * 
 */
export default CSnippet;
