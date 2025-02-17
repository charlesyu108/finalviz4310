/**
 * This is the code for the demographics visualization.
 * Some of this code is borrowed from https://bl.ocks.org/pbeshai/65420c8d722cdbb0600b276c3adcc6e8.
 */

 // Define functions for views pre/post-loaded data
beforeLoaded();

function beforeLoaded() {
  d3.select("#body-content")
  .style("visibility", "hidden");

  d3.select(".jumbotron")
  .style("opacity", 0.6)
}

// display content after all the prep is loaded.
function showContent() {
  d3.select('#loader')
  .style("display", "none")
  .transition().duration(200);

  d3.select(".jumbotron")
  .style("opacity", 1.0)
  .transition().duration(200);


  d3.select("#body-content")
  .style("visibility", "visible")
  .transition().duration(200);
}

var bodyDOM = document.body.getBoundingClientRect();

// Define Canvas Related params
const demo_width = bodyDOM.width * 0.60;
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
var demosvg = d3.select('#demographics-div')
  .append('svg')
  .attr('width', canvasDOM.width)
  .attr('height', canvasDOM.height)
  .style("position", "absolute")
  .style("top", canvasDOM.top - demodivDOM.top)
  .style("left", canvasDOM.left - demodivDOM.left);


var demotooltip = d3.select("body").append("div")
  .attr("class", "demotooltip")
  .style("display", "none");

// Load in Profiles data
d3.queue().defer(d3.csv, "meep.csv").await(makeViz);

