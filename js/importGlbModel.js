import * as THREE from 'three';

import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

let camera, scene, renderer, modelR;

function init() {

	const container = document.createElement( 'div' );
	document.body.appendChild( container );

	camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 0.25, 20 );
	camera.position.set( 0, 0, 10 );

	scene = new THREE.Scene();

	// model
    const geometry = new THREE.BufferGeometry();
	const loader = new GLTFLoader().setPath( 'js/models/' );
	loader.load( 'alpha.glb', function ( gltf ) {
		modelR = gltf.scene;
        const pointsArray = modelR.children[0].geometry.attributes.position.array;
         
        for (let i = 0; i < pointsArray.length; i++) {
            pointsArray[i]  = pointsArray[i]/3;	
		}
        
        geometry.setAttribute('position', new THREE.BufferAttribute(pointsArray, 3));

		render();

	} );


	renderer = new THREE.WebGLRenderer( { antialias: true } );
	renderer.setPixelRatio( window.devicePixelRatio );
	renderer.setSize( window.innerWidth, window.innerHeight );
	renderer.toneMapping = THREE.ACESFilmicToneMapping;
	renderer.toneMappingExposure = 1;
	renderer.outputEncoding = THREE.sRGBEncoding;
	container.appendChild( renderer.domElement );

	const controls = new OrbitControls( camera, renderer.domElement );
	controls.addEventListener( 'change', render ); // use if there is no animation loop
	controls.minDistance = 2;
	controls.maxDistance = 10;
	controls.target.set( 0, 0, - 0.2 );
	controls.update();

	window.addEventListener( 'resize', onWindowResize );

    //console.log(geometry);
    //we return all points
    return geometry;

}

function onWindowResize() {

	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();

	renderer.setSize( window.innerWidth, window.innerHeight );

	render();

}

			//

function render() {
				
	renderer.render( scene, camera );
				
}

function animate() {
    requestAnimationFrame( animate );
	
    MP.rotation.x += 0.001;
	MP.rotation.y -= 0.01;
	MP.rotation.z -= 0.001;

	MP2.rotation.x -= 0.001;
	MP2.rotation.y += 0.01;
	MP2.rotation.z += 0.001;

    render();
}
const material = new THREE.PointsMaterial( { size: 0.02, color: 0x0000ff } );
const geometry = init();
const MP = new THREE.Points( geometry, material );
const MP2 = new THREE.Points( geometry, material );
scene.add(MP);
scene.add(MP2);
animate();