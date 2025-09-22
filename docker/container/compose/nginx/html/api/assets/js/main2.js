var canvasHeight = window.screen.height; 
var canvasWidth = window.screen.width; 
const container6 = document.getElementById('container');
// var example =  document.getElementById('example');

var r, orgR, lineOffset;
var nodeSize, nodeDisX, nodeDisY, labelSize; 
var timeMaxLimit = 5000;//动画最长时间阈值
var orgNumLimit; //组织个数阈值
var commitEachNumLimit; //每个leader节点附近的普通节点的数目阈值
var totalNodes = ['node-user', 'node-order-leader', 'node-order-follower1', 'node-order-follower2'];//记录图中所有已显示的节点id
var transbody = document.getElementById('transactionListBody'); // 交易列表

if(canvasWidth > 1600 && canvasHeight > 900){  //根据屏幕分辨率，调整节点大小、半径、节点个数。所有参数均可修改。
    r = container6.offsetHeight / 3 , orgR = 62;
    lineOffset = 8,
    nodeSize = 18;
    nodeDisX = 38;
    nodeDisY = 32;
    labelSize = 10;
    orgNumLimit = 6;
    commitEachNumLimit = 5;
}else{
    r = container6.offsetHeight / 3.5, orgR = 55;
    lineOffset = 6,
    nodeSize = 15;
    nodeDisX = 30;
    nodeDisY = 32;
    labelSize = 9;
    orgNumLimit = 5;
    commitEachNumLimit = 5;
}

var divWidth = container6.offsetWidth;
var divHeight = container6.offsetHeight;

var centerOrderX = divWidth / 2.3, centerOrderY = divHeight / 2 ;  //排序节点坐标
var centerPeerConnectX = divWidth / 4, centerPeerConnectY = divHeight /2;

const initialData = { //初始的客户端和排序节点
    nodes: [
        {
            id: 'node-user',img:'assets/desk/image2/icon_khd.png',type: 'image',x: centerPeerConnectX + nodeDisX*2, y: centerOrderY+nodeSize/2, size:[nodeSize*3,nodeSize*3],
            label: 'clients', labelCfg:{position:'top',style:{fill: 'white', fontSize: labelSize}, },
            anchorPoints: [[0, 0.5],[1, 0.5],[0.5, 1],[0.5, 0],], 
        },

        {
            id: 'node-order-leader',img:'assets/desk/image2/icon_pxjd.png', type: 'image',x: centerOrderX + nodeDisX*3.5, y: centerOrderY+nodeSize/2, size: nodeSize*3,
            label: 'order', labelCfg:{position:'top',style:{fill: 'white', fontSize: labelSize}, },
            anchorPoints: [[0, 0.5],[1, 0.5],[0.5, 1],[0.5, 0],], 
        },

    ],
    edges: [],
    combos: [],
};

const graph = new G6.Graph({
    container: 'container',
    // height: parseInt(container6.offsetHeight) - 20,
    fitview: true,
    groupByTypes: false,
    modes: {
        default: ['drag-combo','collapse-expand-combo',
        {
            type: 'scroll-canvas',
            direction: 'x',
        },
        {
            type: 'tooltip',
            offset: 10,
            formatText(model) {
                return "label:" + model.label;
            },
        }
    ],},
    defaultCombo: {
        type: 'rect', style: {radius: 8,}, labelCfg: {position: 'top',},
    },
    defaultEdge: {
        style: {stroke: '#FFD098', lineWidth: 2,},
    },
});

graph.data(initialData);  //加载初始数据
graph.render();  //渲染

graph.on('combo:mouseenter', (evt) => {
    const { item } = evt;
    graph.setItemState(item, 'active', true);
});
  
graph.on('combo:mouseleave', (evt) => {
    const { item } = evt;
    graph.setItemState(item, 'active', false);
});

var pointOrder = [], pointPeer = [], pointOrg = []; //分别存放Leader节点，背书节点与普通记账节点的坐标

// 将圆n等分，获得坐标
var getPointOrder = function(r, ox, oy, count){   //以order为圆心，生成坐标
    if(count <= orgNumLimit){
        let radians = (Math.PI / 180) * Math.round(210 / count), //弧度
        i = 0;
        for(; i < count; i++){
            let x = ox + (r+50) * Math.sin(radians * i),
                y = oy + (r-20) * Math.cos(radians * i);
            pointOrder.push({x:x,y:y}); 
        }
    }else{
        let radians = (Math.PI / 180) * Math.round(210 / orgNumLimit), //弧度
        i = 0;
        for(; i < count; i++){
            let x = ox + (r+50) * Math.sin(radians * i),
                y = oy + (r-20) * Math.cos(radians * i);
            pointOrder.push({x:x,y:y}); 
        }
    }
}

var getPointPeer = function(r, ox, oy, count){   //以client为圆心，生成坐标
    if(count <= orgNumLimit){
        let radians = (Math.PI / 180) * Math.round(-230 / count), 
        i = 0;
        for(; i < count; i++){
            let x = ox + r * Math.sin(radians * i),
                y = oy + r * Math.cos(radians * i);
            pointPeer.push({x:x,y:y});
        }
    }else{
        let radians = (Math.PI / 180) * Math.round(-230 / orgNumLimit), 
        i = 0;
        for(; i < count; i++){
            let x = ox + r * Math.sin(radians * i),
                y = oy + r * Math.cos(radians * i);
            pointPeer.push({x:x,y:y});
        }
    }
}   

