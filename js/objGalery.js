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

function extactModelPoints(model, sizeFactor) {
	
    const geometry = new THREE.BufferGeometry();
	const loader = new GLTFLoader().setPath( 'js/models/' );
		loader.load( model, function ( gltf ) {
        modelR = gltf.scene;
        const pointsArray = modelR.children[0].geometry.attributes.position.array;
         
        for (let i = 0; i < pointsArray.length; i++) {
            pointsArray[i]  = pointsArray[i]/sizeFactor;	
		}
        
        geometry.setAttribute('position', new THREE.BufferAttribute(pointsArray, 3));

		render();

	} );

    return geometry;

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
	
	MP.rotation.y -= 0.01;
	MP2.rotation.y += 0.01;
    MP3.rotation.y += 0.01;
    MP4.rotation.y += 0.01;


    render();
}

init();
const material = new THREE.PointsMaterial( { size: 0.01, color: 0xffffff } );
const geometry = extactModelPoints('alpha.glb', 20);
const MP = new THREE.Points( geometry, material );
MP.position.set(-5,0,0);
scene.add(MP);

const light = new THREE.PointLight( 0x0000ff, 0.1, 20 );
light.position.set( -5, -1, 0 );
scene.add( light );

const material2 = new THREE.PointsMaterial( { size: 0.05, color: 0xffffff } );
const geometry2 = extactModelPoints('monkey.glb', 2);
const MP2 = new THREE.Points( geometry2, material2 );
MP2.position.set(-5,0,-5);
scene.add(MP2);

const light2 = new THREE.PointLight( 0x00aaff, 0.1, 20 );
light2.position.set( -5, -1, -5 );
scene.add( light2 );

const material3 = new THREE.PointsMaterial( { size: 0.01, color: 0xffffff } );
const geometry3 = extactModelPoints('alpha.glb', 20);
const MP3 = new THREE.Points( geometry3, material3 );
MP3.position.set(5,0,0);
scene.add(MP3);

const light3 = new THREE.PointLight( 0x00ffaa, 0.1, 20 );
light3.position.set( 5, -1, 0 );
scene.add( light3 );

const material4 = new THREE.PointsMaterial( { size: 0.05, color: 0xffffff } );
const geometry4 = extactModelPoints('monkey.glb', 2);
const MP4 = new THREE.Points( geometry4, material4 );
MP4.position.set(5,0,-5);
scene.add(MP4);

const light4 = new THREE.PointLight( 0x00ff00, 0.1, 20 );
light4.position.set( 5, -1, -5 );
scene.add( light4 );

animate();