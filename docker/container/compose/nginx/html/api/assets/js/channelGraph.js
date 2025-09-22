var canvasHeight = document.documentElement.clientHeight;
var canvasWidth = document.documentElement.clientWidth; 

var container3 = document.getElementById('container3');
var channelNodeTop = document.getElementById('channelNodeTop');
var channelNodeBottom = document.getElementById('channelNodeBottom');
var box1 = document.getElementById('box1');
var box2 = document.getElementById('box2');

var width = $('#channelTxCountInfo').width();
var height = $('#channelTxCountInfo').height();

var width2 = $('#channelBar').width();
var height2 = $('#channelBar').height();

var width2 = $('#channelTxCountInfo').width();
$('#channelBar').width = width2;
var height2 = 50;
$('#channelBar').height = height2;

var circleSize, circleDis, testWidth, testHight, test2Height;

if(canvasWidth > 1600 && canvasHeight > 900){
    circleSize = 8;
    circleDis = 12;
}else{
    circleSize = 6;
    circleDis = 10;
}

container3.style.width = width + "px";
container3.style.height = height + "px";
box2.style.width = width + "px";
// box2.style.height = (height - height2)/2 + "px";
// channelNodeTop.style.width = width + "px";
// channelNodeTop.style.height = (height - height2)/4 + "px";
// channelNodeBottom.style.width = width + "px";
// channelNodeBottom.style.height = (height- height2)/4 + "px";
box2.style.height = (height - height2)*2/3 + "px";
channelNodeTop.style.width = width + "px";
channelNodeTop.style.height = (height - height2)/6 + "px";
channelNodeBottom.style.width = width + "px";
channelNodeBottom.style.height = (height- height2)/6 + "px";
box1.style.width = width2 + "px";
box1.style.height = height2 + "px";

// test2Height = (height- height2)/4;
test2Height = (height- height2)/6;
testWidth = width;


var text; 
$.ajax({
  url: "assets/json/test9.json",
  type: "GET",
  dataType: "json",
  async :false,
  success: function(data){
      text = data;
  }
});
var Peer = text.Peers, Order = text.Orders, App = text.Apps, Org = text.Orgs, channelType = text.Channels;

var text1;  //通道数据量
$.ajax({
  url: "assets/json/test11.json",
  type: "GET",
  dataType: "json",
  async :false,
  success: function(data){
      text1 = data;
  }
});

var scroll_width = 40; // 设置每次滚动的长度，单位 px
var scroll_events = "mousewheel";
$("#box1").hover(function(){
  $("#box1").on(scroll_events, function(e){
    var delta = e.originalEvent.wheelDelta;
    if(delta > 0){
      $("#box1").scrollLeft($("#box1").scrollLeft() - scroll_width);
    }else{
      $("#box1").scrollLeft($("#box1").scrollLeft() + scroll_width);
    }
  });
}, function(){
  $("#box1").unbind(scroll_events);
});



for(let i in channelType){   // 生成通道条
    let channelBar = document.createElement('div');
    channelBar.classList.add("channelBar");
    box1.appendChild(channelBar);

    let bar = document.createElement('div');
    bar.setAttribute('class', 'grad');
    bar.setAttribute('id', channelType[i]);
    bar.innerHTML = channelType[i];
    bar.setAttribute('style','color: #66C9FD');
    bar.style.borderBottomLeftRadius = "10px";
    bar.style.borderBottomRightRadius = "10px";
    // bar.setAttribute('style','background-image: linear-gradient(to right, red, orange, yellow, lightgreen, rgb(34, 146, 34), rgb(54, 54, 216), lightblue, rgb(162, 109, 201), violet');
    channelBar.append(bar);
    bar.addEventListener('click', displayNode);  //点击通道条绘制节点
    bar.addEventListener('click', displayHeatMap);  //点击通道条绘制热力图
}

for(let i in channelType){
  document.getElementById(channelType[i]).style.height = height2 - 15 + 'px';
  document.getElementById(channelType[i]).style.width = width/3.5 + 'px';
}