var getPointOrg = function(r, ox, oy, count){
    if(count <= commitEachNumLimit){
        let radians = (Math.PI / 180) * Math.round(-180 / count), 
        i = 0;
        for(; i < count; i++){
            let x = ox + r * Math.cos(radians * i),
            y = oy + r * Math.sin(radians * i) ;
            pointOrg.push({x:x,y:y});
        }
    }else{
        let radians = (Math.PI / 180) * Math.round(-180 / commitEachNumLimit), 
        i = 0;
        for(; i < count; i++){
            let x = ox + r * Math.cos(radians * i),
            y = oy + r * Math.sin(radians * i) ;
            pointOrg.push({x:x,y:y});
        }
    }
}

var x, nOrder=0, nPeer=0;
var text, color, time, Peers, Orders, Orgs, Anis;
var blocknum, endoserPeer = [], leaderPeer = [], endoserPeerLeft = [], orgNum = new Array(), sortedOrgNum = [], restrictedOrgNum = [];

var i = 0, j = 0, modes_num = 2, comboNum;
var countEndoser = 0; //记录背书节点个数

$.ajax({
    url: "assets/json/test9.json", //节点与边在同一文件中
    type: "GET",
    dataType: "json",
    async :false,
    success: function(data){
        text = data;
    }
})

Peers = text.Peers;  
Orders = text.Orders;
Orgs = text.Orgs;
Anis = text.animation;

document.getElementById('displayTest').addEventListener('click', ()=>{
    console.log('start');
    fstart('fa0f757bc278fdf6a32d00975602eb853e23a86a156781588d99ddef5b80720f');
});

document.getElementById('closeTest').addEventListener('click', ()=>{
    window.location.reload();
});

function fstart(tid){
    // var tchannel = Anis[tid][2].channel;
    // var tendorser = Anis[tid][1].endorserPeer;
    // var tclient =  Anis[tid][2].clientID;
    // blocknum = Anis[tid][2].block_num;
    // [...endoserPeerLeft] = tendorser; //复制

    // graph.updateItem('node-user',{
    //     label: tclient,
    // });

    // f1(tchannel, tendorser);
    // f2(tchannel, tendorser, endoserPeerLeft, restrictedOrgNum, nPeer, nOrder);

    // comboNum = nPeer + nOrder;

    // let animationAll = Anis[tid][3];
    // drawEdges(animationAll);
    f3(Peers, Anis[tid]);

    let animationAll = Anis[tid][3];
    drawEdges(animationAll);
}


function f1(tchannel, tendorser){
    for(let i in Peers){
        if(Peers[i].anchor == 1 && Peers[i].channelID.includes(tchannel) && !tendorser.includes(Peers[i].id)){
            nOrder += 1;
            leaderPeer.push(Peers[i].id);
        }
    }

    nOrder = nOrder > orgNumLimit ? orgNumLimit : nOrder;

    nPeer = tendorser.length;
    
    for(let j in Orgs){
        let num = 0;
        for(let i in Peers){
            if(Peers[i].org == Orgs[j] && Peers[i].anchor != 1 && Peers[i].channelID.includes(tchannel)){
                num += 1;
            }
        }
        orgNum[Orgs[j]] = num; // 将组织中节点的个数（不含背书与主节点）添加进字典 
    }

    sortedOrgNum = Object.keys(orgNum).sort((a,b)=>{  //按照组织中的节点个数，将组织排序
        return orgNum[b] - orgNum[a];
    });
    
    if(sortedOrgNum.length > orgNumLimit){ //如果超出阈值，截取
        restrictedOrgNum = sortedOrgNum.slice(0,orgNumLimit); // 
    }else{
        restrictedOrgNum = sortedOrgNum;
    }
}

