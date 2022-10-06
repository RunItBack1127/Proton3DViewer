import { Rotation } from '../graphics/Rotation';
import { Color, Mesh, MeshStandardMaterial } from 'three';
import type { BufferGeometry, Object3D } from 'three';

import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader';
import { STLLoader } from 'three/examples/jsm/loaders/STLLoader';
import { PLYLoader } from 'three/examples/jsm/loaders/PLYLoader';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader';
import { Rhino3dmLoader } from 'three/examples/jsm/loaders/3DMLoader';

type ArrayBufferLoader = GLTFLoader | STLLoader | PLYLoader | Rhino3dmLoader | FBXLoader;
type PlainTextLoader = OBJLoader;
type SupportedLoader =  ArrayBufferLoader | PlainTextLoader;

/**
 * Loader implementation providing a wrapper with baseline
 * functionality for reading file contents, leveraging an
 * associated Three.js loader, defining a concrete rotation,
 * and providing a default mesh for meshes without explicitly
 * defined materials (e.g. STL, PLY)
 */
abstract class CustomLoader {

    /** Associated Three.js loader */
    protected readonly refLoader: SupportedLoader;

    /**
     * Invoked to display the 3D model on the
     * Proton canvas; passed an instance of
     * an Object3D which is then shown to
     * the user
     */
    protected complete: Function | null;

    /**
     * Defines a default rotation offset for the
     * object, such that when the model is displayed,
     * it is positioned with the "top" of the model
     * facing the camera (this functionality is necessary
     * for some 3D model types, i.e. 3DM)
     */
    private rotation: Rotation;

    constructor( refLoader: SupportedLoader ) {
        this.refLoader = refLoader;
        this.rotation = new Rotation( 0, 0, 0 );
        this.complete = null;
    }

    /**
     * Sets the default rotation of the loader
     * dynamically
     * 
     * @param rotation default model rotation
     */
    setRotation( rotation: Rotation ) {
        this.rotation = rotation;
    }

    /**
     * Reads the provided 3D model file in a
     * and passes the loaded contents to the
     * onFinished routine, which will handle
     * invoking the parse() routine for the
     * associated loader
     * 
     * @param file 3D model file
     */
    readFileContents( file: File ) {
        const reader = new FileReader();
        reader.addEventListener('load', () => {
            this.onFinished( reader.result );
        });
        this.loadFileContents( reader, file );
    }

    /**
     * Loads the provided 3D model file and eventually
     * invokes the provided completion method to
     * display the 3D model on the Proton canvas
     * 
     * @param file       3D model file
     * @param complete method which displays the
     *                   3D model file on the canvas
     */
    load( file: File, complete: Function ) {
        this.complete = complete;
        this.readFileContents( file );
    }

    /**
     * Defines a default Mesh to be created as a
     * wrapper for Three.js loaders that create
     * BufferGeometry for the model rather than an
     * Object3D (e.g. STL, PLY loaders)
     * 
     * @param   bufferGeometry buffer geometry created
     *                         after invoking the parse()
     *                         method of the associated
     *                         Three.js loader
     * @returns default Mesh with default material wrapping
     *          the provided buffer geometry
     */
    createMesh( bufferGeometry: BufferGeometry ) {
        const material = new MeshStandardMaterial();
        material.flatShading = true;
        material.color = new Color( 0xE6E6E6 );

        return new Mesh( bufferGeometry, material );
    }

    /**
     * Retrieves the associated Three.js loader,
     * with the appropriate parse method type provided
     * with the specific implementation of the loader
     */
    getLoader(): SupportedLoader {
        return this.refLoader;
    }

    /**
     * Retrieve the rotation configured for the
     * custom loader
     * 
     * @returns loader rotation
     */
    getRotation() {
        return this.rotation;
    }

    /**
     * Invoked to display the provided 3D model onto
     * the Proton canvas
     * 
     * @param model 3D model to display
     */
    onComplete( model: Object3D ) {
        if( this.complete ) {
            this.complete( model );
        }
    }

    /**
     * Defines how the provided reader should parse
     * the contents of the provided 3D model file;
     * depending on the Three.js loader, this file
     * will need to be read in various ways (i.e. as
     * plaintext, an array buffer, etc.)
     * 
     * @param reader FileReader to parse 3D model file
     * @param file   3D model file to parse
     */
    abstract loadFileContents( reader: FileReader, file: File ): void;

    /**
     * Uses the contents of the 3D model file, as read
     * by the associated file reader, to invoke the parse()
     * method of the associated Three.js loader.
     * 
     * Depending on the implementation of the parse() method,
     * the custom loader will need to implement this differently
     * (e.g. handle buffer geometry and create a default mesh,
     * pass the Object3D directly, etc.).
     * 
     * @param result 3D model file contents as reader from FileReader
     */
    abstract onFinished( result: string | ArrayBuffer | null ): void;
}

abstract class ArrayBufferCustomLoader extends CustomLoader {

    constructor( refLoader: ArrayBufferLoader ) {
        super( refLoader );
    }

    loadFileContents(reader: FileReader, file: File): void {
        reader.readAsArrayBuffer( file );
    }
}

abstract class PlainTextCustomLoader extends CustomLoader {

    loadFileContents(reader: FileReader, file: File): void {
        reader.readAsText( file );
    }
}

export {
    ArrayBufferCustomLoader,
    PlainTextCustomLoader,
    CustomLoader
};