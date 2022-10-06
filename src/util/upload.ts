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

function parseFileExtension( filename: string ) {
    return filename.slice(filename.lastIndexOf('.') + 1, filename.length);
}

function isValidFileExtension( extension: string ) {
    return VALID_FILE_EXTENSIONS.includes( extension );
}

export { uploadModelFile, isValidFileExtension };