function f2(tchannel, tendorser, endoserPeerLeft, restrictedOrgNum, nPeer, nOrder){
    // blocknum = parseInt(Peers[0].block_num);
    getPointOrder(r, centerOrderX, centerOrderY, nOrder); // 计算以order为圆心，Leader节点的坐标
    getPointPeer(r, centerPeerConnectX - 10, centerPeerConnectY - 10, nPeer); // 计算以connect_peer为圆心，背书节点的坐标

    let point = [];

    for(x in Peers){
        if(restrictedOrgNum.includes(Peers[x].org) && tendorser.includes(Peers[x].id)){  //创建背书节点
            color = "l(90) 0:#FFD098 1:#66C9FD";
            totalNodes.push(Peers[x].id);
            endoserPeerLeft.forEach(function(item, index, arr) {
                if(item === Peers[x].id) {
                    arr.splice(index, 1);
                }
            });

            graph.addItem('combo',{
                id: Peers[x].id , label: Peers[x].id, labelCfg: {refY: 0, style:{fontSize: labelSize, fill: '#3A386E'}},
                padding:  [nodeSize/2 + 5, 6, 6, nodeSize + 9], //上右下左
                style:{fill: color,}, anchorPoints: [[0, 0.5],[1, 0.5],[0.5, 1],[0.5, 0],],
            })

            point = pointPeer;
            var ranX = point[i].x, ranY = point[i].y;
        
            graph.addItem('node',{
                id: 'test_'+ modes_num + '_' + 1,x: ranX + nodeDisX*3, y: ranY,
                type:'rect', size:nodeSize, label: '0', labelCfg:{style:{fontSize: labelSize,}}, comboId: Peers[x].id , style:{radius: 3,fill: '#fcc885',},
            });
            graph.addItem('node',{
                id: 'test_'+ modes_num + '_' + 2,x: ranX + nodeDisX*2, y: ranY,
                type:'rect',size:nodeSize,label: '1', labelCfg:{style:{fontSize: labelSize,}}, comboId: Peers[x].id , style:{radius: 3,fill: '#fcc885',},
            });
            graph.addItem('node',{
                id: 'test_'+ modes_num + '_' + 5,x: ranX + nodeDisX*2, y: ranY + nodeDisY,
                type:'rect',size:nodeSize,label: blocknum - 2, labelCfg:{style:{fontSize: labelSize,}}, comboId: Peers[x].id , style:{radius: 3,fill: '#fcc885',},
            });
            graph.addItem('node',{
                id: 'test_'+ modes_num + '_' + 6,x: ranX + nodeDisX*3, y: ranY + nodeDisY,
                type:'rect',size:nodeSize,label: blocknum - 1, labelCfg:{style:{fontSize: labelSize,}}, comboId: Peers[x].id , style:{radius: 3,fill: '#fcc885',},
            });
    
            graph.addItem('edge',{
                id: 'peer_' + modes_num + '_' + 1,source: 'test_'+ modes_num + '_' + 1,target: 'test_'+ modes_num + '_' + 2,targetAnchor:0,type: 'line',style: {stroke: '#3A386E', lineWidth: 2,},
            });
            graph.addItem('edge',{
                id: 'peer_' + modes_num + '_' + 3,source: 'test_'+ modes_num + '_' + 2,target: 'test_'+ modes_num + '_' + 5,type: 'polyline',
                sourceAnchor: 0, targetAnchor: 0, style:{stroke: '#3A386E', lineDash: [3, 2], radius: 4, offset: lineOffset},
            });
            graph.addItem('edge',{
                id: 'peer_' + modes_num + '_' + 5,source: 'test_'+ modes_num + '_' + 5,target: 'test_'+ modes_num + '_' + 6,type: 'line',style: {stroke: '#3A386E', lineWidth: 2,},
            });
        

            if(Peers[x].anchor =='1'){
                let leaderX, leaderY, orgId, count, orgPoint, comboId;
                comboId = Peers[x].id;
                leaderX = point[j].x - nodeDisX*3;
                leaderY = point[j].y + 5;
                orgId = Peers[x].org;
                count = orgNum[orgId];

                let members = [];
    
                if(count >= 1){
                    let i = 0, commitTempNum = 1;  //commitTempNum控制每个leader节点对应的组织内的普通节点数目
                    getPointOrg(orgR, leaderX+6*nodeSize, leaderY, count); 
                    orgPoint = pointOrg;
        
                    for(x in Peers){
                        if(Peers[x].org == orgId && Peers[x].anchor != '1' && Peers[x].channelID.includes(tchannel) && commitTempNum < commitEachNumLimit && !tendorser.includes(Peers[x].id)){
                            totalNodes.push(Peers[x].id);
                            let ranX = orgPoint[i].x, ranY = orgPoint[i].y;
    
                            graph.addItem('combo',{
                                id: Peers[x].id, anchorPoints: [[1, 0.5],[0.5, 1],[0.5, 0],], padding:  [1,1,1,1], size: nodeSize + 2, style: {fill: '#FF9C27', radius: 4}
                            });
    
                            graph.addItem('node',{
                                id: 'committer_' + modes_num + '_' + 1, x: ranX + 80, y: ranY,
                                type:'rect',size:nodeSize-1, label: blocknum - 1, labelCfg:{style:{fontSize:9}}, comboId: Peers[x].id,style:{radius: 4,fill: '#fcc885',},
                            });

                            members.push(Peers[x].id);
                                           
                            i += 1;
                            modes_num += 1;
                            commitTempNum += 1;
                        }
    
                    }
                }

                graph.createHull({
                    id: 'commitNode-hull' + modes_num,
                    members: members,
                    padding: 4,
                    style: {
                        fill: '#6F7184',
                        stroke: '#FFD098',
                    },
                  });

                pointOrg = [];
            }

            i += 1;
            modes_num += 1;
            countEndoser += 1;
        }
        else if(!tendorser.includes(Peers[x].id) && Peers[x].anchor =='1' && restrictedOrgNum.includes(Peers[x].org) && Peers[x].channelID.includes(tchannel)){ //创建Leader节点,Leader节点所在的组织要在restrictedOrgNum中。
            totalNodes.push(Peers[x].id);
            point = pointOrder;

            graph.addItem('combo',{
                id: Peers[x].id , label: Peers[x].id, anchorPoints: [[0, 0.5],[1, 0.5],[0.5, 1],[0.5, 0],], style:{fill: '#8782FF'},
                padding:  [nodeSize/2 + 5, 6, 6, nodeSize + 9], //上右下左
                labelCfg: {refY: 0, style:{fontSize: labelSize, fill: '#3A386E'}},
            });
            
            graph.addItem('node',{
                id: 'test_'+ modes_num + '_' + 1,x: point[j].x + nodeDisX*3,y: point[j].y,type:'rect',size:nodeSize,label: '0', labelCfg:{style:{fontSize: labelSize,}}, comboId: Peers[x].id,
                style:{radius: 3,fill: '#fcc885',},
            });
            graph.addItem('node',{
                id: 'test_'+ modes_num + '_' + 2,x: point[j].x + nodeDisX*2,y: point[j].y,type:'rect',size:nodeSize,label: '1', labelCfg:{style:{fontSize: labelSize,}}, comboId: Peers[x].id,
                style:{radius: 3,fill: '#fcc885',},
            });
            graph.addItem('node',{
                id: 'test_'+ modes_num + '_' + 5,x: point[j].x + nodeDisX*2,y: point[j].y + nodeDisY,type:'rect',size:nodeSize,label: blocknum - 2, labelCfg:{style:{fontSize: labelSize,}}, comboId: Peers[x].id,
                style:{radius: 3,fill: '#fcc885',},
            });
            graph.addItem('node',{
                id: 'test_'+ modes_num + '_' + 6,x: point[j].x + nodeDisX*3,y: point[j].y + nodeDisY,type:'rect',size:nodeSize,label: blocknum - 1, labelCfg:{style:{fontSize: labelSize,}}, comboId: Peers[x].id,
                style:{radius: 3,fill: '#fcc885',},
            });
    
            graph.addItem('edge',{
                id: 'peer_' + modes_num + '_' + 1,source: 'test_'+ modes_num + '_' + 1,target: 'test_'+ modes_num + '_' + 2,targetAnchor:0,type: 'line',style: {stroke: '#3A386E', lineWidth: 2,},
            });
            graph.addItem('edge',{
                id: 'peer_' + modes_num + '_' + 3,source: 'test_'+ modes_num + '_' + 2,target: 'test_'+ modes_num + '_' + 5,type: 'polyline',
                sourceAnchor: 0, targetAnchor: 0, style:{stroke: '#3A386E', lineDash: [3, 2], radius: 4, offset: lineOffset},
            });
            graph.addItem('edge',{
                id: 'peer_' + modes_num + '_' + 5,source: 'test_'+ modes_num + '_' + 5,target: 'test_'+ modes_num + '_' + 6,type: 'line',style: {stroke: '#3A386E', lineWidth: 2,},
            });

            let leaderX, leaderY, orgId, count, orgPoint, comboId;
            comboId = Peers[x].id;
            leaderX = point[j].x - nodeDisX*3;
            leaderY = point[j].y + 5;
            orgId = Peers[x].org;
            count = orgNum[orgId];
            let members = [];

            if(count >= 1){
                let i = 0, commitTempNum = 1;  //commitTempNum控制每个leader节点对应的组织内的普通节点数目
                getPointOrg(orgR, leaderX+6*nodeSize, leaderY, count); 
                orgPoint = pointOrg;
    
                for(x in Peers){
                    if(Peers[x].org == orgId && Peers[x].anchor != '1' && Peers[x].channelID.includes(tchannel) && commitTempNum < commitEachNumLimit && !tendorser.includes(Peers[x].id)){
                        totalNodes.push(Peers[x].id);
                        let ranX = orgPoint[i].x, ranY = orgPoint[i].y;

                        graph.addItem('combo',{
                            id: Peers[x].id, anchorPoints: [[1, 0.5],[0.5, 1],[0.5, 0],], padding:  [1,1,1,1], size: nodeSize + 2, style: {fill: '#FF9C27', radius: 4}
                        });

                        graph.addItem('node',{
                            id: 'committer_' + modes_num + '_' + 1, x: ranX + 80, y: ranY,
                            type:'rect',size:nodeSize-1, label: blocknum - 1, labelCfg:{style:{fontSize:9}}, comboId: Peers[x].id,style:{radius: 4,fill: '#fcc885',},
                        });

                        members.push(Peers[x].id);
                                       
                        i += 1;
                        modes_num += 1;
                        commitTempNum += 1;
                    }

                }
            }
            graph.createHull({
                id: 'commitNode-hull' + modes_num,
                members: members,
                padding: 4,
                style: {
                  fill: '#6F7184',
                  stroke: '#FFD098',
                },
              });

            pointOrg = [];

            j += 1;
            modes_num += 1;

        }
    }


    // 原则是：先找节点数最多的组织的leader节点，在找该组织的普通节点与背书节点
    if(countEndoser < orgNumLimit){ //如果有些主节点对应的组织没有背书节点，导致背书节点数量小于阈值,则从剩余的背书节点中补上
        let endorserSupplyLength = orgNumLimit-countEndoser <= endoserPeerLeft.length ? orgNumLimit-countEndoser : endoserPeerLeft.length;
        for(let i=0;i< endorserSupplyLength; i++){
            totalNodes.push(endoserPeerLeft[i]);
            graph.addItem('combo',{
                id: endoserPeerLeft[i] , label: endoserPeerLeft[i], labelCfg: {refY: 0, style:{fontSize: labelSize}},
                padding:  [nodeSize/2 + 5, 6, 6, nodeSize + 9], //上右下左
                style:{fill: color,}, anchorPoints: [[0, 0.5],[1, 0.5],[0.5, 1],[0.5, 0],],
            })

            var ranX = pointPeer[countEndoser+i].x, ranY = pointPeer[countEndoser+i].y;
        
            graph.addItem('node',{
                id: 'test_'+ modes_num + '_' + 1,x: ranX + nodeDisX*3, y: ranY,
                type:'rect', size:nodeSize, label: '0', labelCfg:{style:{fontSize: labelSize,}}, comboId: endoserPeerLeft[i] , style:{radius: 3,fill: '#fcc885',},
            });
            graph.addItem('node',{
                id: 'test_'+ modes_num + '_' + 2,x: ranX + nodeDisX*2, y: ranY,
                type:'rect',size:nodeSize,label: '1', labelCfg:{style:{fontSize: labelSize,}}, comboId: endoserPeerLeft[i] , style:{radius: 3,fill: '#fcc885',},
            });
            graph.addItem('node',{
                id: 'test_'+ modes_num + '_' + 5,x: ranX + nodeDisX*2, y: ranY + nodeDisY,
                type:'rect',size:nodeSize,label: blocknum - 2, labelCfg:{style:{fontSize: labelSize,}}, comboId: endoserPeerLeft[i] ,style:{radius: 3,fill: '#fcc885',},
            });
            graph.addItem('node',{
                id: 'test_'+ modes_num + '_' + 6,x: ranX + nodeDisX*3, y: ranY + nodeDisY,
                type:'rect',size:nodeSize,label: blocknum - 1, labelCfg:{style:{fontSize: labelSize,}}, comboId: endoserPeerLeft[i] ,style:{radius: 3,fill: '#fcc885',},
            });
    
            graph.addItem('edge',{
                id: 'peer_' + modes_num + '_' + 1,source: 'test_'+ modes_num + '_' + 1,target: 'test_'+ modes_num + '_' + 2,targetAnchor:0,type: 'line',style: {stroke: '#3A386E', lineWidth: 2,},
            });
            graph.addItem('edge',{
                id: 'peer_' + modes_num + '_' + 3,source: 'test_'+ modes_num + '_' + 2,target: 'test_'+ modes_num + '_' + 5,type: 'polyline',
                sourceAnchor: 0, targetAnchor: 0, style:{stroke: '#3A386E', lineDash: [3, 2], radius: 4, offset: lineOffset},
            });
            graph.addItem('edge',{
                id: 'peer_' + modes_num + '_' + 5,source: 'test_'+ modes_num + '_' + 5,target: 'test_'+ modes_num + '_' + 6,type: 'line',style: {stroke: '#3A386E', lineWidth: 2,},
            });
        
            modes_num += 1;
        }
    }
}

