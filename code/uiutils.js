function updateSlider(n) {
  sliderDiv = document.getElementById("slidercontainer");
  sliderDiv.innerHTML = 
    `<input type="range" min="0" max="${1000*n}" value="${1000*n}" style="width: ${160*n}px;" id="slider1">`
}

function matMul(x, y) {
  return [x[0]*y[0]+x[1]*y[3]+x[2]*y[6],
          x[0]*y[1]+x[1]*y[4]+x[2]*y[7],
          x[0]*y[2]+x[1]*y[5]+x[2]*y[8],
          x[3]*y[0]+x[4]*y[3]+x[5]*y[6],
          x[3]*y[1]+x[4]*y[4]+x[5]*y[7],
          x[3]*y[2]+x[4]*y[5]+x[5]*y[8],
          x[6]*y[0]+x[7]*y[3]+x[8]*y[6],
          x[6]*y[1]+x[7]*y[4]+x[8]*y[7],
          x[6]*y[2]+x[7]*y[5]+x[8]*y[8]]
          
}

function draw() {
  for (var i = 0; i < boxes.length; i++) {
    empties[i].append(boxes[i]);
  }
}

function dragStart() {
  this.classList.add('hold');
  coming = this;
  setTimeout(() => (this.classList.add('invisible')));
}

function dragEnd() {
  this.classList.remove('hold');
  this.classList.remove('invisible');
}

function dragOver(e) {
  e.preventDefault();
  
}
function dragEnter(e) {
  e.preventDefault();
  this.classList.add('hovered');
}

function dragLeave() {
  this.classList.remove('hovered');
}

function dragDrop() {
  this.classList.remove('hovered');
  boxes.splice(boxes.indexOf(coming), 1);
  boxes.splice(empties.indexOf(this), 0, coming);
  draw();
}

function htmltrix(matrix, i) {
  empties[i].innerHTML = `<div class="box" draggable="true">
  <div class="lbrac">(</div>
  <div class="nums">
    <table>
      <tr><th>${matrix[0].toFixed(2)}</th><th>${matrix[1].toFixed(2)}</th><th>${matrix[2].toFixed(2)}</th></tr>
      <tr><th>${matrix[3].toFixed(2)}</th><th>${matrix[4].toFixed(2)}</th><th>${matrix[5].toFixed(2)}</th></tr>
      <tr><th>${matrix[6].toFixed(2)}</th><th>${matrix[7].toFixed(2)}</th><th>${matrix[8].toFixed(2)}</th></tr>
    </table>
  </div>
  <div class="rbrac">)</div>
</div>`;
  return empties[i].children[0];
}

function addMatrix(matrix) {
  const i = boxes.length;
  const newBox = htmltrix(matrix, i);
  newBox.addEventListener('dragstart', dragStart);
  newBox.addEventListener('dragend', dragEnd);
  boxes.push(newBox);
  updateSlider(boxes.length);
}

function showForm(html) {
  const popup = document.getElementById("popup");
  popup.innerHTML = html
}

function hideForm() {
  const popup = document.getElementById("popup");
  popup.innerHTML = "";
}

function showAddNewForm() {
  showForm(`<p>Type the values you want the matrix to contain:</p>
<form>
<input type="text" id="mat1" name="mat1" size="5" value="1"> 
<input type="text" id="mat2" name="mat2" size="5" value="0"> 
<input type="text" id="mat3" name="mat3" size="5" value="0"><br>
<input type="text" id="mat4" name="mat4" size="5" value="0"> 
<input type="text" id="mat5" name="mat5" size="5" value="1"> 
<input type="text" id="mat6" name="mat6" size="5" value="0"><br>
<input type="text" id="mat7" name="mat7" size="5" value="0"> 
<input type="text" id="mat8" name="mat8" size="5" value="0"> 
<input type="text" id="mat9" name="mat9" size="5" value="1"><br>
<button type="button" onclick="addNewFormSubmit()">Done!</button>
</form>`)
}

