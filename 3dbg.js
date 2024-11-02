import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { EffectComposer } from "three/addons/postprocessing/EffectComposer.js";
import { RenderPass } from "three/addons/postprocessing/RenderPass.js";
import { UnrealBloomPass } from "three/addons/postprocessing/UnrealBloomPass.js";

//Create a Three.JS Scene
const scene = new THREE.Scene();
//create a new camera with positions and angles
const camera = new THREE.PerspectiveCamera(
  32,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);

//Instantiate a new renderer and set its size
const renderer = new THREE.WebGLRenderer({ alpha: true }); //Alpha: true allows for the transparent background
renderer.setSize(window.innerWidth, window.innerHeight);

const composer = new EffectComposer(renderer);
const renderPass = new RenderPass(scene, camera);

const bloomPass = new UnrealBloomPass(
  new THREE.Vector2(window.innerWidth, window.innerHeight),
  1.2,
  0.3,
  0.1
);

composer.addPass(renderPass);

composer.addPass(bloomPass);



//Keep track of the mouse position, so we can make the eye move
let mouseX = window.innerWidth / 2;
let mouseY = window.innerHeight / 2;

//Keep the 3D object on a global variable so we can access it later
let object;

//OrbitControls allow the camera to move around the scene
let controls;

//Set which object to render
let objToRender = "2";

//Instantiate a loader for the .gltf file
const loader = new GLTFLoader();

//Load the file
loader.load(
  `models/${objToRender}/scene.gltf`,
  function (gltf) {
    //If the file is loaded, add it to the scene
    object = gltf.scene;
    object.rotation.z += 4.7;
    object.position.x -= 35;
    object.position.y += 5;
    scene.add(object);
  },
  function (xhr) {
    //While it is loading, log the progress
    console.log((xhr.loaded / xhr.total) * 100 + "% loaded");
  },
  function (error) {
    //If there is an error, log it
    console.error(error);
  }
);

//Add the renderer to the DOM
document.getElementById("container3D").appendChild(renderer.domElement);

//Set how far the camera will be from the 3D model
camera.position.z = 30;
camera.position.y = 45;
camera.position.x = -20;

//Add lights to the scene, so we can actually see the 3D model
const topLight = new THREE.DirectionalLight(0xf8f7ff, 1); // (color, intensity)
topLight.position.set(500, 500, 500); //top-left-ish
topLight.castShadow = true;
scene.add(topLight);

const ambientLight = new THREE.AmbientLight(0xf8f7ff, 2.2);
scene.add(ambientLight);

controls = new OrbitControls(camera, renderer.domElement);

//Render the scene
function animate() {
  requestAnimationFrame(animate);
  //Here we could add some code to update the scene, adding some automatic movement

  //Make the eye move
  if (object && objToRender === "eye") {
    //I've played with the constants here until it looked good
    object.rotation.y = -3 + (mouseX / window.innerWidth) * 3;
    object.rotation.x = -1.2 + (mouseY * 2.5) / window.innerHeight;
  }
  object.rotation.x += 0.003;
  renderer.render(scene, camera);
}

//Add a listener to the window, so we can resize the window and the camera
window.addEventListener("resize", function () {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

//add mouse position listener, so we can make the eye move
document.onmousemove = (e) => {
  mouseX = e.clientX;
  mouseY = e.clientY;
};
controls.enabled = false;
//Start the 3D rendering
animate();