var actualAnchorPeer = [];
var endorserPeer = [];
function f3(peer, animation){
    endorserPeer = animation[1].endorserPeer;
    var tclient = animation[2].clientID;
    var peerChannel = animation[2].channel;
    blocknum = animation[2].block_num;
    var anchorPeer = [];

    graph.updateItem('node-user',{
        label: tclient,
    });

    for(let j in Orgs){
        let num = 0;
        for(let i in peer){
            if(peer[i].org == Orgs[j] && peer[i].anchor != 1 && peer[i].channelID.includes(peerChannel)){
                num += 1;
            }
        }
        orgNum[Orgs[j]] = num; // 将组织中节点的个数（不含背书与主节点）添加进字典 
    }

    animation[3].chain.forEach(e => {
        actualAnchorPeer.push(e.target);
        if(!endorserPeer.includes(e.target)){
            anchorPeer.push(e.target);
        }
    });

    var endorserLength = endorserPeer.length > orgNumLimit ? orgNumLimit : endorserPeer.length;
    var anchorLength = anchorPeer.length > orgNumLimit ? orgNumLimit : anchorPeer.length;
    let point = [];

    getPointOrder(r, centerOrderX, centerOrderY, anchorLength); // 计算以order为圆心，锚节点的坐标
    getPointPeer(r, centerPeerConnectX - 10, centerPeerConnectY - 10, endorserLength); // 计算以connect_peer为圆心，背书节点的坐标

    for(let i in endorserPeer){
       if(i < endorserLength){
            totalNodes.push(endorserPeer[i]);
            color = "l(90) 0:#FFD098 1:#66C9FD";
            graph.addItem('combo',{
                id: endorserPeer[i] , label: endorserPeer[i], labelCfg: {refY: 0, style:{fontSize: labelSize, fill: '#3A386E'}},
                padding:  [nodeSize/2 + 5, 6, 6, nodeSize + 9], //上右下左
                style:{fill: color,}, anchorPoints: [[0, 0.5],[1, 0.5],[0.5, 1],[0.5, 0],],
            })

            point = pointPeer;
            var ranX = point[i].x, ranY = point[i].y;
        
            graph.addItem('node',{
                id: 'endorser_'+ modes_num + '_' + 1,x: ranX + nodeDisX*3, y: ranY,
                type:'rect', size:nodeSize, label: '0', labelCfg:{style:{fontSize: labelSize,}}, comboId: endorserPeer[i] , style:{radius: 3,fill: '#fcc885',},
            });
            graph.addItem('node',{
                id: 'endorser_'+ modes_num + '_' + 2,x: ranX + nodeDisX*2, y: ranY,
                type:'rect',size:nodeSize,label: '1', labelCfg:{style:{fontSize: labelSize,}}, comboId: endorserPeer[i] , style:{radius: 3,fill: '#fcc885',},
            });
            graph.addItem('node',{
                id: 'endorser_'+ modes_num + '_' + 5,x: ranX + nodeDisX*2, y: ranY + nodeDisY,
                type:'rect',size:nodeSize,label: blocknum - 2, labelCfg:{style:{fontSize: labelSize,}}, comboId: endorserPeer[i] , style:{radius: 3,fill: '#fcc885',},
            });
            graph.addItem('node',{
                id: 'endorser_'+ modes_num + '_' + 6,x: ranX + nodeDisX*3, y: ranY + nodeDisY,
                type:'rect',size:nodeSize,label: blocknum - 1, labelCfg:{style:{fontSize: labelSize,}}, comboId: endorserPeer[i] , style:{radius: 3,fill: '#fcc885',},
            });

            graph.addItem('edge',{
                id: 'endorser_peer_' + modes_num + '_' + 1,source: 'endorser_'+ modes_num + '_' + 1,target: 'endorser_'+ modes_num + '_' + 2,targetAnchor:0,type: 'line',style: {stroke: '#3A386E', lineWidth: 2,},
            });
            graph.addItem('edge',{
                id: 'endorser_peer_' + modes_num + '_' + 3,source: 'endorser_'+ modes_num + '_' + 2,target: 'endorser_'+ modes_num + '_' + 5,type: 'polyline',
                sourceAnchor: 0, targetAnchor: 0, style:{stroke: '#3A386E', lineDash: [3, 2], radius: 4, offset: lineOffset},
            });
            graph.addItem('edge',{
                id: 'endorser_peer_' + modes_num + '_' + 5,source: 'endorser_'+ modes_num + '_' + 5,target: 'endorser_'+ modes_num + '_' + 6,type: 'line',style: {stroke: '#3A386E', lineWidth: 2,},
            });

            modes_num += 1;

            if(actualAnchorPeer.includes(endorserPeer[i])){
                let leaderX, leaderY, orgId, count, orgPoint;
                let comboId = endorserPeer[i];
                leaderX = point[i].x - nodeDisX*3;
                leaderY = point[i].y + 5;
                for(let z in peer){
                    if(peer[z].id == comboId){
                        orgId = peer[z].org;
                    }
                }
                count = orgNum[orgId];
                console.log(comboId, count);
                let members = [];
    
                if(count >= 1){
                    let i = 0, commitTempNum = 1;  //commitTempNum控制每个leader节点对应的组织内的普通节点数目
                    getPointOrg(orgR, leaderX+6*nodeSize, leaderY, count); 
                    orgPoint = pointOrg;
        
                    for(x in peer){
                        if(peer[x].org == orgId && peer[x].anchor != '1' && peer[x].channelID == peerChannel && commitTempNum < commitEachNumLimit && !endorserPeer.includes(peer[x].id)){
                            totalNodes.push(peer[x].id);
                            let ranX = orgPoint[i].x, ranY = orgPoint[i].y;
    
                            graph.addItem('combo',{
                                id: peer[x].id, anchorPoints: [[1, 0.5],[0.5, 1],[0.5, 0],], padding:  [1,1,1,1], size: nodeSize + 2, style: {fill: '#FF9C27', radius: 4}
                            });
    
                            graph.addItem('node',{
                                id: 'committer_' + modes_num + '_' + 1, x: ranX + 80, y: ranY,
                                type:'rect',size:nodeSize-3, label: blocknum - 1, labelCfg:{style:{fontSize:9}}, comboId: peer[x].id,style:{radius: 4,fill: '#fcc885',},
                            });
    
                            members.push(peer[x].id);
                                           
                            i += 1;
                            modes_num += 1;
                            commitTempNum += 1;
                        }
    
                    }
                }
                graph.createHull({
                    id: 'commitNode-hull' + modes_num,
                    members: members,
                    padding: 4,
                    style: {
                      fill: '#6F7184',
                      stroke: '#FFD098',
                    },
                });
    
                pointOrg = [];
            }
       }
    }

    for(let j in anchorPeer){
        if(j < anchorLength && !endorserPeer.includes(anchorPeer[j])){
            totalNodes.push(anchorPeer[j]);
            point = pointOrder;

            graph.addItem('combo',{
                id: anchorPeer[j], label: anchorPeer[j], anchorPoints: [[0, 0.5],[1, 0.5],[0.5, 1],[0.5, 0],], style:{fill: '#8782FF'},
                padding:  [nodeSize/2 + 5, 6, 6, nodeSize + 9], //上右下左
                labelCfg: {refY: 0, style:{fontSize: labelSize, fill: '#3A386E'}},
            });
            
            graph.addItem('node',{
                id: 'test_'+ modes_num + '_' + 1,x: point[j].x + nodeDisX*3,y: point[j].y,type:'rect',size:nodeSize,label: '0', labelCfg:{style:{fontSize: labelSize,}}, comboId: anchorPeer[j],
                style:{radius: 3,fill: '#fcc885',},
            });
            graph.addItem('node',{
                id: 'test_'+ modes_num + '_' + 2,x: point[j].x + nodeDisX*2,y: point[j].y,type:'rect',size:nodeSize,label: '1', labelCfg:{style:{fontSize: labelSize,}}, comboId: anchorPeer[j],
                style:{radius: 3,fill: '#fcc885',},
            });
            graph.addItem('node',{
                id: 'test_'+ modes_num + '_' + 5,x: point[j].x + nodeDisX*2,y: point[j].y + nodeDisY,type:'rect',size:nodeSize,label: blocknum - 2, labelCfg:{style:{fontSize: labelSize,}}, comboId: anchorPeer[j],
                style:{radius: 3,fill: '#fcc885',},
            });
            graph.addItem('node',{
                id: 'test_'+ modes_num + '_' + 6,x: point[j].x + nodeDisX*3,y: point[j].y + nodeDisY,type:'rect',size:nodeSize,label: blocknum - 1, labelCfg:{style:{fontSize: labelSize,}}, comboId: anchorPeer[j],
                style:{radius: 3,fill: '#fcc885',},
            });
    
            graph.addItem('edge',{
                id: 'peer_' + modes_num + '_' + 1,source: 'test_'+ modes_num + '_' + 1,target: 'test_'+ modes_num + '_' + 2,targetAnchor:0,type: 'line',style: {stroke: '#3A386E', lineWidth: 2,},
            });
            graph.addItem('edge',{
                id: 'peer_' + modes_num + '_' + 3,source: 'test_'+ modes_num + '_' + 2,target: 'test_'+ modes_num + '_' + 5,type: 'polyline',
                sourceAnchor: 0, targetAnchor: 0, style:{stroke: '#3A386E', lineDash: [3, 2], radius: 4, offset: lineOffset},
            });
            graph.addItem('edge',{
                id: 'peer_' + modes_num + '_' + 5,source: 'test_'+ modes_num + '_' + 5,target: 'test_'+ modes_num + '_' + 6,type: 'line',style: {stroke: '#3A386E', lineWidth: 2,},
            });

            modes_num += 1;

            let leaderX, leaderY, orgId, count, orgPoint;
            let comboId = anchorPeer[j];
            leaderX = point[j].x - nodeDisX*3;
            leaderY = point[j].y + 5;
            for(let z in peer){
                if(peer[z].id == comboId){
                    orgId = peer[z].org;
                }
            }
            count = orgNum[orgId];
            let members = [];

            if(count >= 1){
                let i = 0, commitTempNum = 1;  //commitTempNum控制每个leader节点对应的组织内的普通节点数目
                getPointOrg(orgR, leaderX+6*nodeSize, leaderY, count); 
                orgPoint = pointOrg;
    
                for(x in peer){
                    if(peer[x].org == orgId && peer[x].anchor != '1' && peer[x].channelID == peerChannel && commitTempNum < commitEachNumLimit && !endorserPeer.includes(peer[x].id)){
                        totalNodes.push(peer[x].id);
                        let ranX = orgPoint[i].x, ranY = orgPoint[i].y;

                        graph.addItem('combo',{
                            id: peer[x].id, anchorPoints: [[1, 0.5],[0.5, 1],[0.5, 0],], padding:  [1,1,1,1], size: nodeSize + 2, style: {fill: '#FF9C27', radius: 4}
                        });

                        graph.addItem('node',{
                            id: 'committer_' + modes_num + '_' + 1, x: ranX + 80, y: ranY,
                            type:'rect',size:nodeSize-3, label: blocknum - 1, labelCfg:{style:{fontSize:9}}, comboId: peer[x].id,style:{radius: 4,fill: '#fcc885',},
                        });

                        members.push(peer[x].id);
                                       
                        i += 1;
                        modes_num += 1;
                        commitTempNum += 1;
                    }

                }
            }
            graph.createHull({
                id: 'commitNode-hull' + modes_num,
                members: members,
                padding: 4,
                style: {
                  fill: '#6F7184',
                  stroke: '#FFD098',
                },
            });

            pointOrg = [];
        }
    }
}

