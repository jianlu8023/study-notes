var canvasHeight = document.documentElement.clientHeight;  // var t2Height = window.screen.height;
var canvasWidth = document.documentElement.clientWidth;  // var t2Width = window.screen.width;

console.log(canvasHeight);
console.log(canvasWidth);


// var centerOrderX = 500, centerOrderY = 350;  // Order节点位置
// var centerPeerConnectX = 280, centerPeerConnectY = 350;  //与客户端连接的peer节点位置


var centerOrderX = canvasWidth / 2.6, centerOrderY = canvasHeight / 2 - 20;  
var centerPeerConnectX = canvasWidth / 5, centerPeerConnectY = canvasHeight /2 - 30;  

const data = {
    nodes: [
        {
            id: 'node1',x: centerPeerConnectX + 120 ,y: centerPeerConnectY + 30,size: [20],type: 'rect',label: '0',comboId: 'combo_connect_peer',
            style:{radius: 4,fill: '#fcc885',},
        },
        {
            id: 'node2',x: centerPeerConnectX + 80,y: centerPeerConnectY + 30,size:[20],type: 'rect',comboId: 'combo_connect_peer',label: '1',
            style:{radius: 4,fill: '#fcc885',},
        },
        {
            id: 'node3',x: centerPeerConnectX + 40,y: centerPeerConnectY + 30,size:[20],type: 'rect',comboId: 'combo_connect_peer',label: '2',
            style:{radius: 4,fill: '#fcc885',},
        },
        {
            id: 'node4',x: centerPeerConnectX + 40,y: centerPeerConnectY + 70,size:[20],type: 'rect',comboId: 'combo_connect_peer',label: 'X',
            style:{radius: 4,fill: '#fcc885',},
        },
        {
            id: 'node5',x: centerPeerConnectX + 80,y: centerPeerConnectY + 70,size:[20],type: 'rect',comboId: 'combo_connect_peer',label: 'Y',
            style:{radius: 4,fill: '#fcc885',},
        },
        {
            id: 'node6',x: centerPeerConnectX + 120,y: centerPeerConnectY + 70,size:[20],type: 'rect',comboId: 'combo_connect_peer',label: 'Z',
            style:{radius: 4,fill: '#fcc885',},
        },

        {
            id: 'node-user',img:'image/客户端.png',type: 'image',x: (centerOrderX+120+centerPeerConnectX)/2,y: centerOrderY-100,size:[50,90],labelCfg:{style:{fontSize: 16,},
            anchorPoints: [[0, 0.5],[1, 0.5],[0.5, 1],[0.5, 0],],
            },
        },

        {
            id: 'node-order',img:'image/加工中心.png', type: 'image',x: centerOrderX+40,y: centerOrderY+35,size: 100,labelCfg:{position:'bottom',style:{fontSize: 16}, },
            anchorPoints: [[0, 0.5],[1, 0.5],[0.5, 1],[0.5, 0],],
        },

        {
            id: 'node-ca',img:'image/CA.png',type: 'image',size:40,x:(centerOrderX+120+centerPeerConnectX)/2,y:centerOrderY+150,label: "CA",
            labelCfg:{position:'bottom',style:{fontSize: 16,},},
        },
    ],

    edges: [
        {id:'peer_1_1',source: 'node1',target: 'node2',type: 'line',},
        {id:'peer_1_2',source: 'node2',target: 'node3',type: 'line',},
        {id:'peer_1_3',source: 'node3',target: 'node4',type: 'polyline',style:{lineDash: [3, 2],lineWidth: 3,}},
        {id:'peer_1_4',source: 'node4',target: 'node5',type: 'line'},
        {id:'peer_1_5',source: 'node5',target: 'node6',type: 'line',},
    ],

    combos: [
        {
            id: 'combo_connect_peer', label:'连接客户端的Peer', padding:  [22, 10, 10, 40], //上右下左
            // style: {fill: "l(0) 0:#97fff6 0.4:#47cbd0 1:#2b5d92"},
            anchorPoints: [[0, 0.5],[1, 0.5],[0.5, 1],[0.5, 0],]
        },
    ],
};

const container = document.getElementById('container');
const width = canvasWidth;  // const width = container.scrollWidth;
const height = canvasHeight;  // const height = container.scrollHeight || 800;
const graph = new G6.Graph({
    container: 'container',
    width, height,
    fitview: true,
    groupByTypes: false,
    // modes: {default: ['drag-combo','drag-node','collapse-expand-combo'],},
    defaultCombo: {
        type: 'rect', style: {radius: 10,}, labelCfg: {position: 'top',},
    },
    defaultEdge: {
        style: {stroke: 'black',lineWidth: 2,},
    },
});

//获取随机点坐标
// var getRandomPosition =  function(e, graph) {
//     //生成的坐标点
//     let X = 0; //     let Y = 0;//     let R = 300;//     let Cx = center_x;//     let Cy = center_y;
//     //随机横坐标
//     let Rx = parseInt(Math.floor(Math.random() * R * 2) + 1 - R);
//     //1- 一二象限 2-三四象限
//     let qd = Math.floor(Math.random() * 2) + 1;
//     if (qd == 1) {
//       X = Cx + Rx;
//       Y = Cy - parseInt(Math.sqrt(R * R - Rx * Rx));
//     } else {
//       X = Cx + Rx;
//       Y = Cy + parseInt(Math.sqrt(R * R - Rx * Rx));
//     }
//     return {
//       x: X,
//       y: Y
//     }
// }