// var fisrtBar = Math.floor(document.getElementsByClassName('channelBar')[0].getBoundingClientRect().left) - 90 -120; //第一个通道渐变条的位置
var fisrtBar = 8;
var canvasTop = d3.select('#channelNodeTop').append('svg').attr('width',testWidth).attr('height',test2Height).attr("id","top");
var canvasBottom = d3.select('#channelNodeBottom').append('svg').attr('width',testWidth).attr('height',test2Height).attr("id","bottom");
var nodeAxisY = [test2Height/4-20, test2Height*2/4, test2Height*3/4+10];

var channelBarClickedArray = []; //记录点击过的通道条，每次点击时先把之前的设置为黑色
var channel;
function displayNode(e){  //点击通道条，显示所有节点
  // var color1 = ["#d758a9", "#ee6d47", "#2897dd", "#3a5c79", "#f49c35", "#f69292", "#7860b6", "#60b697", "#1E90FF", "#0000CD", "#000080"];
  var color1 = ["#66C9FD", "#6861FF", "#AC66FF", "#D1AAFF", "#FFA8BA", "#F8748F", "#FF9C27", "#FFD098", "#15D13E"];
  // d3.selectAll('svg').selectAll('*').remove();
  d3.select('#top').selectAll('*').remove();
  d3.select('#bottom').selectAll('*').remove();
  var count = 0;
  var channelAllNodes = {};

  if(typeof(e) == "string"){
    channel = e;
  }else{
    channel = e.currentTarget.id;
    if(channelBarClickedArray.length > 0){
      channelBarClickedArray.forEach(e => {
        e[0].style.fontWeight = 'normal';
        e[0].style.color = "#66C9FD";
        e[0].style.background = "#6861FF";
      })
    }
  }
  channelBarClickedArray.length = 0;

  // var barLabel = document.getElementById(channel).nextElementSibling;

  // var currentBar = document.getElementById(channel).parentElement;
  var currentBar = document.getElementById(channel);
  currentBar.style.color = "#3A386E";
  currentBar.style.fontWeight = 'bold';
  currentBar.style.background = "linear-gradient(to bottom, #6861FF, #FFD098)";

  if(!channelBarClickedArray.includes(currentBar.innerHTML)){
    channelBarClickedArray.push([currentBar, currentBar.innerHTML]);
  }

  for(let j in Peer){
      if(Peer[j].channelID.includes(channel)){
          if(!channelAllNodes.hasOwnProperty(Peer[j].org)){
              channelAllNodes[Peer[j].org] = [];
              let obj = {"id": Peer[j].id, "score": Peer[j].score};
              channelAllNodes[Peer[j].org].push(obj);
          }else{
            let obj = {"id": Peer[j].id, "score": Peer[j].score};
            channelAllNodes[Peer[j].org].push(obj);

          }
          count += 1;
          // channelAllNodes[Peer[j].org].sort((a,b)=>{return b.score-a.score})
      }

  }

  let dist = Math.floor(testWidth / (Object.keys(channelAllNodes).length + 1) );
  // let color = d3.schemeCategory10;
  let num = 0, colorNum = 0;
  for(let i in channelAllNodes){
      let bar = fisrtBar + dist * num;
      if((num+1) % 2 !=0){
          let count = 1;
          for(let j in channelAllNodes[i]){
            //   canvasTop.append('line').attr('x1',bar + circleDis*j).attr('y1', ( test2Height * channelAllNodes[i][j].score / 100) + 2).attr('x2',bar + circleDis*j).attr('y2',test2Height).attr('stroke', '#000').attr('stroke-width', 1);
            canvasTop.append('line').attr('x1',bar + circleDis*j).attr('y1', ( test2Height * channelAllNodes[i][j].score / 100) + 2).attr('x2',bar + circleDis*j).attr('y2',test2Height).attr('stroke', color1[colorNum]).attr('stroke-width', 1);
              canvasTop.append('circle').attr('cx', bar + circleDis*j).attr('cy', (test2Height * channelAllNodes[i][j].score / 100) + 2).attr('r', circleSize).attr('fill', color1[colorNum])
              .attr('opacity','1').attr('id', channelAllNodes[i][j].id).attr('score', channelAllNodes[i][j].score)
                  .on("mouseover", function(d, i){
                    var t1 = d3.select(this).attr("id");
                    var t2 = d3.select(this).attr("score");
                    d3.select(this).append("title").text(function(d){
                      return t1 + ": " + t2;
                    });

                    // var x = event.clientX - channelNodeTop.offsetLeft;
                    // var y = event.clientY - box1.clientTop - 120;
                    // canvasTop.append('text').attr('x', x).attr('y', y).style('font-weight', 500)
                    //   .style('font-family', 'Arial')
                    //   .style('fill', 'red')
                    //   .text("矩形1")
                  });
              count += 1;
              if(count > 2){count = 0};
          }
          canvasTop.append('text').attr('x', bar + 20).attr('y', 10).style('font-size', 12).style('font-weight', 200)
            .style('font-family', 'Arial')
            .style('fill', color1[colorNum])
            .text(i)

      }else{
          let count = 0;
          for(let j in channelAllNodes[i]){
            //   canvasBottom.append('line').attr('x1',bar + circleDis*j).attr('y1', (test2Height - test2Height * channelAllNodes[i][j].score / 100) * 17/ 18 ).attr('x2',bar + circleDis*j).attr('y2',0).attr('stroke', '#000').attr('stroke-width', 1); 
            canvasBottom.append('line').attr('x1',bar + circleDis*j).attr('y1', (test2Height - test2Height * channelAllNodes[i][j].score / 100) * 17/ 18 ).attr('x2',bar + circleDis*j).attr('y2',0).attr('stroke', color1[colorNum]).attr('stroke-width', 1);
            canvasBottom.append('circle').attr('cx', bar + circleDis*j).attr('cy', (test2Height - test2Height * channelAllNodes[i][j].score / 100) * 17/ 18).attr('r', circleSize).attr('fill', color1[colorNum])
              .attr('opacity','1').attr('id', channelAllNodes[i][j].id).attr('score', channelAllNodes[i][j].score)
                .on("mouseover", function(d, i){
                  var t1 = d3.select(this).attr("id");
                  var t2 = d3.select(this).attr("score");
                  d3.select(this).append("title").text(function(d){
                    return t1 + ": " + t2;
                  });
                });
              count += 1;
              if(count > 2){count = 0};
          }
          canvasBottom.append('text').attr('x', bar + 10).attr('y', test2Height-5).style('font-size', 12).style('font-weight', 200)
            .style('font-family', 'Arial')
            .style('fill', color1[colorNum])
            .text(i)
      }
      num += 1;
      colorNum += 1;
      if(colorNum > 10){colorNum=0};
  }
}

