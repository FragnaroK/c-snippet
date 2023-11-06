import Parsers from "./parsers/parsers";
import Helpers from "./helpers";
import FileManager from './fileManager';
import { spinner } from './spinner';

const Utils = {
    ...Helpers,
    ...Parsers,
    ...FileManager,
    spinner
}

export default Utils; 