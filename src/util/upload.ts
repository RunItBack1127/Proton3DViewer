import { InvalidFileExtensionError } from './InvalidFileExtensionError';

const VALID_FILE_EXTENSIONS = [
    "obj",
    "fbx",
    "gltf",
    "glb",
    "3dm",
    "ply",
    "stl"
];

function uploadModelFile( filename: string ) {
    const fileExtension = parseFileExtension( filename );
    if( !isValidFileExtension( fileExtension ) ) {
        throw new InvalidFileExtensionError();
    }

    // Get appropriate loader from GraphicsBundle
}

function delimitFileName( filename: string ) {
    const extIndex = filename.lastIndexOf('.');
    const properName = filename.slice(0, extIndex);
    const extension = filename.slice(extIndex + 1, filename.length);

    return [properName, extension];
}

function parseFileExtension( filename: string ) {
    return delimitFileName( filename )[ 1 ];
}

function isValidFileExtension( extension: string ) {
    return VALID_FILE_EXTENSIONS.includes( extension );
}

export {
    delimitFileName,
    isValidFileExtension,
    uploadModelFile
};