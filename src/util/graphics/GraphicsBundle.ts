import {
    AmbientLight,
    Box3,
    DirectionalLight,
    Group,
    Object3D,
    PerspectiveCamera,
    Scene,
    Sphere,
    Vector3,
    WebGLRenderer
} from 'three';
import { MapControls, OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

import * as TWEEN from '@tweenjs/tween.js';

import { Rotation } from './Rotation';
import { useUploadStore } from '../../store/upload';

let camera: PerspectiveCamera;
let boundingSphere: Sphere;
let controls: OrbitControls;

function onModelLoaded( model: Object3D, rotation: Rotation ) {

    const PROTON_SCENE = new Scene();
    PROTON_SCENE.background = null;

    const mainLight = new AmbientLight( 0x555555 );
    const spotLight = new DirectionalLight( 0xcccccc );

    const PROTON_CANVAS = document.querySelector('.modelContainer');
    PROTON_CANVAS?.childNodes.forEach((node) => {
        PROTON_CANVAS.removeChild( node );
    });
    PROTON_SCENE.add( mainLight, spotLight );

    camera = new PerspectiveCamera( 45, window.innerWidth / ( window.innerHeight - 100 ), 0.1, 1000000 );
    const renderer = new WebGLRenderer({
        alpha: true,
        antialias: true
    });
    renderer.setSize( window.innerWidth, window.innerHeight - 100 );

    controls = new OrbitControls( camera, renderer.domElement );
    PROTON_CANVAS?.appendChild( renderer.domElement );

    const initialModelBox = new Box3().setFromObject( model );
    const modelCenter = {
        x: ( initialModelBox.min.x + initialModelBox.max.x ) / 2,
        y: ( initialModelBox.min.y + initialModelBox.max.y ) / 2,
        z: ( initialModelBox.min.z + initialModelBox.max.z ) / 2
    };
    model.translateX( -modelCenter.x );
    model.translateY( -modelCenter.y );
    model.translateZ( -modelCenter.z );

    const updatedModelBox = new Box3().setFromObject( model );
    boundingSphere = new Sphere();
    updatedModelBox.getBoundingSphere( boundingSphere );

    camera.position.set(
        1.65 * ( boundingSphere.center.x + boundingSphere.radius ),
        1.65 * ( boundingSphere.center.y + boundingSphere.radius ),
        1.65 * ( boundingSphere.center.z + boundingSphere.radius )
    );

    const group = new Group();
    group.add( model );
    
    if( rotation ) {
        group.rotateX( rotation.getX() );
        group.rotateY( rotation.getY() );
        group.rotateZ( rotation.getZ() );
    }

    PROTON_SCENE.add( group );

    const uploadStore = useUploadStore();
    uploadStore.setIsLoadingModel( false );
    uploadStore.setIsDisplayingModel( true );

    function resize() {
        camera.aspect = window.innerWidth / ( window.innerHeight - 100 );
        camera.updateProjectionMatrix();
        renderer.setSize( window.innerWidth, window.innerHeight - 100 );
        renderer.render( PROTON_SCENE, camera );
    }
    resize();

    function animate() {
        requestAnimationFrame( animate );
        controls.update();
        
        const lightPos = new Vector3();
        lightPos.set( camera.position.x, camera.position.y, camera.position.z );
        spotLight.position.copy( lightPos );

        renderer.render( PROTON_SCENE, camera );

        TWEEN.update();
    }
    animate();
}

function resetProtonCamera() {
    camera.position.set(
        1.65 * ( boundingSphere.center.x + boundingSphere.radius ),
        1.65 * ( boundingSphere.center.y + boundingSphere.radius ),
        1.65 * ( boundingSphere.center.z + boundingSphere.radius )
    );
}

export { onModelLoaded, resetProtonCamera };