/////////////////////////////////////////////////////////
var totalArray = [];

text1.channels.forEach(e => {
    for(let i in  Object.keys(e)){
      e[Object.keys(e)].forEach(e2 =>{
        e2.forEach(e3 => {
          totalArray.push(e3);
        });
      });
    }
});

var compare = function (x, y) { //比较函数
  if (x < y) {
      return -1;
  } else if (x > y) {
      return 1;
  } else {
      return 0;
  }
}

totalArray.sort(compare);

var length = totalArray.length;
var q1 = totalArray[length/4];
var q3 = totalArray[length*3/4];
var actualMin = totalArray[0];
var actualMax = totalArray[length-1];

var IQR = q3 - q1;
var maxLimit = Math.ceil(q3 + 1.5 * IQR);
var minLimit = Math.ceil(q1 - 1.5 * IQR);

var sliceMax = actualMax > maxLimit ? maxLimit : actualMax;
var sliceMin = actualMin < minLimit ? minLimit : actualMin;

var sliceArray = [];
for(let i = 1; i <= 10; i++){
  sliceArray.push((sliceMax-sliceMin)*i/10)
}
var reward = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

function binarySearch(arr,findVal,leftIndex,rightIndex){	 
  if(leftIndex > rightIndex){ 
    var find = leftIndex-1
        return find;
  }
  var midIndex = Math.floor((leftIndex+rightIndex)/2);
    var midVal = arr[midIndex]; 
    if(midVal>findVal){          
        return binarySearch(arr,findVal,leftIndex,midIndex-1);
    }else if(midVal<findVal){
        return binarySearch(arr,findVal,midIndex+1,rightIndex);
    }else {
      var find = midIndex +1;
        return find;
  } 
}      
function ward(a){
   if(a<=0){
    return 1; 
   }
   if(a>10){
     a=10;
   }
   return reward[a];
 }

