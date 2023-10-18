import * as THREE from '../build/three.module.js'
import {OrbitControls} from '../examples/jsm/controls/OrbitControls.js'

function main() {
  const canvas = document.querySelector('#c');
  const renderer = new THREE.WebGLRenderer({canvas});

  const camera = new THREE.PerspectiveCamera(75, 2, 0.1, 100); //fov, aspect, near, far
  camera.position.z = 4

  const controls = new OrbitControls(camera, canvas);
  //controls.update();

  const axisMaterial = new THREE.MeshBasicMaterial({color: 0x000000});
  const xGeometry = new THREE.BoxGeometry(10, 0.01, 0.01);
  const yGeometry = new THREE.BoxGeometry(0.01, 10, 0.01);
  const zGeometry = new THREE.BoxGeometry(0.01, 0.01, 10);
  const xAxis = new THREE.Mesh(xGeometry, axisMaterial);
  const yAxis = new THREE.Mesh(yGeometry, axisMaterial);
  const zAxis = new THREE.Mesh(zGeometry, axisMaterial);

  const verts = [-1,-1,-1, 1,-1,-1, 1,1,-1, -1,1,-1, -1,-1,1, 1,-1,1, 1,1,1, -1,1,1]
  const faces = [2,1,0, 0,3,2, 0,4,7, 7,3,0, 0,1,5, 5,4,0, 1,2,6, 6,5,1, 2,3,7, 7,6,2, 4,5,6, 6,7,4,
                 2,0,1, 0,2,3, 0,7,4, 7,0,3, 0,5,1, 5,0,4, 1,6,2, 6,1,5, 2,7,3, 7,2,6, 4,6,5, 6,4,7]
  const unitGeometry = new THREE.PolyhedronGeometry(verts, faces, 0.8666, 0);
  const transGeometry = new THREE.PolyhedronGeometry(verts, faces, 0.8666, 0);
  unitGeometry.translate(0.5,0.5,0.5);
  transGeometry.translate(0.5,0.5,0.5);

  const unitMaterial = new THREE.MeshPhongMaterial({color: 0xed2b7c});
  const transMaterial = new THREE.MeshPhongMaterial({color: 0x40de28});
  const unitCube = new THREE.Mesh(unitGeometry, unitMaterial);
  const transCube = new THREE.Mesh(transGeometry, transMaterial);
  var transform = false;
  const mat = new THREE.Matrix4();

  const light = new THREE.DirectionalLight(0xffffff, 1);
  light.position.set(1, 2, 4);

  const light2 = new THREE.DirectionalLight(0xffffff, 1);
  light2.position.set(-1.8, -1.2, -4);

  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0x6200f5)
  scene.add(xAxis);
  scene.add(yAxis);
  scene.add(zAxis);
  //scene.add(unitCube);
  scene.add(transCube);
  scene.add(light);
  scene.add(light2);

  function resize() {
    const width = renderer.domElement.clientWidth
    const height = renderer.domElement.clientHeight
    if (renderer.domElement.width !== width || renderer.domElement.height !== height) {
      renderer.setSize(width, height, false);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
    }
  }

  function partialTransform(factor) {
    var fulltrans = [1,0,0,0,1,0,0,0,1];
    var i = boxes.length - 1;
    while (factor > 1) {
      factor -= 1;
      fulltrans = matmul(matFromBox(boxes[i]), fulltrans)
      i -= 1;
    }
    const MATRIX = matFromBox(boxes[i]);
  
    // TODO: Calculate v and theta
    const v = findeigenvector(MATRIX);
    if (v == [0, 0, 0]) {console.log("Uh oh")}
    const z = [0, 0, 1]
    var partialT = null
    if (v == null) {
        const detMatch = Math.sign(determinant(MATRIX)) == 1
        console.log("Nullies")
        if (detMatch) {
          
          if (MATRIX[0] < 0 && MATRIX[4] < 0) {
            // x and y change signs so add 180 rotate around z axis
            partialT = matmul(matmul(linInt(matmul(MATRIX, [-1, 0, 0, 0, -1, 0, 0, 0, 1]), factor), Rv([0, 0, 1], Math.PI*factor)), fulltrans)
          } else if (MATRIX[0] < 0 && MATRIX[8] < 0) {
            partialT = matmul(matmul(linInt(matmul(MATRIX, [-1, 0, 0, 0, 1, 0, 0, 0, -1]), factor), Rv([0, 1, 0], Math.PI*factor)), fulltrans)
          } else if (MATRIX[4] < 0 && MATRIX[8] < 0) {
            partialT = matmul(matmul(linInt(matmul(MATRIX, [1, 0, 0, 0, -1, 0, 0, 0, -1]), factor), Rv([1, 0, 0], Math.PI*factor)), fulltrans)
          } else {
            partialT = matmul(linInt(MATRIX, factor), fulltrans)
          }
        } else {
          partialT = matmul(linInt(MATRIX, factor), fulltrans)
        }
    } else {
        var theta = Math.acos(v[2]/magnitude(v))
        
        console.log("Theta", theta) // Angle will always be between 0 and 180 degrees, need to work out which way to rotate
        var Q = null;
        if (crossProd(v, z) == 0 || theta == 0) {
          Q = MATRIX
        } else {
          console.log("Bingo", v, crossProd(v, z), Rv(crossProd(v, z), theta))
          var maybeZ = matvec(Rv(crossProd(v, z), theta), v)
          console.log("maybeZs", matvec(Rv(crossProd(v, z), theta), v), matvec(Rv(crossProd(v, z), -theta), v))
          if (!isZero(maybeZ[0]) || !isZero(maybeZ[1]) || !isZero(maybeZ[2]-1)) {
            theta = -theta
            maybeZ = matvec(Rv(crossProd(v, z), theta), v)
            if (!(isZero(maybeZ[0]) && isZero(maybeZ[1]) && isZero(maybeZ[2]-1))) {console.log("Oopsies")}
          }
          // Rv(crossProd(v, z), theta) moves transformation eigenvector to z axis.
          // Want to work out what transformation does in xy plane to x and y axes,
          // Then put together our transformation by rotating into the plane, doing the transformation in the plane then rotating back out
          Q = matmul(matmul(Rv(crossProd(v, z), theta), MATRIX), Rv(crossProd(v, z), -theta))
          console.log("Qx", theta, Q)
        }
        // Want to look at x and y axis *after* rotation, not before. What gets rotated onto the x axis?
        // Want to construct a transformation Q2 such that RQ2x = ///        RMR-1 = Q
        // Q is rotated transformation with eigenvector [0, 0, 1]
        
        /* Deal with shearing
        var S, Sinv;
        if (isZero(Q[0]*Q[4] - Q[1]*Q[3])) {
          S = [1, 0, 0, 0, 1, 0, -(Q[6]), 0, 1]*/


        const imx = [Q[0], Q[3], Q[6]]
        const imy = [Q[1], Q[4], Q[7]]
        console.log("Images", imx, imy)
        
        var xtheta = Math.sign(imx[1])*Math.acos(imx[0]/magnitude(imx))
        if (imx[1] == 0 && imx[0] < 0) {xtheta = Math.PI}
        
        var ytheta = Math.sign(imy[0])*Math.acos(imy[1]/magnitude(imy))
        if (imy[0] == 0 && imy[1] < 0) {ytheta = Math.PI}

        function Q2(factor) {
          // Want to map x to polar interpolation of imx, same for y, z to z
          const magx = (magnitude(imx)-1)*factor + 1
          const newx = [Math.cos(xtheta*factor)*magx, Math.sin(xtheta*factor)*magx]

          const magy = (magnitude(imy)-1)*factor + 1
          const newy = [Math.sin(ytheta*factor)*magy, Math.cos(ytheta*factor)*magy]

          return [newx[0], newy[0], 0, newx[1], newy[1], 0, 0, 0, 1]
        }

        // Q2 is the transformation in the xy plane, now need to rotate it back to original eigenvector
        if (crossProd(v, z) == 0 || theta == 0) {
          partialT = matmul(Q2(factor), fulltrans)
        } else {
          partialT = matmul(matmul(matmul(Rv(crossProd(v, z), -theta), Q2(factor)), Rv(crossProd(v, z), theta)), fulltrans)
        }
    }
    console.log("partialT", partialT)
    //partialT = matmul(linInt(MATRIX, factor), fulltrans)
    mat.set(partialT[0], partialT[1], partialT[2], 0,
            partialT[3], partialT[4], partialT[5], 0,
            partialT[6], partialT[7], partialT[8], 0,
            0, 0, 0, 1);
    transGeometry.copy(unitGeometry, true);
    transGeometry.applyMatrix4(mat);
  }
  
  function render(time) {
    resize()
    const newTransform = document.getElementById("slider1").value;
    if (newTransform != transform) {
      partialTransform(boxes.length - newTransform/1000);
      transform = newTransform;
    }

    renderer.render(scene, camera);
    requestAnimationFrame(render);
  }
  requestAnimationFrame(render);
}

main();