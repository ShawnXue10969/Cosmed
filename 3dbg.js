import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";

function removeLoader() {
  $(".loader").fadeOut(500, function () {
    $(".loader").hide();
  });
}

//Create a Three.JS Scene
const scene = new THREE.Scene();
//create a new camera with positions and angles
const camera = new THREE.PerspectiveCamera(
  35,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);

//Instantiate a new renderer and set its size
const renderer = new THREE.WebGLRenderer({ alpha: true }); //Alpha: true allows for the transparent background
renderer.setSize(window.innerWidth, window.innerHeight);

//Keep the 3D object on a global variable so we can access it later
let object;

//OrbitControls allow the camera to move around the scene
let controls;

//Set which object to render
let objToRender = "2";

const loadingManager = new THREE.LoadingManager();

loadingManager.onLoad = () => {
  setTimeout(removeLoader, 0);
};
//Instantiate a loader for the .gltf file
const loader = new GLTFLoader(loadingManager);

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

//Set camera position
camera.position.z = 30;
camera.position.y = 45;
camera.position.x = -20;

//Add lights to the scene
const topLight = new THREE.DirectionalLight(0xf8f7ff, 1); // (color, intensity)
topLight.position.set(500, 500, 500); //top-left-ish
scene.add(topLight);

const ambientLight = new THREE.AmbientLight(0xf8f7ff, 2.2);
scene.add(ambientLight);

controls = new OrbitControls(camera, renderer.domElement);

//Render the scene
function animate() {
  requestAnimationFrame(animate);
  object.rotation.x += 0.003;
  renderer.render(scene, camera);
}

//Add a listener to the window, so we can resize the window and the camera
window.addEventListener("resize", function () {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

controls.enabled = false;
//Start the 3D rendering
animate();