/////////////////////
/////////////////////
/////////////////////

var obj = new Object();
var id, source, target, type, animateTime;
var edgeAnimation = 0;

function createEdge(){
    obj.id = id;
    obj.source = source;
    obj.target = target;
    obj.type = type;
    time = animateTime;

    if(type == 'chain'){ //数据上链发生后，区块数+1
        graph.addItem('edge',obj);

        // if(leaderPeer.includes(target) || endoserPeer.includes(target)){ //如果是背书节点或排序节点，更新后两个区块的值
        if(actualAnchorPeer.includes(target) || endorserPeer.includes(target)){
            let chainAnimationTarget = target;
            setTimeout(function(){
                let item1 = graph.findById(chainAnimationTarget)['_cfg'].nodes[2];
                let labelNum1 = graph.findById(chainAnimationTarget)['_cfg'].nodes[2]['_cfg'].model.label + 1;
                graph.updateItem(item1,{
                    label: labelNum1,
                });

                let item2 = graph.findById(chainAnimationTarget)['_cfg'].nodes[3];
                let labelNum2 = graph.findById(chainAnimationTarget)['_cfg'].nodes[3]['_cfg'].model.label + 1;
                graph.updateItem(item2,{
                    label: labelNum2,
                });
                let edgeItem = item1._cfg.edges[0];
                graph.updateItem(edgeItem,{ //边上新增增加区块的动画
                    type: 'add_Block'+edgeAnimation,
                });
                edgeAnimation += 1;
            }, animateTime);

        }else{ //如果是普通节点，更新一个区块的值即可
            let item = graph.findById(target)['_cfg'].nodes[0];
            let labelNum = graph.findById(target)['_cfg'].nodes[0]['_cfg'].model.label + 1;
            graph.updateItem(item,{
                label: labelNum,
            });
        }
        
    }else{
        graph.addItem('edge',obj);
    }
    
}

