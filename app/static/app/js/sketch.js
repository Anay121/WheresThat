let shop_characteristics = [];

// Function to delete element from the array
function removeFromArray(arr, elt) {
    // Could use indexOf here instead to be more efficient
    for (var i = arr.length - 1; i >= 0; i--) {
      if (arr[i] == elt) {
        arr.splice(i, 1);
      }
    }
  }
  
  // An educated guess of how far it is between two points
  function heuristic(a, b) {
    var d = dist(a.i, a.j, b.i, b.j);
    // var d = abs(a.i - b.i) + abs(a.j - b.j);
    return d;
  }
  
  function mouseDragged(col){
    let cellX, cellY;
    cellX = floor(mouseX/w);
    cellY = floor(mouseY/h);
    if(((mouseX >= 0 && mouseX < width) || (mouseY >= 0 && mouseY < height)) && grid[cellX][cellY].wall !=true){  
      console.log(cellX,cellY);
      
      //shop_characteristics[].push(cellX);
      
      if(selectedColor === 'black'){
        grid[cellX][cellY].wall = true;
        fill(0);
        noStroke();
        ellipse(cellX * w + w / 2, cellY * h + h / 2, w / 2, h / 2);
      }
      else if(selectedColor === '#ffebee'){
        
        fill('#ffebee')
        noStroke()
        grid[cellX][cellY].wall = false;
        let temp = document.getElementById("shop_name");
        grid[cellX][cellY].name = temp.value;
        
        rect(cellX * w, cellY * h, w, h);
      }
    }
  }
  let enable = false;
  let sourceCount = 0, destCount = 0;
  
  function mousePressed(){
    let cellX, cellY;
  
    if((mouseX >= 0 && mouseX < width) || (mouseY >= 0 && mouseY < height)){
      cellX = floor(mouseX/w);
      cellY = floor(mouseY/h);
      if(selectedColor === 'green' && sourceCount === 0){
        sourceCount = 1;
        enable = true
        fill(selectedColor);
        noStroke();
        ellipse(cellX * w + w / 2, cellY * h + h / 2, w / 2, h / 2);
        start = grid[cellX][cellY]
        // Starting A*
        openSet.push(start)
        console.log(openSet)
      }
      else if (selectedColor === 'blue' && destCount === 0){
        console.log('blue ellipse')
        destCount = 1;
        end = grid[cellX][cellY]
        fill(0, 0, 255);
        console.log('why')
        noStroke();
        ellipse(cellX * w + w / 2, cellY * h + h / 2, w / 2, h / 2);
        console.log('why not')
      }
    }
  }
  
  // Color Selector
  let selectedColor = undefined;
  
  // How many columns and rows?
  var cols = 20;
  var rows = 20;
  
  // This will be the 2D array
  var grid = new Array(cols);
  
  // Open and closed set
  var openSet = [];
  var closedSet = [];
  
  // Start and end
  var start;
  var end;
  let temp;
  // Width and height of each cell of grid
  var w, h;
  
  // The road taken
  var path = [];
  
  function setup() {
    let can = createCanvas(600, 600);
    can.parent("canvas");
    console.log('A*');
   
    // Grid cell size
    w = width / cols;
    h = height / rows;
  
    // Making a 2D array
    for (var i = 0; i < cols; i++) {
      grid[i] = new Array(rows);
    }
  
    for (var i = 0; i < cols; i++) {
      for (var j = 0; j < rows; j++) {
        grid[i][j] = new Spot(i, j);
      }
    }
  
    // All the neighbors
    for (var i = 0; i < cols; i++) {
      for (var j = 0; j < rows; j++) {
        grid[i][j].addNeighbors(grid);
      }
    }
  }
  
  let astar = false;

  function startAStar(){
    astar = true
  }


  function draw() {
    let current;

    if (astar){

    // Am I still searching?
    if (openSet.length > 0) {
  
      // Best next option
      var winner = 0;
      for (var i = 0; i < openSet.length; i++) {
        if (openSet[i].f < openSet[winner].f) {
          winner = i;
        }
      }
      current = openSet[winner];
  
      // Did I finish?
      if (current === end) {
        noLoop();
        console.log("DONE!");
        console.log(path)
      }
  
      // Best option moves from openSet to closedSet
      removeFromArray(openSet, current);
      closedSet.push(current);
  
      // Check all the neighbors
      var neighbors = current.neighbors;
      for (var i = 0; i < neighbors.length; i++) {
        var neighbor = neighbors[i];
  
        // Valid next spot?
        if (!closedSet.includes(neighbor) && !neighbor.wall) {
          var tempG = current.g + heuristic(neighbor, current);
  
          // Is this a better path than before?
          var newPath = false;
          if (openSet.includes(neighbor)) {
            if (tempG < neighbor.g) {
              neighbor.g = tempG;
              newPath = true;
            }
          } else {
            neighbor.g = tempG;
            newPath = true;
            openSet.push(neighbor);
          }
  
          // Yes, it's a better path
          if (newPath) {
            neighbor.h = heuristic(neighbor, end);
            neighbor.f = neighbor.g + neighbor.h;
            neighbor.previous = current;
          }
        }
  
      }
    // Uh oh, no solution
    } else {
      console.log('no solution');
      // noLoop();
      // return;
    }
  
    // Draw current state of everything
    background('#ffebee');
  
    for (var i = 0; i < cols; i++) {
      for (var j = 0; j < rows; j++) {
        grid[i][j].show();
      }
    }
  
    for (var i = 0; i < closedSet.length; i++) {
      closedSet[i].show(color(255, 0, 0, 50));
    }
  
    for (var i = 0; i < openSet.length; i++) {
      openSet[i].show(color(0, 255, 0, 50));
    }
  
  
    // Find the path by working backwards
    if(enable){
      path = [];
      temp = current;
      path.push(temp);
      console.log('enable in path')
      while (temp.previous) {
        path.push(temp.previous);
        temp = temp.previous;
      }
    }
  }
    // Drawing path as continuous line
    noFill();
    stroke(255, 0, 200);
    strokeWeight(w / 2);
    beginShape();
    for (var i = 0; i < path.length; i++) {
      vertex(path[i].i * w + w / 2, path[i].j * h + h / 2);
    }
    endShape();
  }
  
function greenify(){
  selectedColor = 'green'
  console.log(selectedColor);
}

function bluify(){
  selectedColor = 'blue'
  console.log(selectedColor);
}

function whiteify(){
  selectedColor = '#ffebee'
  console.log(selectedColor);
}

function blacker(){
  selectedColor = 'black'
  console.log(selectedColor);
}


$(function()
{
    $("#submit_shop").click(function(){
      $("#shop_name").attr("disabled",true);
      $("#shop_description").attr("disabled",true);     
      let temp = document.getElementById("shop_name");
      shop_characteristics[temp.value] = new Array(0);
      //shop_characteristics[temp.value].push($("#shop_description").val());
      $("#submit_shop").toggleClass("register_shop");
      let sub_shop = document.getElementById('submit_shop');
      
      if(sub_shop.textContent == "Register")
      {
        $("#submit_shop").html("Submit");
        $("#shop_name").attr("disabled",false);
        $("#shop_description").attr("disabled",false); 
        console.log(shop_characteristics[temp.value]);
      }
      else
        $("#submit_shop").html("Register");
  });                       
});