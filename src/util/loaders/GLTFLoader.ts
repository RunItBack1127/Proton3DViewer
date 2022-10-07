import { ArrayBufferCustomLoader } from "./CustomLoader";
import { GLTFLoader as THREE_GLTF } from 'three/examples/jsm/loaders/GLTFLoader';

class GLTFLoader extends ArrayBufferCustomLoader {

    constructor() {
        super( new THREE_GLTF() );
    }

    onFinished(result: string | ArrayBuffer | null): void {
        const loader = this.getLoader() as THREE_GLTF;
        loader.parse( result as ArrayBuffer, "", ( modelScene ) => {
            this.onComplete( modelScene.scene );
        }, this.onError );
    }

    onError(error: ErrorEvent): void {
        console.error( error );
    }
}

export { GLTFLoader };