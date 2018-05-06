/**
 * This is the code for the demographics visualization.
 * Some of this code is borrowed from https://bl.ocks.org/pbeshai/65420c8d722cdbb0600b276c3adcc6e8.
 */

// Define Canvas Related params
const demo_width = 800;
const demo_height = 600;
var pointWidth = 2;
var pointHeight = 2;
const duration = 1500;
const ease = d3.easeCubic;
const timer = d3.timer(x => x); // Dummy callback

// Building the canvas
var canvas = d3.select('#demographics-div').append('canvas')
  .attr("id", "canvas")
  .attr('width', demo_width)
  .attr('height', demo_height)
  .style('width', `${demo_width}px`)
  .style('height', `${demo_height}px`);

var canvasDOM = document.getElementById("canvas").getBoundingClientRect();
var demodivDOM = document.getElementById("demographics-div").getBoundingClientRect();

// SVG overlay
var svg = d3.select('#demographics-div')
    .append('svg')
      .attr('width', canvasDOM.width)
      .attr('height', canvasDOM.height)
      .style("position", "absolute")
      .style("top", canvasDOM.top-demodivDOM.top)
      .style("left", canvasDOM.left-demodivDOM.left);

var demotooltip = d3.select("body").append("div")
    .attr("class", "tooltip")
    .style("display", "none");

// Load in Profiles data
d3.queue().defer(d3.csv, "meep.csv").await(makeViz);

function makeViz(error, profiles) {

  //makeViz globals
  const points = profiles;
  var pointsOnScreen = true;

  // Init points
  points.forEach(function(d) {
    d.color = d.sex == "m" ? "blue" : "red";
    d.visible = "visible";
  });

  // Start points at bottom of screen
  toBottom(points);
  draw();
  animate(randomLayout);

  svg.on("mousemove", mousemoveActions);

  // Button actions
  d3.select("#gender")
    .on("click", _ => {
      animate(genderLayout);
      genderLayoutSVG(points);
    });

  d3.select("#unsort")
    .on("click", _ => animate(randomLayout));

  d3.select("#age")
    .on("click", _ => {
      animate(randomLayout);
      setTimeout( _ => {
        animate(toBottom);
        setTimeout(x => {pointsInvisible(); showAgeDist()}, 1500);
      },1500)

    });

  d3.select("#orientation")
    .on("click", _ => {
      animate(randomLayout);
      setTimeout( _ => {
        animate(toBottom);
        setTimeout(_ => {pointsInvisible(); showOrientationDist()}, 1500);
      },1500)

    });
  /* >>>>>>>>>>>>>> ====== BEGIN utility functions ======= <<<<<<<<<<<<<<<<<<< */

  function mousemoveActions() {

    if (!pointsOnScreen) return;

    var xpt = d3.event.pageX - demodivDOM.left;
    var ypt = d3.event.pageY - demodivDOM.top;
    filt = points.filter(pt =>
      (pt.x >= xpt-pointWidth)&&
      (pt.x <= xpt+pointWidth)&&
      (pt.y >= ypt-pointHeight)&&
      (pt.y <= ypt+pointHeight)&&
      (pt.display == "visible")
    );
    if (filt.length > 0){
      var select = filt[0];
      demotooltip
      .html(select.sex +" "+select.age+ "<br> Essay0: <br>"+select.essay0)
      .style("display", "inline")
      .style("top", (d3.event.pageY -34)+ "px")
      .style("left", (d3.event.pageX-12) + "px")
    }
    else {
      demotooltip.style("display", "none");
    }
  }

  function pointsVisible(){
    points.forEach(pt => pt.display = "visible");
    pointsOnScreen = true;
  }

  function pointsInvisible(){
    points.forEach(pt => pt.display = "invisible");
    pointsOnScreen = false;
  }

  // draw the points based on their current layout
  function draw() {
    ctx = canvas.node().getContext('2d');
    ctx.save();

    // erase what is on the canvas currently
    ctx.clearRect(0, 0, demo_width, demo_height);

    // draw each point as a rectangle
    for (let i = 0; i < points.length; ++i) {
      point = points[i];
      ctx.fillStyle = point.color;
      ctx.fillRect(point.x, point.y, pointWidth, pointHeight);
    }
    ctx.restore();
  }

  function animate(newLayout) {
    svg.selectAll("g").remove();
    pointsVisible();
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
    var agePoints = [];
    for( i = 18; i <= 100; i ++){
      agePoints.push({"age": i, "count": 0, "m": 0, "f": 0});
    }

    points.forEach(d =>{
      if (d.age >= 18 && d.age <= 100){
        agePoints[d.age-18].count += 1;
        d.sex =="m"? agePoints[d.age-18].m += 1 : agePoints[d.age-18].f += 1;
      }
    });
    min_age = 18;
    max_age = 69;
    max_count = d3.max(agePoints, x => x.count);
    padding_x = 50;
    padding_y = 100;
    barWidth = demo_width / (max_age-min_age);
    heightUnit = (demo_height - padding_y) / max_count;

    var x_scale = d3.scale.linear()
      .domain([18, 100])
      .range([padding_x, width]);

    var y_scale = d3.scale.linear()
      .domain([0, max_count])
      .range([demo_height, padding_y]);

    var chart = svg.append("g")
      .attr("width", demo_width)
      .attr("height", demo_height);

    var bar = chart.selectAll("g")
      .data(agePoints)
      .enter().append("g")
      .attr("transform", (d,i) => "translate(" + (i * barWidth + padding_x) + "," + 0 + ")");

    bar.append("rect")
      .attr("width", barWidth)
      .attr("y", y_scale(0))
      .transition().duration(1000)
        .attr("y", d => y_scale(d.m))
        .attr("height", d => d.m * heightUnit)
        .attr("stroke", "black")
        .style("fill", "blue");

    bar.append("rect")
      .attr("width", barWidth)
      .attr("y", y_scale(0))
      .transition().duration(1000)
        .attr("y", d => y_scale(d.count))
        .attr("height", d => d.f * heightUnit)
        .attr("stroke", "black")
        .style("fill", "red");

    bar.on("mousemove", d => {
      demotooltip
      .style("display", "inline")
      .style("top", (d3.event.pageY-34)+ "px")
      .style("left", (d3.event.pageX-12) + "px")
      .html(`Age ${d.age} <br> Males ${d.m} <br> Females ${d.f}`)
    })
    .on("mouseout", d => {
      demotooltip
      .style("display", "none")
    });

    ctx = canvas.node().getContext('2d');
    ctx.save();
     // erase what is on the canvas currently
    ctx.clearRect(0, 0, demo_width, demo_height);
    ctx.restore();
  }

  function showOrientationDist() {

    ctx = canvas.node().getContext('2d');
    ctx.save();
     // erase what is on the canvas currently
    ctx.clearRect(0, 0, demo_width, demo_height);
    ctx.restore();

    var orientations = ["gay", "straight", "bisexual"];
    var groups = [];

    orientations.forEach(o =>{
      groups.push({"orientation":o, "sex": "m", "count": 0 });
      groups.push({"orientation":o, "sex": "f", "count": 0 });
    });
    points.forEach(d => {
      var group = groups.filter(g => g.orientation == d.orientation && d.sex == g.sex);
      if (group.length > 0) group[0].count += 1;
    });

    var max_r = 150;

    var rscale = d3.scale.linear()
    .domain([1, d3.max(groups, x => x.count)])
    .range([0, max_r])

    var viz = svg.append("g");

    var groupsEnter = viz.selectAll("g")
    .data(groups).enter();
    console.log(demo_width);

    var circles = groupsEnter.append("circle")
      .style("fill", d => d.sex == "m"? "blue": "red")
      .attr("cx", d => d.sex == "m"? demo_width/2 - max_r: demo_width/2 + max_r)
      .attr("cy", demo_height)
      .attr("r", 0)

    circles.transition().duration(1500)
    .attr("cx", d => d.sex == "m"? demo_width/2 - max_r: demo_width/2 + max_r)
    .attr("cy", (d,i) => Math.floor(i/2) * height/3 + 100)
    .attr("r", d => rscale(d.count));

    circles
    .on("mousemove", d => {
      demotooltip
      .style("display", "inline")
      .style("top", (d3.event.pageY-34)+ "px")
      .style("left", (d3.event.pageX-12) + "px")
      .html(`${d.orientation}, ${d.sex} <br> Count: ${d.count}`)
    })
    .on("mouseout", d => {
      demotooltip
      .style("display", "none")
    });

  }

  function genderLayoutSVG(points){
    male = points.filter(x => x.sex == "m");
    female = points.filter(x => x.sex == "f");
    var labels = svg.append("g");
    labels.append("text")
      .text("Male Users: " + male.length)
      .attr("x", 100)
      .attr("y", demo_height + 20);
    labels.append("text")
        .text("Female Users: " + female.length)
        .attr("x", 500)
        .attr("y", demo_height + 20);
  }
} // End of makeViz


