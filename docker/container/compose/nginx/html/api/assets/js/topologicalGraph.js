var container2 = document.getElementById('container2');
var container2_Tool = document.getElementById('container2-tool');
var queryButton1 = document.getElementById('queryButton1');
var clearButton = document.getElementById('clearButton');
var displayHeatmap = document.getElementById('displayHeatmap');
var testWidth = $('#networkGraph').width(), testHight = $('#networkGraph').height();


container2.style.width = testWidth + "px";
container2.style.height = testHight - testHight/16 + "px";
container2_Tool.style.width = testWidth + "px";
container2_Tool.style.height = testHight/16 + "px";

queryButton1.style.height = testHight/16 - 5 + "px";
clearButton.style.height = testHight/16 - 5 + "px";
displayHeatmap.style.height = testHight/16 - 5 + "px";

// 调整图例大小
document.getElementById('nodeExplain').style.width = testWidth/6 + 'px';
document.getElementById('nodeExplain').style.height = testHight/3 + 'px';

var tooltipMain = new G6.Tooltip({
  // offsetX: -20,
  // offsetY: -20,
  fixToNode: [1, 0.5],
  itemTypes: ['node', 'edge'],
  getContent: (e) => {
    var outDiv = document.createElement('div');
    outDiv.style.width = 'fit-content';
    outDiv.style.height = 'fit-content';
    var model = e.item.getModel();
    
    if (e.item.getType() === 'node') {
      if(model.legendType == 'order' || model.legendType == 'client'){
        outDiv.innerHTML = `类型: ${model.category}<br/> ID: ${model.id}<br/> 通道: ${model.channel}`;
      }else {
        outDiv.innerHTML = `类型: ${model.category}<br/> ID: ${model.id}<br/> 组织: ${model.org}<br/> 通道: ${model.channel}`;
      }
    }else{
      var source = e.item.getSource();
      var target = e.item.getTarget();
      outDiv.innerHTML = `来源：${source.getModel().id}<br/>去向：${target.getModel().id}<br/> 通道: ${model.channel}`;
    }
    return outDiv;
  },
});

var graph2 = new G6.Graph({
    container: 'container2',
    width: testWidth,
    height: testHight - container2_Tool.offsetHeight,
    layout: {
      type: 'force',
      preventOverlap: true,
      collideStrength: 1,
    },
    plugins: [tooltipMain],
    modes: {default: ['activate-relations', 'drag-node', 'drag-canvas', 'zoom-canvas'],},
});

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

var Peer = text.Peers, Order = text.Orders, Org = text.Orgs, Client = text.Clients;
var cpuRatio = text.CPU_Use_Ratio, channelType = text.Channels, Anis = text.animation, blockSize = text.BlockSize;
var nodes = new Array(), edges = new Array();

var typeConfigs;
if(Peer.length < 20){
  typeConfigs = {
    'order':{
      'size': 40, 'category': '排序节点', 
    },
    'client':{
      'size': 30, 'category': '客户端', 
    },
    'anchor':{
      'size': 24, 'leader': true, 'category': 'Anchor节点'
    },
    'endoser':{
      'size': 20, 'type':'rect', 'endoser': true, 'category': '背书节点',
    },
    'commit':{
      'size': 16,  'category': '普通节点'
    }
  }
}else{
  typeConfigs = {
    'order':{
      'size': 20, 'category': '排序节点', 
    },
    'client':{
      'size': 15, 'category': '客户端', 
    },
    'anchor':{
      'size': 12, 'leader': true, 'category': 'Anchor节点'
    },
    'endoser':{
      'size': 10, 'type':'rect', 'endoser': true, 'category': '背书节点',
    },
    'commit':{
      'size': 8,  'category': '普通节点'
    }
  }
}

// 统计每个通道的交易数，作为边上动画中方块数量的依据
var transPerChannel = new Array();
for(let i in channelType){
  transPerChannel[channelType[i]] = 0;
}

for(let i in transPerChannel){
  for(let j in Object.keys(Anis)){
    if(Anis[Object.keys(Anis)[j]][2].channel == i){
      transPerChannel[i] += 1;
    }
  }
}

Order.forEach(e => {
    nodes.push({'id': e.id, 'channel': e.channelID, "style":{"fill": '#6861FF', 'stroke':'#ffffff', 'lineWidth':2, }, 'legendType': 'order'});
});

Peer.forEach(e => {
  if(e.anchor == '1'){
    nodes.push({'id': e.id, "style":{"fill": '#F8748F'}, 'org': e.org, 'channel': e.channelID, 'legendType': 'anchor', 'score': e.score});
  }else if(e.endoser == '1'){
    nodes.push({'id': e.id, "style":{"fill": '#15D13E'}, 'org': e.org, 'channel': e.channelID, 'legendType': 'endoser', 'score': e.score});
  }else{
    nodes.push({'id': e.id, "style":{"fill": '#8782FF'}, 'org': e.org, 'channel': e.channelID, 'legendType': 'commit', 'score': e.score});
  }
});