text1.channels.forEach(e => {
  for(let i in  Object.keys(e)){
    e[Object.keys(e)].forEach(e2 =>{
      e2.forEach((e3, index, arr) => {
        if(e3 != 0){
          let a = binarySearch(sliceArray,e3,0,9);
          arr[index] = ward(a);
        }
      });
    });
  }
});

// 热力图
var box2 = document.getElementById('box2');
var myChart = echarts.init(box2);
var option;
const days = text1.days;
const hours = [
    '20-24',  '16-20', '12-16', '8-12',  '4-8',  '0-4'
];

function displayHeatMap(e){ //点击通道条显示对应的热力图
  var channel2;
  if(typeof(e) == "string"){
    channel2 = e;
  }else{
    channel2 = e.currentTarget.id;
  }
  // let channel = e.currentTarget.id;
  let column = -1;
  var count = 0;
  for(let i in text1["channels"]){
    if(Object.keys(text1["channels"][i]) == channel2){
      break;
    }
    count += 1;
  }

  let channelTimeCount = text1["channels"][count][channel2].map(function(item){  //给源数据添加x，y坐标，便于绘图
    column += 1;
    return [[column,0,item[0]], [column,1,item[1]], [column,2,item[2]], [column,3,item[3]], [column,4,item[4]], [column,5,item[5]]];
  });
  let data = [], data1=[];
  channelTimeCount.forEach((e)=>{
    data = data.concat(e); //将数组合并,即可绘图
  });

  data.forEach((e)=>{
    // if(e[2] != 0){
    //   data1.push(e);  // 如果某时间段为0，就不显示了
    // }
    data1.push(e); 
  });

  option = {
    tooltip: {position: 'top', axisPointer: {type: 'cross'}},
    grid: {height: '80%', top: '10%', left: '8%',right:'6%'},
    xAxis: {type: 'category',name:'日期', nameLocation: 'end', nameGap: 10, nameTextStyle:{color: '#66C9FD', padding:[-10,0,0,0]}, axisLabel: {textStyle: {color: '#66C9FD'}}, axisLine: {lineStyle: {color: '#66C9FD'}}, data: days, splitArea: {show: true}, },
    yAxis: {type: 'category',name:'时段', nameLocation: 'end', nameGap: 5,  nameTextStyle:{color: '#66C9FD', padding:[0,0,0,-20]}, axisLabel: {textStyle: {color: '#66C9FD'}}, axisLine: {lineStyle: {color: '#66C9FD'}}, data: hours, splitArea: {show: true}, },
    visualMap: {
      show:false,
      min: 0, max: 10, right: 1, bottom: -100, calculable: true, itemWidth:15, itemHeight: 120,align:'left',textGap:'1',
      inRange: {
        color: [
          // '#313695', '#4575b4', '#74add1', '#abd9e9', '#e0f3f8', '#ffffbf','#fee090', '#fdae61', '#f46d43', '#d73027'
          "#66C9FD", "#6861FF", "#AC66FF", "#D1AAFF", "#FFA8BA", "#F8748F", "#FF9C27", "#FFD098", "#15D13E"
        ]
      }
    },
    series: [
      {
        name: channel2,
        type: 'heatmap',
        data: data1,
        label: {show: true, color: "white"},
        emphasis: {
          itemStyle: {
            shadowBlur: 5,
            shadowColor: 'rgba(0, 0, 0, 0.5)'
          }
        }
      }
    ]
  };

  option && myChart.setOption(option);

}

displayNode(channelType[0]);
displayHeatMap(channelType[0]);


