import { PlainTextCustomLoader } from "./CustomLoader";
import { OBJLoader as THREE_OBJ } from 'three/examples/jsm/loaders/OBJLoader';

class OBJLoader extends PlainTextCustomLoader {

    constructor() {
        super( new THREE_OBJ() );
    }

    onFinished(result: string | ArrayBuffer | null) {
        const loader = this.getLoader() as THREE_OBJ;
        const model = loader.parse( result as string );
        this.onComplete( model );
    }
}

export { OBJLoader };