// 将圆n等分，获得坐标
var pointOrder = [], pointPeer = [], pointOrg=[];
var getPointOrder = function(r, ox, oy, count){   //以order为圆心，生成坐标
    let radians = (Math.PI / 180) * Math.round(210 / count), //弧度
        i = 0;
    for(; i < count; i++){
        // let plusOrMinus = Math.random() < 0.5 ? -1 : 1; // let ranX = Math.round(Math.random()*50) * plusOrMinus;
        let x = ox + (r+50) * Math.sin(radians * i),
            y = oy + r * Math.cos(radians * i);
        pointOrder.push({x:x,y:y}); // point.unshift({x:x,y:y}); //为保持数据顺时针
    }
}
// getPoint(300,center_x,center_y, 9)  // console.log(point);

var getPointPeer = function(r, ox, oy, count){   //以connect_peer为圆心，生成坐标
    // if(count < 3){
    //     count += 3
    //     let radians = (Math.PI / 180) * Math.round(-180 / count), 
    //     i = 0;
    //     for(; i < count; i++){
    //         let x = ox + r * Math.sin(radians * i),
    //             y = oy + r * Math.cos(radians * i);
    //         pointPeer.push({x:x,y:y});
    //     }
    // }else{
    //     let radians = (Math.PI / 180) * Math.round(-180 / count), 
    //     i = 0;
    //     for(; i < count; i++){
    //         let x = ox + r * Math.sin(radians * i),
    //             y = oy + r * Math.cos(radians * i);
    //         pointPeer.push({x:x,y:y});
    //     }
    // }
    if(count <= 5){
        let radians = (Math.PI / 180) * Math.round(-200 / count), 
        i = 0;
        for(; i < count; i++){
            let x = ox + r * Math.sin(radians * i),
                y = oy + r * Math.cos(radians * i);
            pointPeer.push({x:x,y:y});
        }
    }else{
        let radians = (Math.PI / 180) * Math.round(-260 / count), 
        i = 0;
        for(; i < count; i++){
            let x = ox + r * Math.sin(radians * i),
                y = oy + r * Math.cos(radians * i);
            pointPeer.push({x:x,y:y});
        }
    }
}

var getPointOrg = function(r, ox, oy, count){
    let radians = (Math.PI / 180) * Math.round(-180 / count), 
    i = 0;
    for(; i < count; i++){
        // let x = ox + r * Math.sin(radians * i),
        //     y = oy + r * Math.cos(radians * i);
        let x = ox + r * Math.cos(radians * i),
        y = oy + r * Math.sin(radians * i) ;
        pointOrg.push({x:x,y:y});
    }
}

graph.data(data);
graph.render();

graph.on('combo:mouseenter', (evt) => {
    const { item } = evt;
    graph.setItemState(item, 'active', true);
});
  
graph.on('combo:mouseleave', (evt) => {
    const { item } = evt;
    graph.setItemState(item, 'active', false);
});

// graph.on('combo:click', (evt) => {
//     const { item } = evt;
//     graph.setItemState(item, 'selected', true);
// });


var x, nOrder=0, nPeer=0, r=250;
var text, color;
var Peers, Apps, Orders, Orgs, orgNum = new Array();
var labelNum, blocknum, endoserPeer = [], leaderPeer = [];

//---------------------------------------------------------------------
// ajax获取数据
//---------------------------------------------------------------------
$.ajax({
    url: "assets/json/test2.json",
    type: "GET",
    dataType: "json",
    async :false,
    success: function(data){
        text = data;
    }
})

Peers = text.Peers;
Apps = text.Apps;
Orders = text.Orders;
Orgs = text.Orgs;

for(let i in Peers){
    if(Peers[i].endoser == 1){
        nPeer += 1;
    }else if(Peers[i].leader == 1){
        nOrder += 1;
    }
}

for(let j in Orgs){
    let num = 0;
    for(let i in Peers){
        if(Peers[i].org == Orgs[j].id && Peers[i].leader != 1 && Peers[i].endoser != 1){
            num +=1 ;
        }
    }
    orgNum[Orgs[j].id] = num; // 将组织中节点的个数（不含背书与主节点）添加进字典 console.log(orgNum);
}
// console.log(orgNum);

blocknum = parseInt(Peers[0].block_num);
getPointOrder(r + 40, centerOrderX,centerOrderY + 20, nOrder); // 计算以order为圆心，Leader节点的坐标
getPointPeer(r, centerPeerConnectX-10, centerPeerConnectY - 30, nPeer - 1); // 计算以connect_peer为圆心。背书节点的坐标

var i = 0, j = 0, modes_num = 2, comboNum = nPeer + nOrder;
// comboNum = Peers.length

