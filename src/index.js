//libs
import * as THREE from 'three';
import {OBJLoader} from 'three/examples/jsm/loaders/OBJLoader';
import {FBXLoader} from 'three/examples/jsm/loaders/FBXLoader';
import {MTLLoader} from 'three/examples/jsm/loaders/MTLLoader';
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls';
import {GLTFExporter} from 'three/examples/jsm/exporters/GLTFExporter';
//models
import FBXModel from './models/Inyoni Ye Sizwe Shuttle Mk 3.fbx';
import OBJModel from './models/Inyoni Ye Sizwe Shuttle Mk 3.obj';
import ModelMat from './materials/Inyoni Ye Sizwe Shuttle Mk 3.mtl';
//style
import './scss/App.scss';
import { Mesh } from 'three';
//dom elements
const canvas = document.querySelector('#canvas');
const loadingProgressEl = document.querySelector('#loadingProgress');
const loadingProgressEl2 = document.querySelector('#loadingProgress2');
const downloadBtn = document.querySelector('#downloadBtn');
//COLORS
const lightGrey = 0xd3d3d3;
const white = 0xffffff;
/*
* @Desc: destructure classes we'll need
* @Classes: renderer, camera, scene, light
*/
const {WebGLRenderer, PerspectiveCamera, Scene, DirectionalLight, AmbientLight, MeshPhongMaterial} = THREE;
//PARAMETER VARIABLES:
//camera variables: field of view, aspect ratio, near clipping, far clipping
const fov = 75;
const aspect = 2;
const near = 0.1;
const far = 5;
//light params: color, intensity
const lightColor = white;
const intensity = 1;
const intensity2 = 0.7;
//INSTANTIATION
//instantiate a renderer
const renderer = new WebGLRenderer({canvas, alpha: true});
//instantiate a camera
const camera = new PerspectiveCamera(fov, aspect, near, far);
//instantiate a scene
const scene = new Scene();
//instantiate a light/s
const light = new DirectionalLight(lightColor, intensity);
const light2 = new DirectionalLight(lightColor, intensity2);
const ambientLight = new AmbientLight(lightColor, 0.4);
//instantiate an fbx loader
const fbxloader = new FBXLoader();
const fbxMat = new MeshPhongMaterial(lightGrey);
//load fbx model
// fbxloader.load(FBXModel, obj => {
//     obj.traverse(child => {
//         if(child.isMesh) {
//             child.material = fbxMat;
//         }
//     });
//     obj.scale.set(1, 1, 1);
//     scene.add(obj);
// }, () => {
//     console.log('model loaded');
// }, xhr => {
//     console.log(xhr.loaded/xhr.total * 100);
// }, err => {
//     console.log(`Error: ${err}`)
// });
//instantiate an obj material loader
const materialLoader = new MTLLoader();
//instantiate an obj loader
const objLoader = new OBJLoader();
//load material file
materialLoader.load(ModelMat, mtl => {
    mtl.preload();
    objLoader.setMaterials(mtl);
    //load an obj model
    objLoader.load(OBJModel, root => {
        root.scale.set(0.1, 0.1, 0.1);
        scene.add(root);
    }, xhr => {
        console.log(xhr.loaded/xhr.total * 100);
    }, err => {
        console.log(`Error: ${err}`);
    }); 
});
//instantiate orbit controls
const controls = new OrbitControls(camera, renderer.domElement);

//POSITIONING
//set camera position
camera.position.z = 2;
controls.update();
//set light position
light.position.set(2, 1, 2);
light2.position.set(-2, -3, 0);
//ADD TO SCENE
//add light to scene
scene.add(light);
scene.add(light2);
scene.add(ambientLight);
//FUNCTIONS
/*resize()
* @Desc: resize renderer to display size (if necessary)
* @Params: renderer
*/
const resize = (renderer) => {
    //get canvas from the renderer domElement property
    const canvas = renderer.domElement;
    //destructure client width & client height from canvas element
    const {clientWidth, clientHeight} = canvas;
    const w = clientWidth;
    const h = clientHeight;
    //a boolean expression that evaluates true if drawbuffer needs resize
    const needsResize = canvas.width !== w || canvas.height !== h;
    //if drawbuffer needs to be resized, then resize
    if(needsResize) {
        //set drawbuffer size to display size
        //@Params: client width, client height, false
        renderer.setSize(w, h, false);
    };
    //returns true if resize occurred
    return needsResize;
}

/*animate()
* @Desc: create a render loop
* @Params: time
*/

const animate = (t) => {
    //convert time to milliseconds
    t*=0.001;
    //TODO: rotate object along y axis
    //if drawbuffer was resized then resize the camera's aspect ratio
    if(resize(renderer)) {
        //get canvas element
        const canvas = renderer.domElement;
        //destructure client width and height from canvas
        const {clientWidth, clientHeight} = canvas;
        const w = clientWidth;
        const h = clientHeight;
        //set camera aspect to drawbuffer size
        camera.aspect = w/h;
        //update camera's projection matrix 
        camera.updateProjectionMatrix();
    }
    //render the scene
    renderer.render(scene, camera);
    //request a new animation frame
    requestAnimationFrame(animate);
}

//initial animation frame request
requestAnimationFrame(animate);

//EXPORT GLTF 
//instantiate an exporter
const exporter = new GLTFExporter();

//parse the input and generate the glTF output
const link = document.createElement('a');
link.style.display = 'none';
document.body.appendChild(link);
const save = (blob, filename) => {
    link.href = URL.createObjectURL(blob);
    link.download = filename;
    link.click();
};

const saveString = (text, filename) => {
    save(new Blob([text], {type: 'text/plain'}), filename);
};

const saveArrayBuffer = (buffer, filename) => {
    save(new Blob([buffer], {type: 'application/octet-stream'}), filename);
};

const download = () => {
    exporter.parse(scene, result => {
        if(result instanceof ArrayBuffer) {
            saveArrayBuffer(result, 'scene.glb');
        } 
        else {
            const output = JSON.stringify(result, null, 2);
            console.log(output);
            saveString(output, 'scene.gltf');
        }
    },
    err => {
        console.log(`Error: ${err}`);
    },
    {
        binary: true
    }
    )
}

downloadBtn.addEventListener('click', download);