// 每条边的动画结束后，会自动清除
function deleteEdge(){
    let item = graph.findById(id); //找到这条边
    return  setTimeout(function(){ //使用延时器计时，等动画时间结束，清除
        // item.destroy();
        graph.removeItem(item);
    }, time)
   
}

//--------------------------------------------------------------------------------------------------
// ajax读取每个阶段边的数据
//--------------------------------------------------------------------------------------------------

var totalStage = new Array();  //分别记录每一步的最长时间
var timeStage = new Array();  //每一步的最长时间依次叠加
var countNum = 0;
var timeDealayArray = [0]; // 第一步不需要延时，故第一个数为0
var stageNum = 0; 
var timeDelay;
var eachStageEdge;

// drawEdge()
function drawEdges(animationAll){
    for(let i in animationAll){
        let timeArray = []
        for(let j in animationAll[i]){
            timeArray.push(parseInt(animationAll[i][j].time));  //记录每一步骤的全部时间
        }
        let maxTime = Math.max.apply(Math, timeArray); //取每一步时间最长的值
        totalStage[i] = maxTime;
    }

    // console.log(totalStage); // begin: 4000, middle: 4000, end: 3500

    for(let i in totalStage){
        countNum += totalStage[i]; //第一步最长时间为4000ms，第二步时间最长为3000ms，则第三步就需要延迟4000+3000ms后开始
        timeStage[i] = countNum + 500; //多加一点间隔
    }

    // console.log(timeStage); // [begin: 4000, middle: 8000, end: 11500]

    for(let i in animationAll){
        timeDelay = timeDealayArray[stageNum]; //第一步的时间延迟为0，第二步时间延迟至第一步的最长时间（等前一阶段全部结束，下一阶段再开始）
        timeDealayArray.push(timeStage[i]); // 将后续延迟时间压入数组
        eachStageEdge = animationAll[i]; 

        setTimeout(createEdgeByStage(eachStageEdge, stageNum, totalStage[i]), timeDelay);

        stageNum += 1;
    } 
    
}

