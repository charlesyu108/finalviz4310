// Code for demographics viz
const screenScale = window.devicePixelRatio || 1;
width = 800;
height = 600;
pointWidth = 2;
pointHeight = 2;

//animation stuff
const duration = 1500;
const ease = d3.easeCubic;
let timer;




// Building the canvas
const canvas = d3.select('body').append('canvas')
.attr('width', width * screenScale)
.attr('height', height * screenScale)
.style('width', `${width}px`)
.style('height', `${height}px`);
canvas.node().getContext('2d').scale(screenScale, screenScale);


// draw the points based on their current layout
function draw(points) {
  const ctx = canvas.node().getContext('2d');
  ctx.save();

  // erase what is on the canvas currently
  ctx.clearRect(0, 0, width, height);

  // draw each point as a rectangle
  for (let i = 0; i < points.length; ++i) {
    point = points[i];
    ctx.fillStyle = point.color;
    ctx.fillRect(point.x, point.y, pointWidth, pointWidth);
  }
  ctx.restore();
}

function toGendered(points){
  m_x = 0; m_y = 0;
  f_x = 0; f_y = 0;
  max_x = width/pointWidth/2;
  max_y = height/pointHeight/2;
  points.forEach( function (d) {
    if (d.sex == "m"){
      d.x = pointWidth * m_x;
      d.y = 2 * pointHeight * m_y;
      m_y += 1;
      if (m_y > max_y){
        m_y = 0;
        m_x += 1;
      }
    }
    else if (d.sex == "f"){
      d.x = width/2 + pointWidth * f_x;
      d.y = 2* pointHeight * f_y;
      f_y += 1;
      if (f_y > max_y){
        f_y = 0;
        f_x += 1;
      }
    }
    // else {
    //   d.x = 2/3*width + Math.random() * (width/3 - pointWidth);
    //   d.y = Math.random() * (height - pointWidth);
    // }
  });

  return points;
}

d3.queue()
.defer(d3.csv, "meep.csv")
.await(makeViz);

function makeViz(error, profiles){
  console.log(profiles);

  // Init profiles
  profiles.forEach(function (d){
    d.id = d[""];
    d.color = d.sex == "m"? "blue": "red";
    d.x = Math.random() * (width - pointWidth);
    d.y = Math.random() * (height - pointWidth);
  });

  const points = profiles;
  draw(points);

  ani = _ => animate(toGendered, points);

  d3.select("#clickme").on("click", ani);

}

// animate the points to a given layout
function animate(layout, points) {
  // store the source position
  points.forEach(point => {
    point.sx = point.x;
    point.sy = point.y;
  });

  // get destination x and y position on each point
  layout(points);

  // store the destination position
  points.forEach(point => {
    point.tx = point.x;
    point.ty = point.y;
  });
  //
  // timer = d3.timer((elapsed) => {
  //   // compute how far through the animation we are (0 to 1)
  //   const t = Math.min(1, ease(elapsed / duration));

    // update point positions (interpolate between source and target)
    t = 0.2;
    points.forEach(point => {
      point.x = point.sx * (1 - t) + point.tx * t;
      point.y = point.sy * (1 - t) + point.ty * t;
    });

    // update what is drawn on screen
    draw(layout(points));
// });
}
