const emptiesNodeList = document.querySelectorAll('.empty');
var coming = null;

for (const e of emptiesNodeList) {
  e.addEventListener('dragover', dragOver);
  e.addEventListener('dragenter', dragEnter);
  e.addEventListener('dragleave', dragLeave);
  e.addEventListener('drop', dragDrop);
}
var boxes = [];
const empties = Array.from(emptiesNodeList);



addMatrix([1,0,0,0,1,0,0,0,1]);