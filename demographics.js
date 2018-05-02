/**
 * This is the code for the demographics visualization.
 * Some of this code is borrowed from https://bl.ocks.org/pbeshai/65420c8d722cdbb0600b276c3adcc6e8.
 */

// Define Canvas Related params
const screenScale = window.devicePixelRatio || 1;
var width = 800;
var height = 600;
var pointWidth = 2;
var pointHeight = 2;
const duration = 1500;
const ease = d3.easeCubic;

// Building the canvas
const canvas = d3.select('body').append('canvas')
  .attr('width', width * screenScale)
  .attr('height', height * screenScale)
  .style('width', `${width}px`)
  .style('height', `${height}px`);
canvas.node().getContext('2d').scale(screenScale, screenScale);

// Load in Profiles data
d3.queue().defer(d3.csv, "meep.csv").await(makeViz);

function makeViz(error, profiles) {
  // Init points
  const points = profiles;
  points.forEach(function(d) {
    d.id = d[""];
    d.color = d.sex == "m" ? "blue" : "red";
    d.x = 100*Math.random() + width/2;
    d.y = 100*Math.random() + height/2;
  });

  draw();
  animate(randomLayout)

  d3.select("#gender")
  .on("click", _ =>   animate(genderLayout));

  /* >>>>>>>>>>>>>> ====== BEGIN utility functions ======= <<<<<<<<<<<<<<<<<<< */
  // draw the points based on their current layout
  function draw() {
    const ctx = canvas.node().getContext('2d');
    ctx.save();

    // erase what is on the canvas currently
    ctx.clearRect(0, 0, width, height);

    // draw each point as a rectangle
    for (let i = 0; i < points.length; ++i) {
      point = points[i];
      ctx.fillStyle = point.color;
      ctx.fillRect(point.x, point.y, pointWidth, pointHeight);
    }
    ctx.restore();
  }


  function animate(newLayout) {
    // Setting souce points
    points.forEach(point => {
      point.sx = point.x;
      point.sy = point.y;
    });
    newLayout(points);
    // Setting dest points
    points.forEach(point => {
      point.tx = point.x;
      point.ty = point.y;
    });

    timer = d3.timer((elapsed) => {
      // compute how far through the animation we are (0 to 1)
      const t = Math.min(1, ease(elapsed / duration));
      // update point positions (interpolate between source and target)
      points.forEach(point => {
        point.x = point.sx * (1 - t) + point.tx * t;
        point.y = point.sy * (1 - t) + point.ty * t;
      });
      // update what is drawn on screen
      draw();
      // if this animation is over
      if (t === 1) {
        // stop this timer since we are done animating.
        timer.stop();
      }
    });
  }
  /* >>>>>>>>>>>>>> ====== END utility functions ======= <<<<<<<<<<<<<<<<<<< */
}
/**
 * >>>>>>>>>>>>>> ====== BEGIN Layout functions ======= <<<<<<<<<<<<<<<<<<<
 * Each layout fn defines new point arrangement.
 * Each fn takes in an argument @param points of type Object [].
 * NOTE: Elements of `points` will have their 'x' and 'y' fields mutated.
 */

function ageLayout(points) {
  //TODO: Fix me!
  age = new Array(100).fill(0);
  points.forEach(function(d) {
    d.x = d.age * pointWidth
    d.y = height - age[d.age]
    age[d.age] += 1
  });
  // console.log(x,y, max_x, max_y);
  console.log(age);
  return points;
}

function genderLayout(points) {
  max_x = width / pointWidth / 4;
  max_y = height / pointHeight / 2;
  x = 0;
  y = 0;
  male = points.filter(x => x.sex == "m");
  female = points.filter(x => x.sex == "f");
  points = male.concat(female);
  points.forEach(function(d) {
    d.x = 2 * pointWidth * x;
    d.y = 2 * pointHeight * y;
    y += 1;
    if (y > max_y) {
      y = 0;
      x += 1;
    }
  });
  return points;
}

function randomLayout(points){
  points.forEach(function(d){
    d.x = Math.random() * (width - pointWidth);
    d.y = Math.random() * (height - pointHeight);
  });
  return points;
}
/* >>>>>>>>>>>>>>>>>> ====== END Layout functions ======= <<<<<<<<<<<<<<<<<< */
