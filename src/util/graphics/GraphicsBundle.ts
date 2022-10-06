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

import {
    OrbitControls
} from 'three/examples/jsm/controls/OrbitControls';

function onModelLoaded( model: Object3D, rotation ) {

    const PROTON_SCENE = new Scene();
    PROTON_SCENE.background = null;

    const mainLight = new AmbientLight( 0xffffff );
    const spotLight = new DirectionalLight( 0x555555 );

    let currentModelGroup = null;

    const PROTON_CANVAS = document.querySelector('.modelContainer');
    PROTON_CANVAS?.childNodes.forEach((node) => {
        PROTON_CANVAS.removeChild( node );
    });
    PROTON_SCENE.add( mainLight, spotLight );

    const camera = new PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 0.1, 10000 );
    const renderer = new WebGLRenderer({
        alpha: true,
        antialias: true
    });
    renderer.setSize( window.innerWidth, window.innerHeight );

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
    const boundingSphere = new Sphere();
    updatedModelBox.getBoundingSphere( boundingSphere );

    camera.position.set(
        1.65 * ( boundingSphere.center.x + boundingSphere.radius ),
        1.65 * ( boundingSphere.center.y + boundingSphere.radius ),
        1.65 * ( boundingSphere.center.z + boundingSphere.radius )
    );

    const group = new Group();
    group.add( model );

    group.rotateX( rotation.getX() );
    group.rotateY( rotation.getY() );
    group.rotateZ( rotation.getZ() );

    PROTON_SCENE.add( group );

    function resize() {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize( window.innerWidth, window.innerHeight );
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
    }
    animate();
}

export { onModelLoaded };