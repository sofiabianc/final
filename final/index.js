import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.117.1/build/three.module.js';
console.log(THREE)
import { GLTFLoader } from 'https://cdn.jsdelivr.net/npm/three@0.114.0/examples/jsm/loaders/GLTFLoader.js'
import {OrbitControls} from 'https://cdn.jsdelivr.net/npm/three@0.118/examples/jsm/controls/OrbitControls.js';

const canvas = document.querySelector('.webgl')
const scene = new THREE.Scene()

//when the user clicks anywhere on the page
document.addEventListener('click', async () => {

	var port = await navigator.serial.requestPort();
	// be sure to set the baudRate to match the ESP32 code
	await port.open({ baudRate: 9600 });
      
	let decoder = new TextDecoderStream();
	inputDone = port.readable.pipeTo(decoder.writable);
	inputStream = decoder.readable;
      
	reader = inputStream.getReader();
	readLoop();
      
});

// loop

var inputPot = 0;
var counter = 0; 

async function readLoop(){
	while (true){
		const { value, done } = await reader.read();
		if(done){
			console.log("closing connection")
			reader.releaseLock();
			break;
		}
		console.log(value); 
		if(value){
			parsedVal = parseInt(value);
			if(!isNaN(parsedVal) && parsedVal > 1 ){
				inputPot = counter ++; 
			}
			else if(!isNaN(parsedVal) && parsedVal > 100 < 200 ){
				inputPot = counter ++; 
			}
			else if(!isNaN(parsedVal) && parsedVal > 200 < 300 ){
				inputPot = counter ++; 
			}
			else if(!isNaN(parsedVal) && parsedVal > 300 < 400){
				inputPot = counter ++; 
			}
			else if (!isNaN(parsedVal) && parsedVal > 400){
				inputPot = counter ++; 
			}
			else(
				inputPot = 0 
			); 
		}
	}
}






// Character 
const loader = new GLTFLoader()
loader.load('assets/wraith.glb', function(glb){
	console.log(glb)
	const root = glb.scene; 
	root.scale.set(0.3, 0.3, 0.3); 
	scene.add(root);  
}, function(xhr){
	console.log((xhr.loaded/xhr.total * 90) + "% loaded")
}, function(error){
	console.log('An error occurred')
})

//lighting 

const light = new THREE.DirectionalLight(0xffffff, 1); 
light.position.set(2,1,5)
scene.add(light); 



// Boiler Plate 

const sizes = {
	width: window.innerWidth, 
	height: window.innerHeight
}

const camera = new THREE.PerspectiveCamera(70, window.innerWidth/window.innerHeight, 0.1, 300)
camera.position.set(0, 30, 100)
scene.add(camera)

const renderer = new THREE.WebGLRenderer({
	canvas: canvas
})

renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
renderer.shadowMap.enabled = true
renderer.gammaOutput = true 




//Orbit Controls 
const controls = new OrbitControls(
	camera, renderer.domElement
);

if (inputPot == 1){
	camera.position.set(1, 35, 105);
	controls.update();
}
else if(inputPot == 2){
	camera.position.set(2, 40, 110);
	controls.update();  
}
else if(inputPot == 3){
	camera.position.set(3, 45, 115); 
	controls.update(); 
}
else if (inputPot == 4){
	camera.position.set(4, 50, 120); 
	controls.update(); 
}
else if (inputPot == 5){
	camera.position.set(5, 55, 125); 
	controls.update(); 
}

// Audio Buffer

    // Create an audio listener -- will only work in firefox!
    // instantiate a listener
    const audioListener = new THREE.AudioListener();

    // add the listener to the camera
    camera.add( audioListener );

    // instantiate audio object
    const good4u = new THREE.Audio( audioListener );

    // add the audio object to the scene
    scene.add( good4u );

    // instantiate a loader
    const newLoader = new THREE.AudioLoader();

    // load a resource
    newLoader.load(
	    // resource URL
	    'assets/good4u.mp3',

	    // onLoad callback
	    function ( audioBuffer ) {
		// set the audio object buffer to the loaded object
		good4u.setBuffer( audioBuffer );

          	good4u.setLoop(true); 
          	good4u.setVolume(10); 

		// play the audio
		good4u.play();
	    },
    
      

    // onProgress callback
      function ( xhr ) {
        console.log( (xhr.loaded / xhr.total * 100) + '% loaded' );
      },

      // onError callback
      function ( err ) {
        console.log( 'An error happened' );
      }
    );


// Plane 
const plane = new THREE.Mesh(
	new THREE.PlaneGeometry(80, 80, 10, 10),
	new THREE.MeshStandardMaterial({
		color: 0xb784a7 ,
	})
); 

plane.castShadow = false;
plane.receiveShadow = true;
plane.rotation.x = -Math.PI / 2;
plane.uniform = true; 
plane.vertexShader = true; 
plane.fragmentShader = true; 
scene.add(plane);


// Animate 
function animate(){
	requestAnimationFrame(animate)
	controls.update(); 
	renderer.render(scene, camera)
}

animate()


