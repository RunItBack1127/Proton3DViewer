import {
    AmbientLight,
    Box3,
    DirectionalLight,
    Group,
    Mesh,
    MeshBasicMaterial,
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
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

import * as TWEEN from '@tweenjs/tween.js';

import { Rotation } from './Rotation';
import { useUploadStore } from '../../store/upload';
import { useStatsStore } from '../../store/stats';

let previousAnimationId: number;

let PROTON_CAMERA: PerspectiveCamera;
let PROTON_MODEL_BOUNDING_SPHERE: Sphere;
let PROTON_SCENE: Scene;
let PROTON_CAMERA_SPHERE: Mesh;

const NUM_POINTS_PER_TRIANGLE = 3;
const ZOOM_ANIMATION_DURATION = 50;

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

    PROTON_CAMERA = new PerspectiveCamera( 45, window.innerWidth / ( window.innerHeight - 100 ), 0.1, 1000000 );
    const renderer = new WebGLRenderer({
        alpha: true,
        antialias: true
    });
    renderer.setSize( window.innerWidth, window.innerHeight - 100 );

    const controls = new OrbitControls( PROTON_CAMERA, renderer.domElement );
    controls.enablePan = false;

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
    PROTON_MODEL_BOUNDING_SPHERE = new Sphere();
    updatedModelBox.getBoundingSphere( PROTON_MODEL_BOUNDING_SPHERE );

    const refDistance = 1.65 * PROTON_MODEL_BOUNDING_SPHERE.radius;

    PROTON_CAMERA.position.set(
        refDistance,
        refDistance,
        refDistance
    );
    controls.minDistance = Math.sqrt(
        ( refDistance * refDistance ) +
        ( refDistance * refDistance ) );

    const group = new Group();
    group.add( model );
    
    if( rotation ) {
        group.rotateX( rotation.getX() );
        group.rotateY( rotation.getY() );
        group.rotateZ( rotation.getZ() );
    }

    const sphereGeometry = new SphereGeometry( 1.65 * PROTON_MODEL_BOUNDING_SPHERE.radius );
    PROTON_CAMERA_SPHERE = new Mesh( sphereGeometry, new MeshBasicMaterial({
        color: 0xffffff
    }) );
    group.add( PROTON_CAMERA_SPHERE );

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

    function resize() {
        PROTON_CAMERA.aspect = window.innerWidth / ( window.innerHeight - 100 );
        PROTON_CAMERA.updateProjectionMatrix();
        renderer.setSize( window.innerWidth, window.innerHeight - 100 );
        renderer.render( PROTON_SCENE, PROTON_CAMERA );
    }
    resize();

    function animate() {
        previousAnimationId = requestAnimationFrame( animate );
        controls.update();
        
        const lightPos = new Vector3();
        lightPos.set( PROTON_CAMERA.position.x, PROTON_CAMERA.position.y, PROTON_CAMERA.position.z );
        spotLight.position.copy( lightPos );

        renderer.render( PROTON_SCENE, PROTON_CAMERA );

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

    adjustProtonCamera( 0 );

    const uploadStore = useUploadStore();
    uploadStore.setIsDisplayingModel( true );
    uploadStore.setIsLoadingModel( false );

    const statsStore = useStatsStore();
    statsStore.setNumVertices( numVertices );
    statsStore.setNumTriangles( numTriangles );

    window.addEventListener('resize', () => {
        resize();
    });
}

function resetProtonCamera() {
    adjustProtonCamera( ZOOM_ANIMATION_DURATION );
}

function adjustProtonCamera( animationDuration: number ) {

    const raycaster = new Raycaster();
    const pointer = new Vector2(0, 0);
    raycaster.setFromCamera( pointer, PROTON_CAMERA );

    const intersects = raycaster.intersectObjects( PROTON_SCENE.children );
    const sphereIntersect = intersects.filter((intersect) => intersect.object === PROTON_CAMERA_SPHERE);
    const spherePoint = sphereIntersect[0].point.clone().multiplyScalar( 1.75 );

    new TWEEN.Tween({
        x: PROTON_CAMERA.position.x,
        y: PROTON_CAMERA.position.y,
        z: PROTON_CAMERA.position.z
    })
    .to({
        x: spherePoint.x,
        y: spherePoint.y,
        z: spherePoint.z
    }, animationDuration)
    .easing(TWEEN.Easing.Linear.None)
    .onUpdate((coords) => {
        PROTON_CAMERA.position.set(
            coords.x,
            coords.y,
            coords.z
        );
    })
    .onComplete(() => {
        PROTON_CAMERA_SPHERE.material = new MeshLambertMaterial({
            transparent: true,
            opacity: 0.0
        });
    })
    .start();
}

export { onModelLoaded, resetProtonCamera };