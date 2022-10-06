import { FBXLoader as THREE_FBX } from 'three/examples/jsm/loaders/FBXLoader';
import { ArrayBufferCustomLoader } from "./CustomLoader";

class FBXLoader extends ArrayBufferCustomLoader {
    
    constructor() {
        super( new THREE_FBX() );
    }

    onFinished(result: string | ArrayBuffer | null): void {
        const loader = this.getLoader() as THREE_FBX;
        const model = loader.parse( result as ArrayBuffer, "" );
        this.onComplete( model );
    }
}

export { FBXLoader };