document.getElementById("btn1").addEventListener('click',()=>{
    let point = [];
    graph.updateItem("node-user",{
        label: Apps[0].id, labelCfg:{position: "top"}
    });
    graph.updateItem("node-order",{
        label: Orders[0].id
    });
    // graph.updateItem("node-ca",{
    //     label: Apps[0].id
    // });
    graph.updateItem("node4",{
        label: blocknum - 3
    });
    graph.updateItem("node5",{
        label: blocknum - 2
    });
    graph.updateItem("node6",{
        label: blocknum - 1
    });

    // while(i < nPeer-1 && j< nOrder){
    for(x in Peers){
        if(Peers[x].connect_app){
            graph.updateItem("combo_connect_peer",{
                label: Peers[x].org + '- Endoser'
            });
        }else if(Peers[x].endoser === '1' && !Peers[x].connect_app){
            // endoserPeer.push(Peers[x].id); // 背书节点轮廓包裹
            // endoserPeer.push(["combo_connect_peer", Peers[x].id]);

            color = "l(0) 0:#97fff6 0.4:#47cbd0 1:#2b5d92";
            point = pointPeer;
            graph.addItem('combo',{
                id: Peers[x].id, label: Peers[x].org + "-" + "Endoser",
                padding:  [22, 10, 10, 40], //上右下左
                style:{fill: color,}, anchorPoints: [[0, 0.5],[1, 0.5],[0.5, 1],[0.5, 0],],
            });

            var ranX = point[i].x, ranY = point[i].y;
        
            graph.addItem('node',{
                id: 'test_'+ modes_num + '_' + 1,x: ranX + 120,y: ranY,
                type:'rect',size:20,label: '0',comboId: Peers[x].id,style:{radius: 4,fill: '#fcc885',},
            });
            graph.addItem('node',{
                id: 'test_'+ modes_num + '_' + 2,x: ranX + 80,y: ranY,
                type:'rect',size:20,label: '1',comboId: Peers[x].id, style:{radius: 4,fill: '#fcc885',},
            });
            graph.addItem('node',{
                id: 'test_'+ modes_num + '_' + 3,x: ranX + 40,y: ranY,
                type:'rect',size:20,label: '2',comboId: Peers[x].id,style:{radius: 4,fill: '#fcc885',},
            });
            graph.addItem('node',{
                id: 'test_'+ modes_num + '_' + 4,x: ranX + 40,y: ranY + 40,
                type:'rect',size:20,label: blocknum - 3,comboId: Peers[x].id,style:{radius: 4,fill: '#fcc885',},
            });
            graph.addItem('node',{
                id: 'test_'+ modes_num + '_' + 5,x: ranX + 80,y: ranY + 40,
                type:'rect',size:20,label: blocknum - 2,comboId: Peers[x].id,style:{radius: 4,fill: '#fcc885',},
            });
            graph.addItem('node',{
                id: 'test_'+ modes_num + '_' + 6,x: ranX + 120,y: ranY + 40,
                type:'rect',size:20,label: blocknum - 1,comboId: Peers[x].id,style:{radius: 4,fill: '#fcc885',},
            });
    
            graph.addItem('edge',{
                id: 'peer_' + modes_num + '_' + 1,source: 'test_'+ modes_num + '_' + 1,target: 'test_'+ modes_num + '_' + 2,targetAnchor:0,type: 'line',
            });
            graph.addItem('edge',{
                id: 'peer_' + modes_num + '_' + 2,source: 'test_'+ modes_num + '_' + 2,target: 'test_'+ modes_num + '_' + 3,type: 'line',
            });
            graph.addItem('edge',{
                id: 'peer_' + modes_num + '_' + 3,source: 'test_'+ modes_num + '_' + 3,target: 'test_'+ modes_num + '_' + 4,type: 'polyline',
                style:{lineDash: [3, 2],lineWidth: 3,},
            });
            graph.addItem('edge',{
                id: 'peer_' + modes_num + '_' + 4,source: 'test_'+ modes_num + '_' + 4,target: 'test_'+ modes_num + '_' + 5,type: 'line',
            });
            graph.addItem('edge',{
                id: 'peer_' + modes_num + '_' + 5,source: 'test_'+ modes_num + '_' + 5,target: 'test_'+ modes_num + '_' + 6,type: 'line',
            });
        
            i += 1;
            modes_num += 1;

        }else if(Peers[x].endoser === '0' && Peers[x].leader =='1'){
            //    leaderPeer.push(Peers[x].id);
            // leaderPeer.push(["node-order", Peers[x].id]);
            point = pointOrder;

            graph.addItem('combo',{
                id: Peers[x].id, label: Peers[x].org + '-' + 'Leader', anchorPoints: [[0, 0.5],[1, 0.5],[0.5, 1],[0.5, 0],],style:{fill:'#ECFFFF'},
                padding:  [22, 10, 10, 40], //上右下左
            });
            
            graph.addItem('node',{
                id: 'test_'+ modes_num + '_' + 1,x: point[j].x + 120,y: point[j].y,type:'rect',size:20,label: '0',comboId: Peers[x].id,
                style:{radius: 4,fill: '#fcc885',},
            });
            graph.addItem('node',{
                id: 'test_'+ modes_num + '_' + 2,x: point[j].x + 80,y: point[j].y,type:'rect',size:20,label: '1',comboId: Peers[x].id,
                style:{radius: 4,fill: '#fcc885',},
            });
            graph.addItem('node',{
                id: 'test_'+ modes_num + '_' + 3,x: point[j].x + 40,y: point[j].y,type:'rect',size:20,label: '2',comboId: Peers[x].id,
                style:{radius: 4,fill: '#fcc885',},
            });
            graph.addItem('node',{
                id: 'test_'+ modes_num + '_' + 4,x: point[j].x + 40,y: point[j].y + 40,type:'rect',size:20,label: blocknum - 3,comboId: Peers[x].id,
                style:{radius: 4,fill: '#fcc885',},
            });
            graph.addItem('node',{
                id: 'test_'+ modes_num + '_' + 5,x: point[j].x + 80,y: point[j].y + 40,type:'rect',size:20,label: blocknum - 2,comboId: Peers[x].id,
                style:{radius: 4,fill: '#fcc885',},
            });
            graph.addItem('node',{
                id: 'test_'+ modes_num + '_' + 6,x: point[j].x + 120,y: point[j].y + 40,type:'rect',size:20,label: blocknum - 1,comboId: Peers[x].id,
                style:{radius: 4,fill: '#fcc885',},
            });
    
            graph.addItem('edge',{
                id: 'peer_' + modes_num + '_' + 1,source: 'test_'+ modes_num + '_' + 1,target: 'test_' + modes_num + '_' + 2,type: 'line',
            });
            graph.addItem('edge',{
                id: 'peer_' + modes_num + '_' + 2,source: 'test_'+ modes_num + '_' + 2,target: 'test_' + modes_num + '_' + 3,type: 'line',
            });
            graph.addItem('edge',{
                id: 'peer_' + modes_num + '_' + 3,source: 'test_'+ modes_num + '_' + 3,target: 'test_' + modes_num + '_' + 4,sourceAnchor:0,targetAnchor:0,type: 'polyline',
                style:{lineDash: [3, 2],lineWidth: 4,},
            });
            graph.addItem('edge',{
                id: 'peer_' + modes_num + '_' + 4,source: 'test_'+ modes_num + '_' + 4,target: 'test_'+ modes_num + '_' + 5,type: 'line',
            });
            graph.addItem('edge',{
                id: 'peer_' + modes_num + '_' + 5,source: 'test_'+ modes_num + '_' + 5,target: 'test_'+ modes_num + '_' + 6,type: 'line',
            });
        
            j += 1;
            modes_num += 1;
        }
    }

    // for(let i in endoserPeer){
    //     const endoserHull = graph.createHull({
    //         id: 'endoserNode-hull1' + i,
    //         members: endoserPeer[i],
    //         // type: 'bubble',
    //         padding: 20,
    //         style: {
    //           fill: 'lightblue',
    //           opacity: 0.1,
    //           stroke: 'blue',
    //         },
    //     });

    //     graph.on('afterupdateitem', (e) => {
    //         endoserHull.updateData(endoserHull.members);
    //     });
    // }

    // for(let i in leaderPeer){
    //     const leaderHull = graph.createHull({
    //         id: 'leaderNode-hull1' + i,
    //         members: leaderPeer[i],
    //         // type: 'bubble',
    //         padding: 20,
    //         style: {
    //           fill: 'lightgreen',
    //           opacity: 0.1,
    //           stroke: 'green',
    //         },
    //     });
        
    //     graph.on('afterupdateitem', (e) => {
    //         leaderHull.updateData(leaderHull.members);
    //     });
    // }
    
    //}
    moveProgressBar(0,0,20);

});

