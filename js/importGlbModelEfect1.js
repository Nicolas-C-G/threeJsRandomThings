import * as THREE from 'three';

import Stats from 'three/addons/libs/stats.module.js';

import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { OBJLoader } from 'three/addons/loaders/OBJLoader.js';

let camera, scene, renderer, mesh;

let parent;

const meshes = [], clonemeshes = [];

let composer, effectFocus;

const clock = new THREE.Clock();

let stats;

init();
animate();

function init() {

	const container = document.createElement( 'div' );
	document.body.appendChild( container );

	camera = new THREE.PerspectiveCamera( 20, window.innerWidth / window.innerHeight, 1, 50000 );
	camera.position.set( 0, 700, 7000 );

	scene = new THREE.Scene();
	scene.background = new THREE.Color( 0x000104 );

	camera.lookAt( scene.position );

	const loader = new OBJLoader();

	loader.load( 'js/models/molecule.obj', function ( object ) {

		const positions = combineBuffer( object, 'position' );

		createMesh( positions, scene, 1, 0, 0, 0, 0xff7744 );

	} );


	renderer = new THREE.WebGLRenderer();
	renderer.setPixelRatio( window.devicePixelRatio );
	renderer.setSize( window.innerWidth, window.innerHeight );
	renderer.autoClear = false;
	container.appendChild( renderer.domElement );

	parent = new THREE.Object3D();
	scene.add( parent );

	// postprocessing

	const renderModel = new RenderPass( scene, camera );

	composer = new EffectComposer( renderer );

	composer.addPass( renderModel );

	//stats
	stats = new Stats();
	container.appendChild( stats.dom );

	window.addEventListener( 'resize', onWindowResize );

}

function onWindowResize() {

	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();

	camera.lookAt( scene.position );

	renderer.setSize( window.innerWidth, window.innerHeight );
	composer.setSize( window.innerWidth, window.innerHeight );

}

function combineBuffer( model, bufferName ) {

	let count = 0;

	model.traverse( function ( child ) {

		if ( child.isMesh ) {

			const buffer = child.geometry.attributes[ bufferName ];

			count += buffer.array.length;

		}

	} );

	const combined = new Float32Array( count );

	let offset = 0;

	model.traverse( function ( child ) {

		if ( child.isMesh ) {

			const buffer = child.geometry.attributes[ bufferName ];

			combined.set( buffer.array, offset );
			offset += buffer.array.length;

		}

	} );

	return new THREE.BufferAttribute( combined, 3 );

}

function createMesh( positions, scene, scale, x, y, z, color ) {

	const geometry = new THREE.BufferGeometry();
	geometry.setAttribute( 'position', positions.clone() );
	geometry.setAttribute( 'initialPosition', positions.clone() );

	geometry.attributes.position.setUsage( THREE.DynamicDrawUsage );

	const clones = [
		[0, 0, 0]
	];

	for ( let i = 0; i < clones.length; i ++ ) {

		const c = ( i < clones.length - 1 ) ? 0x252525 : color;

		mesh = new THREE.Points( geometry, new THREE.PointsMaterial( { size: 10, color: c } ) );
		mesh.scale.x = mesh.scale.y = mesh.scale.z = scale;

		mesh.position.x = x + clones[ i ][ 0 ];
		mesh.position.y = y + clones[ i ][ 1 ];
		mesh.position.z = z + clones[ i ][ 2 ];

		parent.add( mesh );

		clonemeshes.push( { mesh: mesh, speed: 0.5 + Math.random() } );

	}

	meshes.push( {
		mesh: mesh, verticesDown: 0, verticesUp: 0, direction: 0, speed: 15, delay: Math.floor( 200 + 200 * Math.random() ),
		start: Math.floor( 100 + 200 * Math.random() ),
	} );

}

function animate() {

	requestAnimationFrame( animate );
	render();
	stats.update();

}

function render() {

	let delta = 10 * clock.getDelta();

	delta = delta < 2 ? delta : 2;

	for ( let j = 0; j < clonemeshes.length; j ++ ) {

		const cm = clonemeshes[ j ];
		cm.mesh.rotation.y += - 0.1 * delta * cm.speed;

	}

	for ( let j = 0; j < meshes.length; j ++ ) {

		const data = meshes[ j ];
		const positions = data.mesh.geometry.attributes.position;
		const initialPositions = data.mesh.geometry.attributes.initialPosition;

		const count = positions.count;

		if ( data.start > 0 ) {

			data.start -= 1;

		} else {

			if ( data.direction === 0 ) {

				data.direction = - 1;

			}

		}

		for ( let i = 0; i < count; i ++ ) {

			const px = positions.getX( i );
			const py = positions.getY( i );
			const pz = positions.getZ( i );

			// falling down
			if ( data.direction < 0 ) {

				if ( py > 0 ) {

					positions.setXYZ(
						i,
						px + 1.5 * ( 0.50 - Math.random() ) * data.speed * delta,
						py + 3.0 * ( 0.25 - Math.random() ) * data.speed * delta,
						pz + 1.5 * ( 0.50 - Math.random() ) * data.speed * delta
					);

				} else {

					data.verticesDown += 1;

				}

			}

			// rising up
			if ( data.direction > 0 ) {

				const ix = initialPositions.getX( i );
				const iy = initialPositions.getY( i );
				const iz = initialPositions.getZ( i );

				const dx = Math.abs( px - ix );
				const dy = Math.abs( py - iy );
				const dz = Math.abs( pz - iz );

				const d = dx + dy + dx;

				if ( d > 1 ) {

				positions.setXYZ(
					i,
					px - ( px - ix ) / dx * data.speed * delta * ( 0.85 - Math.random() ),
					py - ( py - iy ) / dy * data.speed * delta * ( 1 + Math.random() ),
					pz - ( pz - iz ) / dz * data.speed * delta * ( 0.85 - Math.random() )
				);

				} else {

					data.verticesUp += 1;

				}

			}

		}

		// all vertices down
		if ( data.verticesDown >= count ) {

			if ( data.delay <= 0 ) {

				data.direction = 1;
				data.speed = 5;
				data.verticesDown = 0;
				data.delay = 320;

			} else {

				data.delay -= 1;

			}

		}

		// all vertices up
		if ( data.verticesUp >= count ) {

			if ( data.delay <= 0 ) {

				data.direction = - 1;
				data.speed = 15;
				data.verticesUp = 0;
				data.delay = 120;

			} else {

				data.delay -= 1;

			}

		}

		positions.needsUpdate = true;

	}

	composer.render( 0.01 );

}