Client.forEach(e =>{
  nodes.push({'id': e.id, 'channel': e.channelID, "style":{"fill": '#FF9C27'}, 'legendType': 'client', 'type':'background-animate'});
});

nodes.forEach(node =>{
  if (!node.legendType) return;
  node = Object.assign(node, {...typeConfigs[node.legendType]});
});


var count = 0;
Peer.forEach(e1 => {
  if(e1.anchor == '1'){
    edges.push({'id': 'edge'+count ,'source': e1.order, 'target': e1.id, 'channel': e1.channelID, 'org': e1.org, 'edge-type': 'anchor-order', 'transaction': transPerChannel[e1.channelID]});
    edges.push({'id': 'reverse_edge'+count ,'source': e1.id, 'target': e1.order, 'channel': e1.channelID, 'org': e1.org, 'edge-type': 'order-anchor', 'transaction': transPerChannel[e1.channelID]});
    count += 1;
    Peer.forEach(e2 => {
      if(e2.id != e1.id && e2.org == e1.org && e2.channelID.includes(e1.channelID)){
        edges.push({'id': 'edge'+count, 'source': e1.id, 'target': e2.id, 'channel': e1.channelID, 'org': e1.org, 'edge-type': 'leader-commit', 'transaction': transPerChannel[e1.channelID]});
        count += 1;
      }
    })
  }
});

var countClient = 0;
Client.forEach(e =>{
  Peer.forEach(e1=>{
    if(e1.anchor == '1' && e1.channelID == e.channelID){
      edges.push({'id': 'edge-client-'+countClient, 'source': e.id, 'target': e1.id, 'channel': e1.channelID, 'edge-type': 'client-anchor', 'transaction': transPerChannel[e1.channelID]});
      edges.push({'id': 'client-edge-'+countClient, 'source': e1.id, 'target': e.id, 'channel': e1.channelID, 'edge-type': 'anchor-client', 'transaction': transPerChannel[e1.channelID]});
      countClient += 1;
    }
  })
});

var countOrder = 0;
for(let i = 0; i< Order.length; i++){
  for(let j = i + 1; j< Order.length; j++){
    if(Order[i].channelID == Order[j].channelID){
      edges.push({'id': 'edge-order-'+countOrder, 'source': Order[i].id, 'target': Order[j].id, 'channel': Order[i].channelID, 'edge-type': 'order-order', 'transaction': transPerChannel[Order[i].channelID]});
      countOrder ++;
    }
  }
}

graph2.data({nodes,edges});
graph2.render();

graph2.on('node:dragstart', function (e) {
  graph2.layout();
  refreshDragedNodePosition(e);
});
graph2.on('node:drag', function (e) {
  refreshDragedNodePosition(e);
});
graph2.on('node:dragend', function (e) {
  e.item.get('model').fx = null;
  e.item.get('model').fy = null;
});
// graph2.on('canvas:dragend', function(e){
//   graph2.paint();
//   graph2.refresh();
// });
var zoom = 1;
graph2.on('wheelzoom', (e) => {
  e.stopPropagation();
  zoom = graph2.getZoom();  //缩放画布时，获取缩放尺度，以调整热力图的半径
});

// import {container5, testPeer, chainAnimation, peerAllTransaction, transactionHis, peerRate} from './nodeGraph.js';
// graph2.on('node:click', (e) => {
//   var nodeItem = e.item; // 获取鼠标离开的节点元素对象
//   if(nodeItem['_cfg'].model.category != '排序节点'){
//     container5.style.visibility = 'visible';
//     container5.style.display='block';
//     // container5.setAttribute('peer_id', nodeItem['_cfg'].model.id);
//     // container5.setAttribute('peer_category', nodeItem['_cfg'].model.category);
//     testPeer();
//     document.getElementById('peerID').innerHTML = nodeItem['_cfg'].model.id;
//     chainAnimation(12);
//     peerAllTransaction(nodeItem['_cfg'].model.id);
//     peerRate(nodeItem['_cfg'].model.id);
//     transactionHis();
//   }

// });

function refreshDragedNodePosition(e) {
  var model = e.item.get('model');
  model.fx = e.x;
  model.fy = e.y;
}

window.onload = function(){
  var edge1 = graph2.getEdges();
  for(let i in edge1){
    graph2.updateItem(edge1[i], {
      type: 'running-line'
    });
  }
}


// 调用多选框的方法
$(function() {
  $('.demo').fSelect();
  $('.fs-label').css("line-height", testHight/32 + "px");
  $('.fs-label').css("width", testWidth/3 + "px");
});
// 动态生成下拉列表框的选项
channelType.forEach(c =>{
  document.getElementById('channelList').append(new Option(c,c));
});
Org.forEach(o => {
  document.getElementById('orgList').append(new Option(o,o));
});

var hideItems = new Array();
document.getElementById('clearButton').addEventListener('click', ()=>{
  if(hideItems.length>0){
    hideItems.forEach(e => {
      graph2.showItem(e);
    });
    graph2.layout();
    hideItems.length = 0;
  }

  $('.heatmap-canvas').remove();

});

