import * as THREE from 'three';

import { FirstPersonControls } from 'three/addons/controls/FirstPersonControls.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

let camera, scene, renderer, modelR;
let controls;
const clock = new THREE.Clock();

function init(){
    const container = document.createElement( 'div' );
    document.body.appendChild( container );

    camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 0.25, 50 );
    camera.position.set( 0, 0, 10 );

    scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2( 0xefd1b5, 0.005 );

    renderer = new THREE.WebGLRenderer( { antialias: true } );
    renderer.setPixelRatio( window.devicePixelRatio );
    renderer.setSize( window.innerWidth, window.innerHeight );
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1;
    renderer.outputEncoding = THREE.sRGBEncoding;
    container.appendChild( renderer.domElement );

    controls = new FirstPersonControls( camera, renderer.domElement );
	controls.movementSpeed = 1;
	controls.lookSpeed = 0.01;


    window.addEventListener( 'resize', onWindowResize );

    const geoFloor = new THREE.BoxGeometry( 2000, 0.1, 2000 );
	const matStdFloor = new THREE.MeshStandardMaterial( { color: 0x808080, roughness: 0.1, metalness: 0 } );
	const mshStdFloor = new THREE.Mesh( geoFloor, matStdFloor );
	mshStdFloor.position.set( 0, -2, 0 );
	scene.add( mshStdFloor );

}

function onWindowResize() {

	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();

	renderer.setSize( window.innerWidth, window.innerHeight );

	render();
    const light = new THREE.PointLight( 0xffffff, 0.1, 50 );
    light.position.set( 10, 10, 10 );
    scene.add( light );
}

function render() {

    controls.update( clock.getDelta() );
	renderer.render( scene, camera );
				
}

function animate() {
    requestAnimationFrame( animate );

    render();
}

init();
animate();