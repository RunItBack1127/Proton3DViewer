import { parseFileExtension } from '../upload';

import { CustomLoader } from './CustomLoader';
import { OBJLoader } from './OBJLoader';
import { FBXLoader } from './FBXLoader';
import { GLTFLoader } from './GLTFLoader';
import { PLYLoader } from './PLYLoader';
import { STLLoader } from './STLLoader';
import { Rhino3DMLoader } from './3DMLoader';

const EXTENSIONS_TO_LOADER = new Map();
EXTENSIONS_TO_LOADER.set( "obj", OBJLoader );
EXTENSIONS_TO_LOADER.set( "fbx", FBXLoader );
EXTENSIONS_TO_LOADER.set( "gltf", GLTFLoader );
EXTENSIONS_TO_LOADER.set( "glb", GLTFLoader );
EXTENSIONS_TO_LOADER.set( "ply", PLYLoader );
EXTENSIONS_TO_LOADER.set( "stl", STLLoader );
EXTENSIONS_TO_LOADER.set( "3dm", Rhino3DMLoader );

function getAssociatedLoader( filename: string ): CustomLoader {
    const extension = parseFileExtension( filename );
    const loader = EXTENSIONS_TO_LOADER.get( extension );
    return new loader();
}

export {
    getAssociatedLoader
}