document.getElementById("btn2").addEventListener('click',()=>{
    var app_peer_Hull = graph.createHull({
        id: 'app_peer-hull1',
        members: ['node-ca', 'node-user'],
        padding: 12,
        style: {
          fill: 'yellow',
          opacity: 0.1,
        },
    });
    
    // graph.on('afterupdateitem', (e) => {
    //     app_peer_Hull.updateData(app_peer_Hull.members);
    // });

    graph.addItem('edge',{
        id:"app_to_ca", source:"node-user", target:"node-ca",type: 'app_to_ca'
    });

    var timer1 = setTimeout(function(){
        graph.hideItem('app_to_ca');
        graph.addItem('edge',{
            id:"ca_to_app", source:"node-ca", target:"node-user",type: 'ca_to_app'
        });
    }, 3500);

    moveProgressBar(1,20,40);
});


document.getElementById("btn3").addEventListener('click',()=>{
    graph.removeHull('app_peer-hull1');
    graph.hideItem('ca_to_app');

    graph.addItem('edge',{
        id: "test1",source: "node-user",target: "combo_connect_peer", type: 'proposal0'
    });

    var timer1 = setTimeout(function(){
        graph.hideItem('test1');

        for(x in Peers){
            if(Peers[x].endoser == '1' && !Peers[x].connect_app){
                graph.addItem('edge',{
                    id: "test2-"+ x ,source: "combo_connect_peer",target: Peers[x].id, type: 'proposal0'
                });
                endoserPeer.push(["combo_connect_peer", Peers[x].id]);
            }
        }

        for(let i in endoserPeer){
            const endoserHull = graph.createHull({
                id: 'endoserNode-hull' + i,
                members: endoserPeer[i],
                // type: 'bubble',
                padding: 20,
                style: {
                  fill: 'lightblue',
                  opacity: 0.1,
                  stroke: 'blue',
                },
            });
    
            // graph.on('afterupdateitem', (e) => {
            //     endoserHull.updateData(endoserHull.members);
            // });
        }
    }, 3500);

    moveProgressBar(2,40,60);

});

document.getElementById("btn4").addEventListener('click',()=>{

    graph.getEdges().forEach((value) =>{
        let edge_selec = value['_cfg'].id;
        if(edge_selec.startsWith('test2')){
            graph.hideItem(edge_selec);
        }       
    });

    for(x in Peers){
        if(Peers[x].endoser == '1' && !Peers[x].connect_app){
            graph.addItem('edge',{
                id: "test3-"+ x ,source: Peers[x].id,target: "combo_connect_peer", type: 'return'
            });
        }
    }

    var timer2 = setTimeout(function(){
        graph.getEdges().forEach((value)=>{
            let edge_selec = value['_cfg'].id;
            if(edge_selec.startsWith('test3')){
                graph.hideItem(edge_selec);
            }
        });

        for(let i in endoserPeer){
            graph.removeHull('endoserNode-hull' + i);
        }

        graph.addItem('edge',{
            id: "test4",source: "combo_connect_peer",target: "node-user", type: 'return'
        });
        var timer3 = setTimeout(function(){
            graph.hideItem('test4');
            graph.addItem('edge',{
                id: "test5",source: "node-user",target: "node-order", type: 'commit'
            });
        },3500);
    },3500);

    moveProgressBar(3,60,80)
});