function addNewFormSubmit() {
  const matrix = [];
  for (var i = 1; i < 10; i++) {
    matrix.push(parseFloat(document.getElementById("mat"+i).value));
  }
  addMatrix(matrix);
  hideForm();
}

function showAddScaleForm() {
  showForm(`<p> Type the values you want the x, y and z axis scaled by:</p>
<form>
<input type="text" id="scalex" name="scalex" size="5" value="1">
<input type="text" id="scaley" name="scaley" size="5" value="1">
<input type="text" id="scalez" name="scalez" size="5" value="1">
<button type="button" onclick="addScaleFormSubmit()">Done!</button>
</form>`)
}

function addScaleFormSubmit() {
  const x = document.getElementById("scalex").value;
  const y = document.getElementById("scaley").value;
  const z = document.getElementById("scalez").value;
  addMatrix([parseFloat(x), 0, 0, 0, parseFloat(y), 0, 0, 0, parseFloat(z)]);
  hideForm();
}

function showAddRotateForm() {
  showForm(`<p> Select which axis you want to rotate around, and give an angle in degrees:</p>
<form>
<select name="rotateaxis" id="rotateaxis">
<option>X</option>
<option>Y</option>
<option>Z</option>
</select>
<input type="text" id="rotatet" name="rotatet" size="5" value="0">
<button type="button" onclick="addRotateFormSubmit()">Done!</button>
</form>`)
}

function addRotateFormSubmit() {
  const a = document.getElementById("rotateaxis").value;
  const t = document.getElementById("rotatet").value;
  const c = Math.cos(t * (Math.PI / 180));
  const s = Math.sin(t * (Math.PI / 180));
  
  if (a == "X") {
    addMatrix([1, 0, 0, 0, c, -s, 0, s, c]);
  } else if (a == "Y") {
    addMatrix([c, 0, s, 0, 1, 0, -s, 0, c]);
  } else {
    addMatrix([c, -s, 0, s, c, 0, 0, 0, 1]);
  }
  hideForm();
}

function showAddReflectForm() {
  showForm(`<p> Select which planes you want to reflect in:</p>
<form>
XY<input type="checkbox" id="reflectxy" name="reflectxy" size="5">
XZ<input type="checkbox" id="reflectxz" name="reflectxz" size="5">
YZ<input type="checkbox" id="reflectyz" name="reflectyz" size="5">
<button type="button" onclick="addReflectFormSubmit()">Done!</button>
</form>`)
}

function addReflectFormSubmit() {
  const x = document.getElementById("reflectyz").checked;
  const y = document.getElementById("reflectxz").checked;
  const z = document.getElementById("reflectxy").checked;
  console.log(x, y, z);
  addMatrix([1-2*x, 0, 0, 0, 1-2*y, 0, 0, 0, 1-2*z]);
  hideForm();
}

function extractMatrix(tab) {
  const t = tab.children[0]
  const matrix = []
  for (var i = 0; i < 3; i++) {
    const row = t.children[i];
    for (var j = 0; j < 3; j++) {
      matrix.push(parseFloat(row.children[j].innerHTML));
    }
  }
  return matrix;
}

function mergeRightMatrices() {
  const last = boxes.length - 1
  const mats = boxes.splice(-2, 2);
  empties[last].innerHTML = "";
  const a = extractMatrix(mats[0].children[1].children[0]);
  const b = extractMatrix(mats[1].children[1].children[0]);
  addMatrix(matMul(a, b));
}

function deleteRightMatrix() {
  const last = boxes.length - 1
  boxes.pop();
  empties[last].innerHTML = "";

  if (last == 0) {addMatrix([1,0,0,0,1,0,0,0,1]);}
  updateSlider(boxes.length);
}

function matFromBox(box) {
  const table = box.children[1].children[0]
  return extractMatrix(table);
}