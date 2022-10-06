import { Object3D } from 'three';
import { Rhino3dmLoader as THREE_RHINO } from 'three/examples/jsm/loaders/3DMLoader';
import { Rotation } from '../graphics/Rotation';
import { ArrayBufferCustomLoader } from "./CustomLoader";

class Rhino3DMLoader extends ArrayBufferCustomLoader {

    constructor() {
        super( new THREE_RHINO() );
        this.setRotation( new Rotation( -90, 0, 0 ) );
    }

    onFinished(result: string | ArrayBuffer | null): void {
        const loader = this.getLoader() as THREE_RHINO;
        loader.parse( result as ArrayBuffer, this.complete as (object: Object3D) => {}, this.onError );
    }

    onError(error: ErrorEvent) {
        console.error( error );
    }
}

export { Rhino3DMLoader };