/**
 * >>>>>>>>>>>>>> ====== BEGIN Layout functions ======= <<<<<<<<<<<<<<<<<<<
 * Each layout fn defines new point arrangement.
 * Each fn takes in an argument @param points of type Object [].
 * NOTE: Elements of `points` will have their 'x' and 'y' fields mutated.
 */

// function ageLayout(points) {
//   //TODO: Fix me!
//   age = new Array(100).fill(0);
//   points.forEach(function(d) {
//     d.x = d.age * pointWidth
//     d.y = height - age[d.age]
//     age[d.age] += 1
//   });
//
//   return points;
// }

function genderLayout(points) {
  max_x = demo_width / pointWidth / 4;
  max_y = demo_height / pointHeight / 2;
  x = 0;
  y = 10;

  male = points.filter(x => x.sex == "m");
  female = points.filter(x => x.sex == "f");
  points = male.concat(female);
  points.forEach(function(d) {
    d.x = 2 * pointWidth * x;
    d.y = 2 * pointHeight * y;
    y += 1;
    if (y > max_y) {
      y = 10;
      x += 1;
    }
  });
  return points;
}

function randomLayout(points) {
  points.forEach(function(d) {
    d.x = Math.random() * (demo_width - pointWidth);
    d.y = Math.random() * (demo_height - pointHeight);
  });
  return points;
}

function toBottom(points) {
  points.forEach(function(d) {
    d.x = Math.random() * (demo_width - pointWidth);
    d.y = demo_height - pointHeight;
  });
  return points;
}


function toCenter(points) {
  points.forEach(function(d) {
    d.x = demo_width/2;
    d.y = demo_height/2;
  });
  return points;
}
