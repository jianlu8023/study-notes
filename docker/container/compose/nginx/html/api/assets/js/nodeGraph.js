function chainAnimation(cutNum){
    var width = $('#blockLine').width();
    var height = $('#blockLine').height();
  
    // var width = 300;
    // var height = 420;
  
    var blockSize = d3.min([width, height])/15;
  
    var blockDivSVG = document.getElementById('divSVG');
    var svg = document.getElementById('svg');
    svg.setAttribute('height', height);
    svg.setAttribute('width',width);
  
    var label = document.getElementById('blockLabel');
  
    blockDivSVG.style.height = height + "px";
    blockDivSVG.style.width = width + "px";
  
    var line = d3.line().curve(d3.curveBasis);
  
    var x = d3.scaleLinear()
      .domain([-1.3, 1.3])
      .range([0, width]);
  
    var y = d3.scaleLinear()
      .domain([-1.3, 1.3])
      .range([0, height]);
  
    var z = 0.1;
    var basePath = d3.select("#base-path");
  
    var count = 0;
    var memList = [];
  
    var timer =  d3.timer(function test(){
      if ((z += 0.002) > 4.4) z = 0.1;
      // let path = line(d3.range(0, 4 + .8, .1).map(function(t) { return [x(Math.cos(t * z)), y(Math.sin(t))]; }));
      let path = line(d3.range(0, z, 0.002).map(function(t) { return [x(Math.cos(t * z)), y(Math.sin(t))]; }));
      let p3 = []; 
      // basePath.attr("d", path).attr("d", resample(50, p3));
  
      if(memList.length > 0){
        memList.forEach(e=>{
          // document.getElementById(e).style.display = 'none'
         $('#'+e).remove();
        });
        memList.length = 0;
      }
  
      basePath.attr("d", path).attr("d", resample(50, p3));
      var i = 0;
      for(i; i< p3.length && i< cutNum; i++){
        // console.log(p3[i]);
        let car  = document.createElement('div');
        car.setAttribute("id", count +'-'+ i);
  
        car.style.width = blockSize + "px";
        car.style.height = blockSize + "px";
        car.style.borderRadius = blockSize/4 + "px";
        car.style.fontSize = blockSize/3 + "px";
        car.innerHTML = i;
        memList.push(count +'-'+ i);
        car.setAttribute('class', 'car');
        blockDivSVG.appendChild(car);
  
        car.style.left = p3[i][0] + "px";
        car.style.top = p3[i][1]+ blockSize*2 + "px";
  
        $('.car').css('line-height', blockSize +'px');
  
        car.addEventListener("mouseenter", evt => {
          // let x = parseInt(p3[i][0] - 10);
          // let y = parseInt(p3[i][1] - 5);
          // label.innerHTML = `x: ${x} <br> y: ${y}`;
          label.innerHTML = `id: ${car.innerHTML}`;
          timer.stop();
          let m = oMousePos(svg, evt);
  
          label.style.cssText = `top:${m.y}px; left:${m.x+ 20}px; opacity:1`;
        });
  
        car.addEventListener("mouseleave", evt => {
          if(i < cutNum - 1){
            timer.restart(test);
          }
          label.style.cssText = `opacity:0`;
        });
  
        // car.addEventListener('click', evt=>{
        //   console.log(evt);
        //   console.log(`${i}`);
        // });
  
      }
  
      if(i == cutNum-1 ){
        d3.timeout(function(){
          timer.stop();
        }, 600);
      }
  
      count += 1;
  
    });
  
    function resample(dx, arr) {
      return function() {
          const a = this;
          console.log(a);
          let path = this,
              l = path.getTotalLength(),
              t = [0], i = 0, dt = dx / l;
          while ((i += dt) < 1) t.push(i);
          t.push(1);
          return line(t.map(function(t) {
            let p = path.getPointAtLength(t * l);
            arr.push([p.x, p.y]);
            return [p.x, p.y];
          }));
      };
    };
  
  // a function that gets the position of the mouse over an HTML element 
    function oMousePos(elmt, evt) {
      var ClientRect = elmt.getBoundingClientRect();
      return {
        x: Math.round(evt.clientX - ClientRect.left),
        y: Math.round(evt.clientY - ClientRect.top)
      };
    }
  
}
  
chainAnimation(30);