document.getElementById("btn5").addEventListener('click',()=>{
    graph.hideItem('test5');

    graph.getCombos().forEach((value)=>{
        let comboLabel = value['_cfg'].model.label
        if(comboLabel.indexOf('Leader')> -1){
            graph.addItem('edge',{
                id:"test6-"+value['_cfg'].id, source:"node-order", target: value['_cfg'].id, type:"chain"
            });
            leaderPeer.push(["node-order", value['_cfg'].id])
        };
        
    });

    for(let i in leaderPeer){
        const leaderHull = graph.createHull({
            id: 'leaderNode-hull' + i,
            members: leaderPeer[i],
            type: 'bubble',
            padding: 20,
            style: {
              fill: 'lightgreen',
              opacity: 0.1,
              stroke: 'green',
            },
        });
        
        // graph.on('afterupdateitem', (e) => {
        //     leaderHull.updateData(leaderHull.members);
        // });
    }

    var timer4 = setTimeout(function(){
        graph.getEdges().forEach((value)=>{
            let edge_selec = value['_cfg'].id;
            if(edge_selec.startsWith('test6')){
                graph.hideItem(edge_selec);
            }
        });

        graph.getCombos().forEach((value)=>{
            let comboId = value['_cfg'].model.id;
            let comboLabel = value['_cfg'].model.label;
            let leaderX, leaderY, orgId, count, orgPoint;
            let commitPeer = [];
            if(comboLabel.indexOf('Leader')> -1){  // Leader节点
                // console.log(value['_cfg'].nodes[0]['_cfg'].id);
                commitPeer.push(value['_cfg'].nodes[1]['_cfg'].id);
        
                leaderX = parseInt(value['_cfg'].model.x);
                leaderY = parseInt(value['_cfg'].model.y);
                orgId = value['_cfg'].model.label.substring(0,4); // Leader节点所在的组织
                count = orgNum[orgId];  // console.log(count);

                if(count >= 1){
                    let i = 0;
                    getPointOrg(110,leaderX-90,leaderY, count);  // getPointOrg(100,leaderX+70,leaderY-40, count);
                    orgPoint = pointOrg;
        
                    for(x in Peers){
                        if(Peers[x].org == orgId && Peers[x].endoser != '1' && Peers[x].leader != '1'){
                            graph.addItem('combo',{
                                id: 'common_' + Peers[x].id, // label: Peers[x].id,labelCfg:{position:'top', refY: -10, style:{fontSize:10}},
                                padding:  [2, 2, 2, 2], anchorPoints: [[1, 0.5],[0.5, 1],[0.5, 0],],
                            });

                            // commitPeer.push([value['_cfg'].nodes[1]['_cfg'].id, 'common_' + Peers[x].id]);
                            commitPeer.push('common_' + Peers[x].id);
                
                            let ranX = orgPoint[i].x, ranY = orgPoint[i].y;
                        
                            graph.addItem('node',{
                                id: 'committer_' + modes_num + '_' + 1,x: ranX + 80,y: ranY,
                                type:'rect',size:15,label: blocknum - 2, labelCfg:{style:{fontSize:10}}, comboId: 'common_' + Peers[x].id,style:{radius: 4,fill: '#fcc885',},
                            });

                            graph.addItem('node',{
                                id: 'committer_' + modes_num + '_' + 2,x: ranX + 100,y: ranY,
                                type:'rect',size:15,label: blocknum - 1, labelCfg:{style:{fontSize:10}}, comboId: 'common_' + Peers[x].id,style:{radius: 4,fill: '#fcc885',},
                            });

                            graph.addItem('edge',{
                                id: 'leader_to_peer' + modes_num,
                                source: comboId, target:'common_' + Peers[x].id, type:'line',
                            });

                            graph.hideItem('leader_to_peer' + modes_num);
                        
                            i += 1;
                            modes_num += 1;
                        }
                        // else if(Peers[x].org == orgId && Peers[x].endoser == '1' && Peers[x].leader != '1' ){
                        //     graph.addItem('edge',{
                        //         id: 'leader_to_endoser' + modes_num,
                        //         source: comboId, target: Peers[x].id, type:'quadratic',
                        //     });
                        // }
                    }

                    // for(let i in commitPeer){
                    //     let committerHull = graph.createHull({
                    //         id: 'committerNode-hull' + orgId + i,
                    //         members: commitPeer[i],
                    //         type: 'bubble',
                    //         padding: 1,
                    //         style: {
                    //           fill: 'red',
                    //         },
                    //     });
                        
                    //     graph.on('afterupdateitem', (e) => {
                    //         committerHull.updateData(committerHull.members);
                    //     });
                    // }

                    let committerHull = graph.createHull({
                        id: 'committerNode-hull' + orgId,
                        members: commitPeer,
                        type: 'smooth-convex',
                        padding: 15,
                        style: {
                          fill: 'red',
                        //   stroke: 'green',
                        },
                    });
                    
                    // graph.on('afterupdateitem', (e) => {
                    //     committerHull.updateData(committerHull.members);
                    // });

                }

            }; 
            pointOrg = [];
        });

    },3500);



});

document.getElementById('btn6').addEventListener('click',()=>{
    for(let i in leaderPeer){
        graph.removeHull('leaderNode-hull' + i);
    }

    graph.getEdges().forEach((value)=>{
        let edge_selec = value['_cfg'].id;
        if(edge_selec.startsWith('leader_to_peer')){
            graph.showItem(edge_selec);

            graph.updateItem(edge_selec,{
                type: 'chain_to_com',
            });
        }
    });

    var timer5 = setTimeout(function(){

        graph.getEdges().forEach((value)=>{
            let edge_selec = value['_cfg'].id;
            if(edge_selec.startsWith('leader_to_peer')){
                graph.hideItem(edge_selec);
            }
        });

        let j = 0;
        graph.getEdges().forEach((value)=>{
            let edge_selec = value['_cfg'].id;
            if(edge_selec.startsWith('peer_')){
                if(edge_selec.endsWith('3')){
                    graph.updateItem(edge_selec,{
                        type: 'add_Block'+j,
                    });
                    j+=1;
                }
            }
        });

        var timer6 = setTimeout(function(){
            for(let i = 0; i < comboNum; i++){
                window["block"+ i].attr({
                    opacity : 0,
                });  
            };

            graph.getNodes().forEach((value)=>{
                let node_selec = value['_cfg'].id;
                if(node_selec.endsWith('4') || node_selec.endsWith('5') || node_selec.endsWith('6')){
                    let labelNum = parseInt(value['_cfg'].model.label) + 1;
                    graph.updateItem(node_selec,{
                        label: labelNum,
                    })
                }else if(node_selec.startsWith('committer')){
                    let labelNum = parseInt(value['_cfg'].model.label) + 1;
                    graph.updateItem(node_selec,{
                        label: labelNum,
                    })
                }
            });
        }, 3500);

    }, 3500);


});

