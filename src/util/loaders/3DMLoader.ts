import { Rhino3dmLoader as THREE_RHINO } from 'three/examples/jsm/loaders/3DMLoader';
import { ArrayBufferCustomLoader } from "./CustomLoader";

class Rhino3DMLoader extends ArrayBufferCustomLoader {

    constructor() {
        super( new THREE_RHINO() );
    }

    onFinished(result: string | ArrayBuffer | null): void {
        const loader = this.getLoader() as THREE_RHINO;
        loader.parse( result as ArrayBuffer, this.onComplete, this.onError );
    }

    onError(error: ErrorEvent) {
        console.error( error );
    }
}

export { Rhino3DMLoader };