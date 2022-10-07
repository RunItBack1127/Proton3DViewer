import { PLYLoader as THREE_PLY } from 'three/examples/jsm/loaders/PLYLoader';
import { ArrayBufferCustomLoader } from './CustomLoader';

class PLYLoader extends ArrayBufferCustomLoader {

    constructor() {
        super( new THREE_PLY() );
    }

    onFinished(result: string | ArrayBuffer | null): void {
        const loader = this.getLoader() as THREE_PLY;
        const bufferGeometry = loader.parse( result as ArrayBuffer );
        const model = this.createMesh( bufferGeometry );
        this.onComplete( model );
    }
}

export { PLYLoader };