// graph.on('combo:click', (evt)=>{
//     let clickX = evt.item['_cfg'].model.x;
//     let clickY = evt.item['_cfg'].model.y;
//     console.log(evt.item['_cfg'].model.label);
//     graph.addItem('node',{
//         id: 'node123',x: clickX+80, y: clickY-50, size:[50], type: 'rect',label: 'X',
//     })
// })

debugger
//进度条
var svg = d3.select("#timeline").append("svg").attr("width",800).attr("height",180);

var states = [0,1,2,3,4];
var currentState = 0;
var colorScale = d3.scaleOrdinal().domain(states).range(['lightgrey','green','yellow', 'orange', 'red']);

svg.append('rect').attr('rx', 8).attr('ry', 8).attr('fill', 'gray').attr('height', 20).attr('width', 600).attr('x', 20).attr("y",100);

var progress = svg.append('rect').attr('height', 20).attr('width', 0).attr('rx', 8).attr('ry', 8).attr('x', 20).attr("y",100)
            .attr('fill', function(){
                return colorScale(currentState);
            });

var mouse = svg.append("text").style("text-anchor","middle").text("▲").attr("font-size","20px").attr('x', 20).attr("y",140);
var text = svg.append("text").style("text-anchor","middle").text("0").attr("font-size","20px").attr('x', 20).attr("y",160);

function moveProgressBar(state, start, end){
    progress.transition()
        .duration(3000).ease(d3.easeLinear)
        .attr('fill', function(){
            return colorScale(state);
        })
        .attr('width', function(){
            var index = states.indexOf(state);
            return (index + 1) * 120;
        });

    mouse.transition()
        .duration(3000).ease(d3.easeLinear)
        .attr('x', function(){
            var index = states.indexOf(state);
            return (index + 1) * 120 + 20;
        });

    text.transition()
        .duration(3000).ease(d3.easeLinear)
        .tween("text",function(){
            var i = d3.interpolateRound(start,end);
            return function(t){
                this.textContent = i(t) + "%";
            };
        })
        .attr('x', function(){
            var index = states.indexOf(state);
            return (index + 1) * 120 + 20;
        });
};

G6.registerEdge(
    'app_to_ca',
    {
      afterDraw(cfg, group) {
        const shape = group.get('children')[0];
        const length = shape.getTotalLength();
        const startPoint = shape.getPoint(0);

        const circle = group.addShape('image', {
            attrs: {
                x: startPoint.x,
                y: startPoint.y,
                width:20,
                height:20,
                img: 'image/用户登录.png',
            },
            name: 'circle-shape',
        });

        const text = group.addShape('text', {
            attrs: {
                text: '注册登录',
                x: startPoint.x,
                y: startPoint.y,
                fill: 'black',
                textBaseline: 'middle',
                fontWeight: 400,
            },
            name: 'text-shape1',
        });

        circle.animate(
            (ratio) => {
                const tmpPoint = shape.getPoint(ratio);
                return {
                    x: tmpPoint.x-10,
                    y: tmpPoint.y,
                };
            },
            {
                repeat: false, // Whether executes the animation repeatly
                duration: 3000, // the duration for executing once
            },
        );

        text.animate(
            (ratio) => {
                const tmpPoint = shape.getPoint(ratio);
                return {
                    x: tmpPoint.x-20,
                    y: tmpPoint.y+30,
                };
            },
            {
                repeat: false,
                duration: 3000, 
            },
        );

        shape.animate(
          (ratio) => {
            const startLen = ratio * length;
            const cfg = {
              lineDash: [startLen, length - startLen],
            };
            return cfg;
          },
          {
            repeat: false, // Whether executes the animation repeatly
            duration: 3000, // the duration for executing once
          },
        );
      },
    },
    'quadratic', 
  );

G6.registerEdge(
    'ca_to_app',
    {
        afterDraw(cfg, group) {
            const shape = group.get('children')[0];
            const length = shape.getTotalLength();
            const startPoint = shape.getPoint(0);
            const circle = group.addShape('image', {
                attrs: {
                    x: startPoint.x,
                    y: startPoint.y,
                    width:20,
                    height:20,
                    img: 'image/进入许可.png'
                },
                name: 'circle',
            });

            const text = group.addShape('text', {
                attrs: {
                    text: '许可接入网络',
                    x: startPoint.x,
                    y: startPoint.y + 40,
                    fill: 'black',
                    textBaseline: 'middle',
                    fontWeight: 400,
                },
                name: 'text-shape2',
            });

            circle.animate(
                (ratio) => {
                    const tmpPoint = shape.getPoint(ratio);
                    return {
                        x: tmpPoint.x-10,
                        y: tmpPoint.y,
                    };
                },
                {
                    repeat: false, 
                    duration: 3000,
                },
            );

            text.animate(
                (ratio) => {
                    const tmpPoint = shape.getPoint(ratio);
                    return {
                        x: tmpPoint.x - 20,
                        y: tmpPoint.y - 8,
                    };
                },
                {
                    repeat: false,
                    duration: 3000, 
                },
            );

            shape.animate(
                (ratio) => {
                const startLen = ratio * length;
                const cfg = {
                    lineDash: [startLen, length - startLen],
                };
                    return cfg;
                },
                {
                    repeat: false, // Whether executes the animation repeatly
                    duration: 3000, // the duration for executing once
                },
            );

        },
    },
    'quadratic', 
);


