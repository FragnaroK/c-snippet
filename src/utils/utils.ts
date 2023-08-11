import Parsers from "./parsers/parsers";
import Helpers from "./helpers";
import FileManager from './fileManager';

const Utils = {
    ...Helpers,
    ...Parsers,
    ...FileManager
}

export default Utils; 