/**
 * This is the code for the demographics visualization.
 * Some of this code is borrowed from https://bl.ocks.org/pbeshai/65420c8d722cdbb0600b276c3adcc6e8.
 */

// Define Canvas Related params
var width = 800;
var height = 600;
var pointWidth = 2;
var pointHeight = 2;
const duration = 1500;
const ease = d3.easeCubic;
const timer = d3.timer(x => x); // Dummy callback

// Building the canvas
const canvas = d3.select('body').append('canvas')
  .attr("id", "canvas")
  .attr('width', width)
  .attr('height', height)
  .style('width', `${width}px`)
  .style('height', `${height}px`);

canvasDOM = document.getElementById("canvas").getBoundingClientRect();

// SVG overlay
svg = d3.select('body')
    .append('svg')
      .attr('width', canvasDOM.width)
      .attr('height', canvasDOM.height)
      .style("position", "absolute")
      .style("top", canvasDOM.top)
      .style("left", canvasDOM.left);

// Load in Profiles data
d3.queue().defer(d3.csv, "meep.csv").await(makeViz);

function makeViz(error, profiles) {
  // Init points
  const points = profiles;
  points.forEach(function(d) {
    d.color = d.sex == "m" ? "blue" : "red";
  });

  // Start in center
  toBottom(points);
  draw();
  animate(randomLayout);

  // Button actions
  d3.select("#gender")
    .on("click", _ => animate(genderLayout));

  d3.select("#unsort")
    .on("click", _ => animate(randomLayout));

  d3.select("#age")
    .on("click", _ => {
      animate(toBottom);
      setTimeout(x => showAgeDist(), 1500);
    });
  /* >>>>>>>>>>>>>> ====== BEGIN utility functions ======= <<<<<<<<<<<<<<<<<<< */

  // draw the points based on their current layout
  function draw() {
    ctx = canvas.node().getContext('2d');
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

    timer.restart((elapsed) => {
      // compute how far through the animation we are (0 to 1)
      const t = Math.min(1, ease(elapsed / duration));
      // update point positions (interpolate between source and target)
      points.forEach(point => {
        point.x = point.sx * (1 - t) + point.tx * t;
        point.y = point.sy * (1 - t) + point.ty * t;
      });
      draw(); // update what is drawn on screen
      // if this animation is over, stop this timer since we are done animating.
      if (t >= 1) {
        timer.stop();
      }
    });
  }

  function showAgeDist() {

    age = new Array(100).fill(0);
    points.forEach(d => age[d.age] += 1);
    min_age = 18;
    max_count = d3.max(age);
    barWidth = width / (100 - 18);
    heightUnit = (height - 100) / max_count;

    agePoints = age.map(function(count, a) {
      return {
        "x": (a - min_age) * barWidth,
        "ty": height - heightUnit * count,
        "sy": height,
        "width": barWidth,
        "height_t": heightUnit * count
      }
    });

    timer.restart((elapsed) => {
      // compute how far through the animation we are (0 to 1)
      const t = Math.min(1, ease(elapsed / duration));
      // update point positions (interpolate between source and target)
      agePoints.forEach(point => {
        point.height = point.height_t * t;
        point.y = point.sy * (1 - t) + point.ty * t;
      });
      ctx = canvas.node().getContext('2d');
      ctx.save();
      // erase what is on the canvas currently
      ctx.clearRect(0, 0, width, height);
      // draw each point as a rectangle
      agePoints.forEach(point => ctx.fillRect(point.x, point.y, point.width, point.height));
      ctx.restore();
      // if this animation is over, stop this timer since we are done animating.
      if (t >= 1) timer.stop();
    });
  }
} // End of makeViz


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

function randomLayout(points) {
  points.forEach(function(d) {
    d.x = Math.random() * (width - pointWidth);
    d.y = Math.random() * (height - pointHeight);
  });
  return points;
}

function toBottom(points) {
  points.forEach(function(d) {
    d.x = Math.random() * (width - pointWidth);
    d.y = height - pointHeight;
  });
  return points;
}