G6.registerEdge(
    'proposal0',
    {
        afterDraw(cfg, group) {
            const shape = group.get('children')[0];
            const length = shape.getTotalLength();
            const startPoint = shape.getPoint(0);

            const circle = group.addShape('image', {
                attrs: {
                    x: startPoint.x,
                    y: startPoint.y,
                    width:20,
                    height:20,
                    img: 'image/交易提案.png'
                },
                name: 'circle3',
            });

            const text = group.addShape('text', {
                attrs: {
                    text: '发送交易提案',
                    x: startPoint.x,
                    y: startPoint.y + 20,
                    fill: 'black',
                    textBaseline: 'middle',
                    fontWeight: 400,
                },
                name: 'text-shape3',
            });

            circle.animate(
                (ratio) => {
                    const tmpPoint = shape.getPoint(ratio);
                    return {
                        x: tmpPoint.x,
                        y: tmpPoint.y - 5,
                    };
                },
                {
                    repeat: false, 
                    duration: 2900,
                },
            );

            text.animate(
                (ratio) => {
                    const tmpPoint = shape.getPoint(ratio);
                    return {
                        x: tmpPoint.x,
                        y: tmpPoint.y + 30,
                    };
                },
                {
                    repeat: false,
                    duration: 3000, 
                },
            );

            shape.animate(
                (ratio) => {
                const startLen = ratio * length;
                const cfg = {
                    lineDash: [startLen, length - startLen],
                };
                    return cfg;
                },
                {
                    repeat: false, 
                    duration: 3000, 
                },
            );

        },
    },
    'quadratic', 
);

G6.registerEdge(
    'return',
    {
        afterDraw(cfg, group) {
            const shape = group.get('children')[0];
            const length = shape.getTotalLength();
            const startPoint = shape.getPoint(0);

            const circle = group.addShape('image', {
                attrs: {
                    x: startPoint.x,
                    y: startPoint.y,
                    width:60,
                    height:20,
                    img: 'image/组合.png'
                },
                name: 'circle4',
            });

            const text = group.addShape('text', {
                attrs: {
                    text: '签名返回',
                    x: startPoint.x,
                    y: startPoint.y,
                    fill: 'black',
                    textBaseline: 'middle',
                    fontWeight: 400,
                },
                name: 'text-shape3',
            });

            circle.animate(
                (ratio) => {
                    const tmpPoint = shape.getPoint(ratio);
                    return {
                        x: tmpPoint.x,
                        y: tmpPoint.y,
                    };
                },
                {
                    repeat: false, 
                    duration: 3000,
                },
            );

            text.animate(
                (ratio) => {
                    const tmpPoint = shape.getPoint(ratio);
                    return {
                        x: tmpPoint.x,
                        y: tmpPoint.y + 30,
                    };
                },
                {
                    repeat: false,
                    duration: 3000, 
                },
            );

            shape.animate(
                (ratio) => {
                const startLen = ratio * length;
                const cfg = {
                    lineDash: [startLen, length - startLen],
                };
                    return cfg;
                },
                {
                    repeat: false, // Whether executes the animation repeatly
                    duration: 3000, // the duration for executing once
                },
            );

        },
    },
    'quadratic', 
);

G6.registerEdge(
    'commit',
    {
        afterDraw(cfg, group) {
            const shape = group.get('children')[0];
            const length = shape.getTotalLength();
            const startPoint = shape.getPoint(0);

            const circle = group.addShape('image', {
                attrs: {
                    x: startPoint.x,
                    y: startPoint.y,
                    width:60,
                    height:20,
                    img: 'image/组合.png'
                },
                name: 'circle4',
            });

            const text = group.addShape('text', {
                attrs: {
                    text: '提交给排序节点',
                    x: startPoint.x,
                    y: startPoint.y,
                    fill: 'black',
                    textBaseline: 'middle',
                    fontWeight: 400,
                },
                name: 'text-shape3',
            });

            circle.animate(
                (ratio) => {
                    const tmpPoint = shape.getPoint(ratio);
                    return {
                        x: tmpPoint.x,
                        y: tmpPoint.y,
                    };
                },
                {
                    repeat: false, 
                    duration: 3000,
                },
            );

            text.animate(
                (ratio) => {
                    const tmpPoint = shape.getPoint(ratio);
                    return {
                        x: tmpPoint.x,
                        y: tmpPoint.y + 30,
                    };
                },
                {
                    repeat: false,
                    duration: 3000, 
                },
            );

            shape.animate(
                (ratio) => {
                const startLen = ratio * length;
                const cfg = {
                    lineDash: [startLen, length - startLen],
                };
                    return cfg;
                },
                {
                    repeat: false, // Whether executes the animation repeatly
                    duration: 3000, // the duration for executing once
                },
            );

        },
    },
    'quadratic', 
);

G6.registerEdge(
    'chain',
    {
        afterDraw(cfg, group) {
            const shape = group.get('children')[0];
            const length = shape.getTotalLength();
            const startPoint = shape.getPoint(0);

            const circle = group.addShape('image', {
                attrs: {
                    x: startPoint.x,
                    y: startPoint.y,
                    width:20,
                    height:20,
                    img: 'image/新区块.png'
                },
                name: 'circle5',
            });

            const text = group.addShape('text', {
                attrs: {
                    text: '新区块',
                    x: startPoint.x,
                    y: startPoint.y,
                    fill: 'black',
                    textBaseline: 'middle',
                    fontWeight: 400,
                },
                name: 'text-shape5',
            });

            circle.animate(
                (ratio) => {
                    const tmpPoint = shape.getPoint(ratio);
                    return {
                        x: tmpPoint.x,
                        y: tmpPoint.y,
                    };
                },
                {
                    repeat: false, 
                    duration: 3000,
                },
            );

            text.animate(
                (ratio) => {
                    const tmpPoint = shape.getPoint(ratio);
                    return {
                        x: tmpPoint.x,
                        y: tmpPoint.y + 30,
                    };
                },
                {
                    repeat: false,
                    duration: 3000, 
                },
            );

            shape.animate(
                (ratio) => {
                const startLen = ratio * length;
                const cfg = {
                    lineDash: [startLen, length - startLen],
                };
                    return cfg;
                },
                {
                    repeat: false, 
                    duration: 3000, 
                },
            );

        },
    },
    'quadratic', 
);