document.getElementById('queryButton1').addEventListener('click', ()=>{
  let allChoose = document.getElementsByClassName('fs-label')[0].innerHTML.split(",");
  let channelList = [], org = [];
  let getChannel = $("#channelList").find("option:selected").text();
  let getOrg = $("#orgList").find("option:selected").text();

  for(let i in allChoose){
    let j = allChoose[i].trim();
    if(getChannel.includes(j)){
      channelList.push(j);
    }else if(getOrg.includes(j)){
      org.push(j);
    }
  }

  if(channelList.length>0){
    if(org.length == 0){
      graph2.getNodes().forEach(node => {
        if(Array.isArray(node._cfg.model.channel)){
          let label = 0;
          node._cfg.model.channel.forEach(e => {
            if(channelList.includes(e)){
              label = 1;
            }
          });
          if(label == 0){
            graph2.hideItem(node);
            hideItems.push(node);
          }
        }else{
          if(!channelList.includes(node._cfg.model.channel)){
            graph2.hideItem(node);
            hideItems.push(node);
          }
        }
      });
    }

    if(org.length > 0){
      graph2.getNodes().forEach(node => {
        if(Array.isArray(node._cfg.model.channel)){
          let label = 0;
          node._cfg.model.channel.forEach(e => {
            if(channelList.includes(e)){
              label = 1;
            }
          });
          if(label == 0){
            graph2.hideItem(node);
            hideItems.push(node);
          }
        }
        else{
          if(!channelList.includes(node._cfg.model.channel)){
            graph2.hideItem(node);
            hideItems.push(node);
          }
        }
  
        if(!org.includes(node._cfg.model.org)){
          graph2.hideItem(node);
          hideItems.push(node);
        }
      });
    }
  }

  else if(channelList.length == 0 && org.length > 0){
    graph2.getNodes().forEach(node => {
      if(!org.includes(node._cfg.model.org)){
        // node.hide();
        graph2.hideItem(node);
        hideItems.push(node);
      }
    });

  }

  graph2.layout();
})

G6.registerEdge(
  'running-line',
  {
    afterDraw(cfg, group) {
      // console.log(cfg.transaction);
      var shape = group.get('children')[0];
      if(cfg.transaction>10){
        cfg.transaction = 10;
      }
      let circleCount = Math.ceil(cfg.transaction) / 10;
      // var delay;
      // if(cfg.delay){
      //   delay = cfg.delay * 5;
      // }else{delay = 0;}
      
      // circleCount = circleCount === 0 ? 1 : circleCount;

      var _loop = function _loop(i) {
        var start = shape.getPoint(i / circleCount);
        var circle = group.addShape('rect', {
          attrs: {
            x: start.x,
            y: start.y,
            width: 3,
            height: 3,
            fill: '#66C9FD',
            shadowColor: '#fff',
            shadowBlur: 30,
          },
          name: 'circle-shape',
        });
        circle.animate(
          (ratio) => {
            ratio += i / circleCount;
            if (ratio > 1) {
              ratio %= 1;
            }
            var tmpPoint = shape.getPoint(ratio);
            return {
              x: tmpPoint.x,
              y: tmpPoint.y,
            };
          },
          {
            repeat: true,
            duration: Math.random()*2000 + 1000,
            // delay: delay
          },
        );
      };
      for (let i = 0; i < circleCount; i++) {
        _loop(i);
      }
    },
  },
  'line',
);


document.getElementById('displayHeatmap').addEventListener('click', ()=>{
  graph2.paint();
  graph2.refresh();

  var node1 = graph2.getNodes();

  var heatmap1 = h337.create({
    container: container2, //容器
      radius : 30 * zoom, //半径，可以根据放缩程度变化
    //   opacity, //透明
      maxOpacity : .8, //热图中最大值具有的最大不透明度
      // gradient: {
      //   '0.2':'#e803eb',
      //   '0.4':'#207cca',
      //   '0.6':"#31ff00",
      //   '0.8':'#f8ff00',
      //   '0.9':'#ff0500',
      // }
      // minOpacity : .1, //热图中最小值的最小不透明度
    //   onExtremaChange, //传递回调以接收极值更改更新
    //   blur, //将应用于所有数据点的模糊因子。模糊因子越高，渐变将越平滑
  });


  heatmap1.setData({
    max: 100,
    data: [{ x: 0, y: 0, value: 0}]
  });

  for(let i in node1){
    let vote = {};
    if(node1[i].isVisible()){
    let point = graph2.getCanvasByPoint(node1[i]['_cfg'].model.x, node1[i]['_cfg'].model.y);  // canvas放缩、拖动会牵涉到坐标系的计算
    vote.x = point.x;
    vote.y = point.y;
    // vote.value = node1[i]['_cfg'].model.x + node1[i]['_cfg'].model.y;
    vote.value = 100 - node1[i]['_cfg'].model.score;
    heatmap1.addData(vote);
    }
  }
});
