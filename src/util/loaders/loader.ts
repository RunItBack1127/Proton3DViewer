import { parseFileExtension } from '../upload';
import { CustomLoader } from './CustomLoader';
import { OBJLoader } from './OBJLoader';

const EXTENSIONS_TO_LOADER = new Map();
EXTENSIONS_TO_LOADER.set( "obj", OBJLoader );

function getAssociatedLoader( filename: string ): CustomLoader {
    const extension = parseFileExtension( filename );
    const loader = EXTENSIONS_TO_LOADER.get( extension );
    return new loader();
}

export {
    getAssociatedLoader
}