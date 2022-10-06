import { STLLoader as THREE_STL } from 'three/examples/jsm/loaders/STLLoader';
import { ArrayBufferCustomLoader } from './CustomLoader';

class STLLoader extends ArrayBufferCustomLoader {

    constructor() {
        super( new THREE_STL() );
    }

    onFinished(result: string | ArrayBuffer | null): void {
        const loader = this.getLoader() as THREE_STL;
        const bufferGeometry = loader.parse( result as ArrayBuffer );
        const model = this.createMesh( bufferGeometry );
        this.onComplete( model );
    }
}

export { STLLoader };