function makeViz(error, profiles) {
  showContent();

  //makeViz globals
  const points = profiles;
  var pointsOnScreen = true;

  var blue = "#61D6FF";
  var pink = "#FC6C6E";
  // Init points
  points.forEach(function(d) {
    d.color = d.sex == "m" ? blue : pink;
    d.display = "visible";
  });

  // Start points at bottom of screen
  toBottom(points);
  drawPoints();
  animatePoints(randomLayout);

  demosvg
  .on("mousemove", mousemoveActions)
  .on("mouseout", _ => demotooltip.style("display", "none"));

  // Making filters
  var filters = [
    ["sex", "m"],
    ["sex", "f"],
    ["religion", "christianity"],
    ["religion", "islam"]
  ]

  function onCheckboxChange() {
    filts = [];
    boxes = document.querySelectorAll(".profile-filter");
    Array.from(boxes).forEach(d => {
      box = d3.select(d);
      if (box.property("checked")) {
        filts.push(pointsFilter(box.attr("field"), box.attr("value")))
      }
    });

    filterPoints(filts);
    drawPoints();
  }

  filters.forEach(d => {
    var div = d3.select("#filters").append("div");

    div.append("input")
      .attr("type", "checkbox")
      .attr("class", "profile-filter")
      .attr("id", (d[0] + "-" + d[1]))
      .attr("field", d[0])
      .attr("value", d[1])
      .on("change", onCheckboxChange);

    div.append("label")
      .attr("for", (d[0] + "-" + d[1]))
      .html(`${d[0]} (${d[1]})`);

  });

  /* >>>>>>>>>>>>>> ====== BEGIN utility functions ======= <<<<<<<<<<<<<<<<<<< */
  function filterPoints(filters) {
    if (filters.length == 0) {
      points.forEach(pt => pt.display = "visible");
      return;
    }
    var filtFn = filters.reduce((a, b) => (x => a(x) && b(x)));
    points.forEach(pt => filtFn(pt) ? pt.display = "visible" : pt.display = "invisible")
  }

  function pointsFilter(field, val) {
    return (d => d[field] == val);
  }

  function clearSVG() {
    demosvg.selectAll("g").remove();
  }

  function clearCanvas() {
    ctx = canvas.node().getContext('2d');
    ctx.save();
    ctx.clearRect(0, 0, demo_width, demo_height);
    ctx.restore();
  }

  function mousemoveActions() {
    if (!pointsOnScreen) return;
    demodivDOM = document.getElementById("demographics-div").getBoundingClientRect();
    var xpt = d3.event.clientX - demodivDOM.left;
    var ypt = d3.event.clientY - demodivDOM.top;

    filt = points.filter(pt =>
      (pt.x >= xpt - pointWidth) &&
      (pt.x <= xpt + pointWidth) &&
      (pt.y >= ypt - pointHeight) &&
      (pt.y <= ypt + pointHeight) &&
      (pt.display == "visible")
    );

    if (filt.length > 0) {
      var select = filt[0];
      demotooltip
      // .html("<p>" + select.sex +", age "+select.age + "</p> <br> About Me <br>"+select.essay0)
      .html(`<p> ${select.sex}, age ${select.age}</p>
        <div class="am-title">About Me</div><div class="aboutme">${select.essay0}</div>`)
      .style("display", "inline")
      .style("top", (d3.event.pageY -34)+ "px")
      .style("left", (d3.event.pageX-12) + "px")
    }
    else {
      demotooltip.style("display", "none");
    }
  }

  function pointsOn() {
    points.forEach(pt => pt.display = "visible");
    pointsOnScreen = true;
  }

  function pointsOff() {
    points.forEach(pt => pt.display = "invisible");
    pointsOnScreen = false;
  }

  // draw the points based on their current layout
  function drawPoints() {
    ctx = canvas.node().getContext('2d');
    ctx.save();

    // erase what is on the canvas currently
    ctx.clearRect(0, 0, demo_width, demo_height);

    // draw each point as a rectangle
    for (let i = 0; i < points.length; ++i) {
      point = points[i];
      if (point.display == "visible") {
        ctx.fillStyle = point.color;
        ctx.fillRect(point.x, point.y, pointWidth, pointHeight);
      }
      // ctx.fillStyle = point.color;
      // ctx.fillRect(point.x, point.y, pointWidth, pointHeight);
    }
    ctx.restore();
  }

  function animatePoints(newLayout) {
    clearSVG();
    pointsOn();
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
      drawPoints(); // update what is drawn on screen
      // if this animation is over, stop this timer since we are done animating.
      if (t >= 1) {
        timer.stop();
      }
    });
  }

  function showAgeDist() {
    var agePoints = [];
    for (i = 18; i <= 100; i++) {
      agePoints.push({
        "age": i,
        "count": 0,
        "m": 0,
        "f": 0
      });
    }
    points.forEach(d => {
      if (d.age >= 18 && d.age <= 100) {
        agePoints[d.age - 18].count += 1;
        d.sex == "m" ? agePoints[d.age - 18].m += 1 : agePoints[d.age - 18].f += 1;
      }
    });
    min_age = 18;
    max_age = 69;
    max_count = d3.max(agePoints, x => x.count);
    padding_x = 50;
    padding_y = 100;
    barWidth = (demo_width - padding_x) / (max_age - min_age);
    heightUnit = (demo_height - padding_y) / max_count;

    var x_scale = d3.scaleLinear()
      .domain([18, max_age])
      .range([padding_x, demo_width]);

    var xAxis = d3.axisBottom(x_scale);

    var chart = demosvg.append("g")
      .attr("width", demo_width)
      .attr("height", demo_height);

    chart.append("text")
    .text("M")
    .attr("x", padding_x)
    .attr("y", height/2 + 60);

    chart.append("text")
    .text("F")
    .attr("x", padding_x)
    .attr("y", height/2 - 20);

    var selected_y_base = 200;

    var selected_height_scale = d3.scaleLinear()
      .domain([0, max_count])
      .range([0, 200]);

    var legend = chart.append("g")
      .style("opacity", 0);

    var mselected = legend.append("rect")
      .style("fill", blue)
      // .attr("height", selected_height_scale(max_count))
      .attr("width", 50)
      .attr("x", demo_width - padding_x - 50);

    var agelbl = legend.append("text")
      .attr("x", demo_width - padding_x - 110)
      .attr("y", selected_y_base - 150);

    var mlabl = legend.append("text")
      .text("M")
      .attr("x", demo_width - padding_x - 50)
      .attr("y", selected_y_base + 20);

    var flabl = legend.append("text")
      .text("F")
      .attr("x", demo_width - padding_x - 110)
      .attr("y", selected_y_base + 20);

    var fselected = legend.append("rect")
      .style("fill", pink)
      // .attr("height", selected_height_scale(max_count))
      .attr("width",50)
      .attr("x", demo_width - padding_x - 110);

    var mbar = chart.selectAll(".male_bar")
      .data(agePoints)
      .attr("class", "male_bar")
      .enter().append("g")
      .attr("transform", (d, i) => "translate(" + (i * barWidth + padding_x) + "," + 0 + ")");
    var fbar = chart.selectAll(".female_bar")
      .data(agePoints)
      .attr("class", "female_bar")
      .enter().append("g")
      .attr("transform", (d, i) => "translate(" + (i * barWidth + padding_x) + "," + 0 + ")");

    mbar.append("rect")
      .attr("width", barWidth)
      .attr("y", d => d.height - demo_height/2)
      .transition().duration(1000)
      .attr("y", demo_height/2)
      .attr("height", d => d.m * heightUnit)
      .attr("stroke", "white")
      .style("fill", blue);

    fbar.append("rect")
      .attr("width", barWidth)
      .attr("y", demo_height/2)
      .transition().duration(1000)
      .attr("y", d => demo_height/2 - d.f * heightUnit)
      .attr("height", d => d.f * heightUnit)
      .attr("stroke", "white")
      .style("fill", pink);

    chart.append("g")
      .attr("transform", "translate(" + barWidth/2 +"," + demo_height/2 + ")")
      .call(xAxis);

    mbar.on("mousemove", d => {
        demotooltip
          .style("display", "inline")
          .style("top", (d3.event.pageY - 34) + "px")
          .style("left", (d3.event.pageX - 12) + "px")
          .html(`<p>Males aged ${d.age}: ${d.m} </p>`)

          legend.style("opacity", 1);

          agelbl.text(d.age + "-year olds");

          mlabl.text(`M (${d.m})`)
          flabl.text(`F (${d.f})`)

          mselected
            .attr("y", selected_y_base - selected_height_scale(d.m) )
            .attr("height",selected_height_scale(d.m))

          fselected
            .attr("y", selected_y_base - selected_height_scale(d.f) )
            .attr("height", selected_height_scale(d.f))
      })
      .on("mouseout", d => {
        demotooltip
          .style("display", "none");

        legend.style("opacity", 0);
      });

      fbar.on("mousemove", d => {
          demotooltip
            .style("display", "inline")
            .style("top", (d3.event.pageY - 34) + "px")
            .style("left", (d3.event.pageX - 12) + "px")
            .html(`<p>Females aged ${d.age}: ${d.f} </p>`)

            legend.style("opacity", 1);

            agelbl.text(d.age + "-year olds");

            mlabl.text(`M (${d.m})`)
            flabl.text(`F (${d.f})`)

            mselected
              .attr("y", selected_y_base - selected_height_scale(d.m) )
              .attr("height",selected_height_scale(d.m))

            fselected
              .attr("y", selected_y_base - selected_height_scale(d.f) )
              .attr("height", selected_height_scale(d.f))
        })
        .on("mouseout", d => {
          demotooltip
            .style("display", "none");

          legend.style("opacity", 0);
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

    orientations.forEach(o => {
      groups.push({
        "orientation": o,
        "sex": "m",
        "count": 0
      });
      groups.push({
        "orientation": o,
        "sex": "f",
        "count": 0
      });
    });
    points.forEach(d => {
      var group = groups.filter(g => g.orientation == d.orientation && d.sex == g.sex);
      if (group.length > 0) group[0].count += 1;
    });

    var max_r = 150;

    var rscale = d3.scale.linear()
      .domain([1, d3.max(groups, x => x.count)])
      .range([0, max_r])

    var viz = demosvg.append("g");

    var groupsEnter = viz.selectAll("g")
      .data(groups).enter();

    var circles = groupsEnter.append("circle")
      .style("fill", d => d.sex == "m" ? blue : pink)
      // .attr("cx", d => d.sex == "m" ? demo_width / 2 - max_r : demo_width / 2 + max_r)
      .attr("cx",demo_width/2)
      .attr("cy", demo_height/2)
      .attr("r", 0)

    var labels = groupsEnter
    .append("text")
      .attr("x", d => d.sex == "m" ? demo_width / 2 - max_r : demo_width / 2 + max_r + 15 )
      .attr("y", (d, i) => Math.floor(i / 2) * (height / 3) + 100)
      .attr("dy", ".35em")
      .style("opacity", 0)
      .text(d => {
        gender = d.sex == "m" ? "male": "female";
        return `${d.orientation}, ${gender}`
      });

    labels.transition().duration(1700)
      .style("opacity", 1.0);

    circles.transition().duration(1500)
      .attr("r", d => rscale(d.count))
      .attr("cx", d => d.sex == "m" ? demo_width / 2 - max_r : demo_width / 2 + max_r)
      .attr("cy", (d, i) => Math.floor(i / 2) * height / 3 + 100);

    circles
      .on("mousemove", d => {
        demotooltip
          .style("display", "inline")
          .style("top", (d3.event.pageY - 34) + "px")
          .style("left", (d3.event.pageX - 12) + "px")
          .html(`<p>${d.orientation}, ${d.sex} <br> Count: ${d.count}</p>`)
      })
      .on("mouseout", d => {
        demotooltip
          .style("display", "none")
      });

  }


  function showRaceDist() {

    ctx = canvas.node().getContext('2d');
    ctx.save();
    // erase what is on the canvas currently
    ctx.clearRect(0, 0, demo_width, demo_height);
    ctx.restore();

    var races = ["white", "asian", "hispanic / latin", "black", "indian", "middle eastern", "pacific islander", "other"]
    var groups = [];

    races.forEach(o => {
      groups.push({
        "ethnicity": o,
        "sex": "m",
        "count": 0
      });
      groups.push({
        "ethnicity": o,
        "sex": "f",
        "count": 0
      });
    });

    points.forEach(d => {
      var group = groups.filter(g => g.ethnicity == d.ethnicity && d.sex == g.sex);
      if (group.length > 0) {
        group[0].count += 1;
      } else {
        group = groups.filter(g => g.ethnicity == "other" && d.sex == g.sex);
        group[0].count += 1;
      }
    });

    var data = {
      "children": groups
    };

    var bubble = d3.pack(data)
      .size([demo_width, demo_height])
      .padding(1.5);

    var nodes = d3.hierarchy(data)
      .sum(function(d) {
        return d.count;
      });

    var viz = demosvg.append("g");

    var node = viz.selectAll(".node")
      .data(bubble(nodes).descendants())
      .enter()
      .filter(function(d) {
        return !d.children
      })
      .append("g")
      .attr("class", "node");

    var circles = node.append("circle")
      .attr("r", 0)
      .style("fill", function(d, i) {
        return d.data.sex == "m" ? blue : pink;
      })
      .attr("cx", demo_width/2 )
      .attr("cy", demo_height/2 );

    var label = node.append("text")
      .style("opacity", 0)
      .text(function(d) {return d.data.ethnicity})
      .style("text-anchor", "middle")
      .attr("fill", "dimgray") //"#333"
      .style("font-family", "Fira Mono")
      .style("font-size", function(d) { return Math.min(2 * d.r, (2 * d.r - 8) / this.getComputedTextLength() * 12) + "px"; })
      .attr("x", demo_width/2 )
      .attr("y", demo_height/2 );

    label.transition().duration(1000)
      .style("opacity", 1)
      .attr("x", function(d) { return d.x} )
      .attr("y", function(d) { return d.y} );

    circles.transition().duration(1000)
      .attr("cx", d => d.x)
      .attr("cy", d => d.y)
      .attr("r", d => d.r);

    node
      .on("mousemove", d => {
        demotooltip
          .style("display", "inline")
          .style("top", (d3.event.pageY - 34) + "px")
          .style("left", (d3.event.pageX- 12) + "px")
          .html(`<p>${d.data.ethnicity}, ${d.data.sex} <br> Count: ${d.data.count}</p>`)
      })
      .on("mouseout", d => {
        demotooltip
          .style("display", "none")
      });

  }

  function showJobDist() {

    ctx = canvas.node().getContext('2d');
    ctx.save();
    // erase what is on the canvas currently
    ctx.clearRect(0, 0, demo_width, demo_height);
    ctx.restore();

    var jobs = ['artistic / musical / writer', 'banking / financial / real estate', 'clerical / administrative', 'computer / hardware / software', 'construction / craftsmanship', 'education / academia', 'entertainment / media', 'executive / management', 'hospitality / travel', 'law / legal services', 'medicine / health', 'military', 'other', 'political / government', 'rather not say', 'retired', 'sales / marketing / biz dev', 'science / tech / engineering', 'student', 'transportation', 'unemployed']
    var groups = [];

    jobs.forEach(o => {

      groups.push({
        "job": o,
        "children": [
          {
            "job": o,
            "sex": "m",
            "count": 0
          },
          {
            "job": o,
            "sex": "f",
            "count": 0
          }
        ]
      });

    });

    points.forEach(d => {
      var job_group = groups.filter(g => g.job == d.job);
      if (job_group.length > 0){
        var group = job_group[0].children.filter(g => g.sex == d.sex)[0];
        group.count += 1;
      }
    });

    var data = {
      "children": groups
    };

    var bubble = d3.pack(data)
      .size([demo_width , demo_height ])
      .padding(5);

    var nodes = d3.hierarchy(data)
      .sum(function(d) {
        return d.count;
      });

    var viz = demosvg.append("g");

    var node = viz.selectAll(".node")
      .data(bubble(nodes).descendants())
      .enter()
      .append("g")
      .attr("class", d => d.children ? "node" : "leaf node");

    var circles = node.append("circle")
      .attr("cx", demo_width/2)
      .attr("cy",demo_height/2)
      .attr("r", 0)
      .transition().duration(1000)
      .attr("r", d => d.r)
      .style("fill", function(d, i) {
        if (!d.data.hasOwnProperty("sex")) return "none";
        return d.data.sex == "m" ? blue : pink;
      })
      .attr("cx", d => d.x)
      .attr("cy", d => d.y);


    var layered_node = viz.selectAll(".nodetext")
      .data(bubble(nodes).descendants())
      .enter()
      .filter(function(d) {
        return !d.children
      })
      .append("g")
      .attr("class", "nodetext");

    layered_node
      .append("text")
      .attr("x", demo_width/2)
      .attr("y",demo_height/2)
      .style("opacity", 0)
      .transition().duration(1000)
      .style("opacity", 1)
      .attr("x" , d => d.x - (d.r * 3) - 10 )
      .attr("y" , (d, i) => (i == 13) ? d.y + d.r : d.y - d.r) // Special offset for index 13
      .attr("dy", "0.35em")
      .text( (d,i) => {
        if (d.data.hasOwnProperty("sex")){
           return d.data.sex == "f" ? d.data.job : null;
        }
      })
      .style("font-size", "11px")
      .style("font-family", "Fira Mono");

    //dummy circle
    layered_circle = layered_node.append("circle")
      .attr("cx", d => d.x)
      .attr("cy", d => d.y)
      .attr("r", d => d.r )
      .style("opacity", 0);


    layered_circle
      .on("mousemove", d => {
        console.log("mousemove!", d);
        if (!d.data.hasOwnProperty("sex")) return;

        demotooltip
        .style("display", "inline")
        .style("top", (d3.event.pageY - 34) + "px")
        .style("left", (d3.event.pageX - 12) + "px")
        .html(`<p>${d.data.job}, ${d.data.sex} (${d.data.count})</p>`)
      })
      .on("mouseout", _ => {
        demotooltip.style("display", "none");
      });

    circles.transition().duration(1500)
      .attr("cx", d => d.x)
      .attr("cy", d => d.y)
      .attr("r", d => d.r);
  }

  function genderLayoutSVG(points) {
    male = points.filter(x => x.sex == "m");
    female = points.filter(x => x.sex == "f");
    var labels = demosvg.append("g");
    labels.append("text")
      .text("Male Users: " + male.length)
      .attr("x", 100)
      .attr("y", demo_height + 20);
    labels.append("text")
      .text("Female Users: " + female.length)
      .attr("x", 500)
      .attr("y", demo_height + 20);
  }

  // BEGIN On scroll interaction

  section_to_bounds = [];
  padding = 200;
  document.querySelectorAll(".section").forEach(s =>{
    console.log(s);
    divDOM = s.getBoundingClientRect();
    section_to_bounds.push({
        "id": s.getAttribute("id"),
        "bounds":[divDOM.y - padding, divDOM.y + divDOM.height - padding]
      });
  });

  var lastContentAnchor = section_to_bounds[section_to_bounds.length - 1].bounds[0] - demo_height + padding;
  var lastY = document.documentElement.scrollTop;
  var mode = null;

  function triggerFn(contentName, currY) {
    range = section_to_bounds.filter(x => x.id == contentName)[0].bounds;
    var on = (currY > range[0] && currY < range[1] &&
      !(lastY > range[0] && lastY < range[1]));

    if (on) {
      d3.selectAll(".section")
        .style("opacity", 0.2);
        d3.select("#"+contentName)
          .style("opacity", 1);
    }

    return on;
  }

  window.addEventListener("scroll", _ => {
    // By default, have the div scroll with you
    d3.select("#demographics-div")
    .style('position','fixed')
    .style('top', "100px");

    var scrolltop = document.documentElement.scrollTop;

    if (scrolltop < section_to_bounds[0].bounds[0]) {
      d3.select("#demographics-div")
      .style('position','relative')
      .style('top', "0px");
    }

    if (scrolltop >= section_to_bounds[section_to_bounds.length - 1].bounds[0]){
      d3.select("#demographics-div")
      .style('position', 'relative')
      .style('top', lastContentAnchor + "px");
    }

    current = section_to_bounds.filter(x => scrolltop > x.bounds[0] && scrolltop < x.bounds[1])
    if (current.length > 0) mode = current[0].id;

    // Intro
    if (triggerFn("intro-section", scrolltop)) {
      clearSVG();
      animatePoints(randomLayout);
    }

    // GENDER
    if (triggerFn("gender-section", scrolltop)) {
      clearSVG();
      animatePoints(genderLayout);
    }

    // AGE
    if (triggerFn("age-section", scrolltop)) {
      animatePoints(randomLayout);
      setTimeout(_ => {
        if (mode == "age-section") animatePoints(toCenter);
        setTimeout(x => {
          if (mode == "age-section"){
            pointsOff();
            clearSVG();
            showAgeDist()
          }
        }, 1500);
      }, 1500);
    }

    //Orientation
    if (triggerFn("orientation-section", scrolltop)) {
      animatePoints(randomLayout);
      setTimeout(_ => {
        if (mode == "orientation-section") animatePoints(toCenter);
        setTimeout(_ => {
          if (mode == "orientation-section") {
            pointsOff();
            clearSVG();
            showOrientationDist()
          }
        }, 1500);
      }, 1500)
    }

    //Race
    if (triggerFn("race-section", scrolltop)) {
      animatePoints(randomLayout);
      setTimeout(_ => {
        if (mode == "race-section") animatePoints(toCenter);
        setTimeout(_ => {
          if (mode == "race-section"){
            pointsOff();
            clearSVG();
            showRaceDist()
          }
        }, 1500);
      }, 1500)
    }

    //Jobs
    if (triggerFn("job-section", scrolltop)) {
      animatePoints(randomLayout);
      setTimeout(_ => {
        if (mode == "job-section") animatePoints(toCenter);
        setTimeout(_ => {
          if (mode == "job-section"){
            pointsOff();
            clearSVG();
            showJobDist()
          }
        }, 1500);
      }, 1500)
    }

    lastY = scrolltop;
  })

} // End of makeViz


/**
 * >>>>>>>>>>>>>> ====== BEGIN Layout functions ======= <<<<<<<<<<<<<<<<<<<
 * Each layout fn defines new point arrangement.
 * Each fn takes in an argument @param points of type Object [].
 * NOTE: Elements of `points` will have their 'x' and 'y' fields mutated.
 */

function genderLayout(points) {
  max_x = demo_width / pointWidth / 2;
  max_y = demo_height / pointHeight / 2;
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

function toGrid(points) {
  max_x = demo_width / pointWidth / 4;
  max_y = demo_height / pointHeight / 2;
  x = 0;
  y = 10;
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

function toCenter(points) {
  points.forEach(function(d) {
    d.x = demo_width / 2;
    d.y = demo_height / 2;
  });
  return points;
}
