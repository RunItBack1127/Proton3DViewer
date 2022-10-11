import {
    AmbientLight,
    AxesHelper,
    Box3,
    DirectionalLight,
    Group,
    Mesh,
    MeshBasicMaterial,
    MeshDepthMaterial,
    MeshLambertMaterial,
    Object3D,
    PerspectiveCamera,
    Raycaster,
    Scene,
    Sphere,
    SphereGeometry,
    Vector2,
    Vector3,
    WebGLRenderer
} from 'three';
import { MapControls, OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

import * as TWEEN from '@tweenjs/tween.js';

import { Rotation } from './Rotation';
import { useUploadStore } from '../../store/upload';
import { useStatsStore } from '../../store/stats';

let camera: PerspectiveCamera;
let tempCam: PerspectiveCamera;
let boundingSphere: Sphere;
let previousAnimationId: number;
let spherePoint: Vector3;
let raycaster = new Raycaster();
let PROTON_SCENE: Scene;

const NUM_POINTS_PER_TRIANGLE = 3;

function onModelLoaded( model: Object3D, rotation: Rotation ) {

    PROTON_SCENE = new Scene();
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

    const controls = new OrbitControls( camera, renderer.domElement );
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
        1.65 * boundingSphere.radius,
        1.65 * boundingSphere.radius,
        1.65 * boundingSphere.radius
    );

    const group = new Group();
    group.add( model );
    
    if( rotation ) {
        group.rotateX( rotation.getX() );
        group.rotateY( rotation.getY() );
        group.rotateZ( rotation.getZ() );
    }

    const sphereGeometry = new SphereGeometry( 1.65 * boundingSphere.radius );
    const sphereMesh = new Mesh( sphereGeometry, new MeshLambertMaterial({
        transparent: true,
        opacity: 0.0
    }) );
    group.add( sphereMesh );

    PROTON_SCENE.add( group );

    let numVertices = 0;
    let numTriangles = 0;

    model.traverse((object) => {

        /**
         * Tracks the number of vertices and triangles
         * in the present model file - for indexed geometry,
         * use the index count for the number of triangles,
         * otherwise delegate back to use the positional count
         */
        const mesh = object as Mesh;

        if( mesh.geometry ) {
            numVertices += mesh.geometry.attributes.position.count;
            if( mesh.geometry.index != null ) {
                numTriangles += mesh.geometry.index.count / NUM_POINTS_PER_TRIANGLE;
            }
            else {
                numTriangles += mesh.geometry.attributes.position.count / NUM_POINTS_PER_TRIANGLE;
            }
        }
    });

    const uploadStore = useUploadStore();
    uploadStore.setIsLoadingModel( false );
    uploadStore.setIsDisplayingModel( true );

    const statsStore = useStatsStore();
    statsStore.setNumVertices( numVertices );
    statsStore.setNumTriangles( numTriangles );

    function resize() {
        camera.aspect = window.innerWidth / ( window.innerHeight - 100 );
        camera.updateProjectionMatrix();
        renderer.setSize( window.innerWidth, window.innerHeight - 100 );
        renderer.render( PROTON_SCENE, camera );
    }
    resize();

    function animate() {
        previousAnimationId = requestAnimationFrame( animate );
        controls.update();
        
        const lightPos = new Vector3();
        lightPos.set( camera.position.x, camera.position.y, camera.position.z );
        spotLight.position.copy( lightPos );

        // if( intersects[ 0 ].object === sphereMesh ) {
        //     spherePoint = intersects[ 0 ].point;
        // }

        renderer.render( PROTON_SCENE, camera );

        TWEEN.update();
    }
    
    /**
     * Cancel the previous animation routine -
     * necessary for eliminating client latency
     * when loading multiple object files;
     * essentially destroys all animation memory
     * associated with the previous Three scene
     */
    cancelAnimationFrame(previousAnimationId);
    animate();

    resetProtonCamera();

    window.addEventListener('resize', () => {
        resize();
    });
}

function resetProtonCamera() {

    const pointer = new Vector2(0, 0);
    raycaster.setFromCamera( pointer, camera );

    const intersects = raycaster.intersectObjects( PROTON_SCENE.children );
    const spherePoint = intersects[ 0 ].point.clone().multiplyScalar( 1.75 );

    new TWEEN.Tween({
        x: camera.position.x,
        y: camera.position.y,
        z: camera.position.z
    })
    .to({
        x: spherePoint.x,
        y: spherePoint.y,
        z: spherePoint.z
    }, 200)
    .easing(TWEEN.Easing.Linear.None)
    .onUpdate((coords) => {
        camera.position.set(
            coords.x,
            coords.y,
            coords.z
        );
    }).start();
    
    // const spherePoint = intersects[ 0 ].point;

    // camera.position.set(
    //     spherePoint.x,
    //     spherePoint.y,
    //     spherePoint.z
    // );
    
    // camera.position.set(
    //     spherePoint.x,
    //     spherePoint.y,
    //     spherePoint.z
    // );
    // console.log( spherePoint );
}

export { onModelLoaded, resetProtonCamera };