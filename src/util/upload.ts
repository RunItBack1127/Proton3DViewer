import { getAssociatedLoader } from './loaders/loader';
import { InvalidFileExtensionError } from './InvalidFileExtensionError';
import { onModelLoaded } from './graphics/GraphicsBundle';
import { useStatsStore } from '../store/stats';
import { Object3D } from 'three';

const VALID_FILE_EXTENSIONS = [
    "obj",
    "fbx",
    "gltf",
    "glb",
    "3dm",
    "ply",
    "stl"
];

function uploadModelFile( file: File ) {
    const filename = file.name;
    const fileExtension = parseFileExtension( filename );
    if( !isValidFileExtension( fileExtension ) ) {
        throw new InvalidFileExtensionError();
    }
    
    const loader = getAssociatedLoader( filename );

    const statsStore = useStatsStore();
    statsStore.startUpload();
    statsStore.setFileSize( file.size );

    loader.load( file, (model: Object3D) => {
        onModelLoaded( model, loader.getRotation() );
        statsStore.endUpload();
    });
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
    parseFileExtension,
    uploadModelFile
};