G6.registerEdge(
    'chain_to_com',
    {
        afterDraw(cfg, group) {
            const shape = group.get('children')[0];
            const length = shape.getTotalLength();
            const startPoint = shape.getPoint(0);

            const circle = group.addShape('image', {
                attrs: {
                    x: startPoint.x,
                    y: startPoint.y,
                    width:20,
                    height:20,
                    img: 'image/新区块.png'
                },
                name: 'circle5',
            });

            const text = group.addShape('text', {
                attrs: {
                    text: '新区块',
                    x: startPoint.x,
                    y: startPoint.y,
                    fill: 'black',
                    textBaseline: 'middle',
                    fontWeight: 400,
                },
                name: 'text-shape5',
            });

            circle.animate(
                (ratio) => {
                    const tmpPoint = shape.getPoint(ratio);
                    return {
                        x: tmpPoint.x -5,
                        y: tmpPoint.y -10,
                    };
                },
                {
                    repeat: false, 
                    duration: 3000,
                },
            );

            text.animate(
                (ratio) => {
                    const tmpPoint = shape.getPoint(ratio);
                    return {
                        x: tmpPoint.x - 5,
                        y: tmpPoint.y + 20,
                    };
                },
                {
                    repeat: false,
                    duration: 3000, 
                },
            );

            shape.animate(
                (ratio) => {
                const startLen = ratio * length;
                const cfg = {
                    lineDash: [startLen, length - startLen],
                };
                    return cfg;
                },
                {
                    repeat: false, 
                    duration: 3000, 
                },
            );

        },
    },
    'line', 
);

G6.registerEdge(
    'final',
    {
        afterDraw(cfg, group) {
            const shape = group.get('children')[0];
            const length = shape.getTotalLength();
            const startPoint = shape.getPoint(0);

            const circle = group.addShape('image', {
                attrs: {
                    x: startPoint.x,
                    y: startPoint.y,
                    width:20,
                    height:20,
                    img: 'image/交易完成.png'
                },
                name: 'circle6',
            });

            const text = group.addShape('text', {
                attrs: {
                    text: '交易完成',
                    x: startPoint.x,
                    y: startPoint.y,
                    fill: 'black',
                    textBaseline: 'middle',
                    fontWeight: 400,
                },
                name: 'text-shape6',
            });

            circle.animate(
                (ratio) => {
                    const tmpPoint = shape.getPoint(ratio);
                    return {
                        x: tmpPoint.x,
                        y: tmpPoint.y,
                    };
                },
                {
                    repeat: false, 
                    duration: 3000,
                },
            );

            text.animate(
                (ratio) => {
                    const tmpPoint = shape.getPoint(ratio);
                    return {
                        x: tmpPoint.x + 25,
                        y: tmpPoint.y + 15,
                    };
                },
                {
                    repeat: false,
                    duration: 3000, 
                },
            );

            shape.animate(
                (ratio) => {
                const startLen = ratio * length;
                const cfg = {
                    lineDash: [startLen, length - startLen],
                };
                    return cfg;
                },
                {
                    repeat: false, // Whether executes the animation repeatly
                    duration: 3000, // the duration for executing once
                },
            );

        },
    },
    'quadratic', 
);


for(let i=0; i < comboNum; i++){
    G6.registerEdge(
        'add_Block' + i,
        {
          afterDraw(cfg, group) {
            const shape = group.get('children')[0];
            const startPoint = shape.getPoint(0);
    
            window["block" + i] = group.addShape('rect', {
                attrs: {
                  x: startPoint.x,
                  y: startPoint.y,
                  fill: '#fcc885',
                  stroke: '#a1add0',
                  width: 19,
                  height: 19,
                  radius:4,
                },
                name: 'rect-shape-' + i,
              });
      
              window["block" + i].animate(
              (ratio) => {
                const tmpPoint = shape.getPoint(ratio);
                return {
                    x: tmpPoint.x - 5,
                    y: tmpPoint.y - 10,
                };
              },
              {
                repeat: false, 
                duration: 3000, 
              },
            );
    
          },
        },
        'polyline', 
      );
}

// var a0,a1;
// document.getElementById("btn2").addEventListener('click',()=>{  
//     graph.updateItem('peer1-2',{
//         type: 'test0',
//     });
//     graph.updateItem('peer1-3',{
//         type: 'test1',
//     });
//     let timer1 = setTimeout(function(){
//         window["a"+ 0].attr({
//             opacity :0,
//         });
//         window["a"+ 1].attr({
//             opacity :0,
//         });
//         graph.updateItem('node3',{
//             label: 99,
//         });   
//         graph.updateItem('node4',{
//             label: 100,
//         });
//     }, 1000);
// });

// for(let i=0;i<2;i++){
//     G6.registerEdge(
//         'test'+i,
//         {
//           afterDraw(cfg, group) {
//             const shape = group.get('children')[0];
//             const startPoint = shape.getPoint(0);
    
//             window["a"+ i] = group.addShape('rect', {
//                 attrs: {
//                   x: startPoint.x-100,
//                   y: startPoint.y,
//                   fill: '#1890ff',
//                   width: 20,
//                   height: 20,
//                 },
//                 name: 'circle-shape',
//               });

//               console.log(window["a"+ i]);
      
//               window["a"+ i].animate(
//               (ratio) => {
//                 const tmpPoint = shape.getPoint(ratio);
//                 return {
//                     x: tmpPoint.x,
//                     y: tmpPoint.y-10,
//                 };
//               },
//               {
//                 repeat: false, 
//                 duration: 1000, 
//               },
//             );
    
//           },
//         },
//         'polyline', 
//       );
// }