// 按步骤创建边
function createEdgeByStage(eachStageEdge, stageNum, totalStage){
    return function() {
        let edgeRemoveList = [];

        for(let j in eachStageEdge){
            id = eachStageEdge[j].source + '-to-' + eachStageEdge[j].target + '-' + stageNum;
            source = eachStageEdge[j].source;
            target = eachStageEdge[j].target;
            type = eachStageEdge[j].type;
            animateTime = eachStageEdge[j].time;

            if(totalNodes.includes(source) && totalNodes.includes(target)){  //如果边的起始点与终点都在图中显示，则可以建立这条边。如果有任意点被隐藏，则边也隐藏。
                edgeRemoveList.push(id);
                createEdge(id, source, target, type, animateTime);
            }
            // let deleteTime = animateTime + 500;
            // deleteEdge(id, deleteTime);
        }
        setTimeout(removeEdgeByStage(edgeRemoveList), totalStage);

    }
}

//每个步骤结束后，统一去除该步骤所有的边
function removeEdgeByStage(edgeRemoveList){
    return function(){
        for(let i in edgeRemoveList){
            let item = graph.findById(edgeRemoveList[i]);
            graph.removeItem(item);
        }
    }
}

////////////////////////////////
///////////////////////////////
////////////////////////////////
//////////////////////////////
///////////////////////////////


