import * as THREE from 'three';

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );

const renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );

var cube     = [];
var geometry = [];
var material = [];
const numbersOfCubes = 1000;

for (let i = 0; i < numbersOfCubes; i++){
    
    geometry[i] = new THREE.BoxGeometry( 0.1, 0.1, 0.1 );
    material[i] = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
    //material[i] = new THREE.MeshPhongMaterial( { color: 0x00ff00, flatShading: THREE.FlatShading } );
    cube[i] = new THREE.Mesh( geometry[i], material[i] );
    cube[i].position.x = ((Math.random()-0.5)*10);
    cube[i].position.y = ((Math.random()-0.5)*10);
    cube[i].position.z = ((Math.random()-0.5)*10);

    console.log(cube[i]);

    scene.add( cube[i] );
}

camera.position.z = 5;

let frame = 0;
function animate() {

	//requestAnimationFrame( animate );

    for (let i = 0; i < numbersOfCubes; i++) {
        cube[i].position.x = cube[i].position.x + Math.cos(frame)*0.002;
        cube[i].position.y = cube[i].position.y + Math.cos(frame)*0.001;
        //cube[i].position.z = cube[i].position.z + Math.cos(frame);
        
    }
    frame += 5;
	renderer.render( scene, camera );
};

animate();