G6.registerEdge(
    'proposal',
    {
        afterDraw(cfg, group) {
            const shape = group.get('children')[0];
            const length = shape.getTotalLength();
            const startPoint = shape.getPoint(0);

            const circle = group.addShape('image', {
                attrs: {
                    x: startPoint.x,
                    y: startPoint.y,
                    width: nodeSize,
                    height: nodeSize,
                    img: 'assets/desk/image2/legend_icon_jyta.png'
                },
                name: 'circle3',
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
                    duration: time < timeMaxLimit ? time : timeMaxLimit,
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
                    duration: time < timeMaxLimit ? time : timeMaxLimit, 
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
                    width: nodeSize * 3,
                    height: nodeSize,
                    img: 'assets/desk/image2/group.png'
                },
                name: 'circle4',
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
                    duration: time < timeMaxLimit ? time : timeMaxLimit,
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
                    duration: time < timeMaxLimit ? time : timeMaxLimit, 
                },
            );

        },
    },
    'quadratic', 
);

G6.registerEdge(
    'submit',
    {
        afterDraw(cfg, group) {
            const shape = group.get('children')[0];
            const length = shape.getTotalLength();
            const startPoint = shape.getPoint(0);

            const circle = group.addShape('image', {
                attrs: {
                    x: startPoint.x,
                    y: startPoint.y,
                    width: nodeSize*3,
                    height: nodeSize,
                    img: 'assets/desk/image2/group.png'
                },
                name: 'circle4',
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
                    duration: time < timeMaxLimit ? time : timeMaxLimit, // the duration for executing once
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
                    width: nodeSize,
                    height: nodeSize,
                    img: 'assets/desk/image2/legend_icon_xqk.png'
                },
                name: 'circle5',
            });

            circle.animate(
                (ratio) => {
                    const tmpPoint = shape.getPoint(ratio);
                    return {
                        x: tmpPoint.x - 5,
                        y: tmpPoint.y - 2,
                    };
                },
                {
                    repeat: false, 
                    duration: time < timeMaxLimit ? time : timeMaxLimit,
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
                    duration: time < timeMaxLimit ? time : timeMaxLimit, 
                },
            );

        },
    },
    'quadratic', 
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
                    width: nodeSize,
                    height: nodeSize,
                    img: 'assets/desk/image2/complete.png'
                },
                name: 'circle6',
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
                    duration: time < timeMaxLimit ? time : timeMaxLimit,
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
                    duration: time < timeMaxLimit ? time : timeMaxLimit, // the duration for executing once
                },
            );

        },
    },
    'quadratic', 
);

for(let i=0; i < 20; i++){
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
                  width: nodeSize,
                  height: nodeSize,
                  radius: 3,
                },
                name: 'rect-shape-' + i,
              });
      
              window["block" + i].animate(
              (ratio) => {
                const tmpPoint = shape.getPoint(ratio);
                return {
                    x: tmpPoint.x,
                    y: tmpPoint.y-nodeSize/2,
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
