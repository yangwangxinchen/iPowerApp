MakerJS.hallDistribution=function(){

var sceneMeshs=[]
var engine

var glass_material=new THREE.MeshBasicMaterial({
    color: "#778899",
    depthTest: true,
    opacity: 0.3,
    transparent: true,
});

var select_material=new THREE.MeshBasicMaterial({
    color: 0x87cefa,
    depthTest: true,
    opacity: 0.3,
    transparent: true,
});

var monitoring_material = new THREE.MeshBasicMaterial({
    color: "#00ff00",
    opacity: 0.3,
    transparent: true,
    side: THREE.DoubleSide
});


var greenLight_material= new THREE.MeshLambertMaterial({color:0x00ff00, emissive:0x00ff00 });

var redLight_material= new THREE.MeshLambertMaterial({color:0xff0000,emissive:0xff0000});

this.initSceneMeshs=function(_engine,_meshsName){
    engine=_engine

    for(var i in _meshsName){

        let obj= engine.scene.getObjectByName(_meshsName[i])
        sceneMeshs.push(obj)
    }

init()

}


//init
function init(){
    getMesh()
    setGlassMaterial();
    setMonitorMaterial()
    setMonitorVisibel(false)
    setLampBloom()
    initCSS3DRenderer()
    setWallUnreal()
    setCircleMaterial()
    getMqtt()
    engine.nodeSelection.addEventListener('choose',eveChoose)
    // engine.nodeSelection.addEventListener('chooseMore',eveChooseMore)
    
    engine.addEventListener('update',eveUpdate)
}


function getMesh(){

    for(var i in sceneMeshs){
        //隐藏掉灯
        if(sceneMeshs[i].name.indexOf('yd_dguan')!=-1){
            sceneMeshs[i].visible=false
        }
        if(sceneMeshs[i].name.indexOf('yuandeng')!=-1){
         sceneMeshs[i].visible=false
        }
    }

    monitorCone=engine.scene.getObjectByName('shizhui')


}

//设置非监测设备虚化
function setWallUnreal(){
var wall=engine.scene.getObjectByName('waiqiang01')
engine.effects.unrealObject(wall)

}

function setGlassMaterial(){
    var glass=engine.scene.getObjectByName('boli')
    glass.material=glass_material
    glass.visible=false

}

//视锥
var monitorCone
function setMonitorMaterial(){
    
    monitorCone.material=monitoring_material
    engine.effects.addEdgesObject(monitorCone)

}

function setMonitorVisibel(state){
    monitorCone.visible=state
    if(state){
        // engine.animateCamera(engine.camera.position,engine.controls.target,{x:78,y:270,z:100},{x:78,y:0,z:100})
    }
  
}

var texture_circle=new THREE.TextureLoader().load('../textures/huilu2.png')
var circle_material=new THREE.MeshPhongMaterial({color:0xffffff,map:texture_circle})
function setCircleMaterial(){

    var gui2_huilus=['gui2_huilu03','gui2_huilu02','gui2_huilu01']
    gui2_huilus.forEach(e => {
       var huilu=engine.scene.getObjectByName(e)
       huilu.material=circle_material
    });
}

var greenLights=[]
var redLights=[]
var greenLight_defaultMaterial
var redLight_defaultMaterial

//记录灯的默认材质
function getLightMaterial(){
    var greenLight=engine.scene.getObjectByName('gui3_huilu01_ld')
    greenLight_defaultMaterial=greenLight.material

    var redLight=engine.scene.getObjectByName('gui3_huilu01_hd')
    redLight_defaultMaterial=redLight.material

}
//设置灯的辉光  
function setLampBloom(){

    getLightMaterial()

    for(var i in sceneMeshs){
       
       if(sceneMeshs[i].name.indexOf('ld')!=-1||sceneMeshs[i].name.indexOf('lvd')!=-1){
        greenLights.push(sceneMeshs[i])
        // sceneMeshs[i].material= greenLight_material
       }

       if(sceneMeshs[i].name.indexOf('hd')!=-1||sceneMeshs[i].name.indexOf('hongd')!=-1){
        redLights.push(sceneMeshs[i])
        // sceneMeshs[i].material= redLight_material
       }

    }
    engine.blooms.setEnable(true)
    
    //红绿灯
    // engine.blooms.addBloomObjects(greenLights)
    // engine.blooms.addBloomObjects(redLights)
    for(var i=0;i<greenLights.length;i++){
        openAndCloseState(true,i)
    }
    
    //无数据  默认合闸
    openAndCloseState(false,1)
    openAndCloseState(false,15)
}

//分闸 合闸区分 红色合闸（开）   绿色分闸（关） open close
function  openAndCloseState(open,circleNum){
 if(open){
    greenLights[circleNum].material=greenLight_material
    redLights[circleNum].material=redLight_defaultMaterial

    engine.blooms.addBloomObjects(greenLights[circleNum])
    engine.blooms.removeBloomObjects(redLights[circleNum])
 }else{
    greenLights[circleNum].material=greenLight_defaultMaterial
    redLights[circleNum].material=redLight_material

    engine.blooms.addBloomObjects(redLights[circleNum])
    engine.blooms.removeBloomObjects(greenLights[circleNum])
 }
}


var css3DRenderer
    //创建css3DRenderer 用来渲染css object
    function initCSS3DRenderer(){
     css3DRenderer = new THREE.CSS3DRenderer()
     css3DRenderer.setSize( engine.width,engine.height )
     css3DRenderer.domElement.style.position = 'absolute'
     css3DRenderer.domElement.style.top = 0
     css3DRenderer.domElement.style.pointerEvents = "none"
     document.body.appendChild(css3DRenderer.domElement );
     
    //  setCSS()
    }
    
    function createCSS3DObject(div){
        var label3d = new THREE.CSS3DObject(div)
        label3d.scale.set(0.3,0.3,0.3)
        label3d.rotation.set(Math.PI/2,0,0)
        label3d.position.set(-222,10,300)
        // engine.scene.add(label3d)
        return  label3d
    }

    // 馈线guiD3 11条回路
    // 馈线guiD2  5条回路
    // 进线guiD1   

    const D3CIRCLES=[
        '电动窗帘一、二正转',
        '电动窗帘一、二反转',
        '电动窗帘三、四正转',
        '电动窗帘三、四反转',
        '展厅空调',
        '备用',
        '备用',
        '备用',
        '备用',
        '展厅大屏',
        '备用',
        '框架出线1',
        '框架出线2',
        '展厅照明1',
        '展厅照明2',
        '展厅照明4'
    ]

    const D2CIRCLES=[
        '框架出线1',
        '框架出线2',
        '展厅照明1',
        '展厅照明2',
        '展厅照明4'
    ]

   
    var A_VOL=232.9,
        A_ELE=0.613,
        UAB_VOL=406,
        TEMP=31.5
    var circleName ='展厅1回路'   
    var device01,device02
    var circle_css  //回路样式
    //设置css样式
    function setCSS(){
        device01=document.getElementById('device01')
        device01.innerText=circleName+"\nA相电压:"+A_VOL+"V"+"\nA相电流:"+A_ELE+"A"+"\nUAB线电压:"+UAB_VOL+"V"+"\n温度:"+TEMP+"℃"

        circle_css=createCSS3DObject(device01)
        circle_css.name='circle_css'
    }

    function setNameLable(){
        // device02=document.getElementById('device02')
        // device02.innerText=D3CIRCLES[0]

        // var group_D3=new THREE.Group();

        // for(var i=0;i<11;i++){
           
        //     var circleNode=document.createElement('circle'+i)
        //     circleNode.innerText=D3CIRCLES[i]
        //     var label= createCSS3DObject(circleNode)
        //     label.position.set(-184,12,305-i*28)
    
        //     group_D3.add(label)
        //     // engine.scene.add(label)
        // }
        // engine.scene.add(group_D3)

        // var nameLabel= createCSS3DObject(device02)
        // nameLabel.scale.set(0.2,0.2,0.2)
        // nameLabel.position.set(-184,12,305)
        // // engine.scene.add(nameLabel)
    }
     
    //改变样式内容及位置
    function changeCSS(name,x,y,z){
        if(!engine.scene.getObjectByName('circle_css')){
             engine.scene.add(circle_css)
         }
         circleName=name
         circle_css.position.set(x,y,z)
    }


//update
function eveUpdate(){
    if(css3DRenderer){
        // css3DRenderer.render(engine.scene, engine.camera );
        // device01.innerText=circleName+"\nA相电压:"+A_VOL+"V"+"\nA相电流:"+A_ELE+"A"+"\nUAB线电压:"+UAB_VOL+"V"+"\n温度:"+TEMP+"℃"
    }
   
}


//choose
function eveChoose(e){
    var nameNode
    if(e.content instanceof THREE.Mesh) nameNode=e.content.name
     
    // setColor(e.content)

    // if(nameNode=="gui1"){
    //     engine.animateCamera(engine.camera.position,engine.controls.target,{x:150,y:-330,z:200},{x:150,y:0,z:200})
    // }else if(nameNode=='gui2'){
    //     engine.animateCamera(engine.camera.position,engine.controls.target,{x:0,y:-330,z:200},{x:0,y:0,z:200})
    // }else if(nameNode=='gui3'){
    //     engine.animateCamera(engine.camera.position,engine.controls.target,{x:-150,y:-330,z:200},{x:-150,y:0,z:200})
    // }else if(nameNode=='gui3_huilu01'){
    //     changeCSS('展厅1回路',-222,10,300)
    // }else if(nameNode=='gui3_huilu02'){
    //     changeCSS('展厅2回路',-222,10,270)
    // }else if(nameNode=='gui3_huilu03'){
    //     changeCSS('展厅3回路',-222,10,240)
    // }else if(nameNode=='gui3_huilu04'){
    //     changeCSS('展厅4回路',-222,10,220)
    // }else if(nameNode=='gui3_huilu05'){
    //     changeCSS('展厅5回路',-222,10,190)
    // }else if(nameNode=='gui3_huilu06'){
    //     changeCSS('展厅6回路',-222,10,160)
    // }else if(nameNode=='gui3_huilu07'){
    //     changeCSS('展厅7回路',-222,10,140)
    // }else if(nameNode=='gui3_huilu08'){
    //     changeCSS('展厅8回路',-222,10,110)
    // }else if(nameNode=='gui3_huilu09'){
    //     changeCSS('展厅9回路',-222,10,90)
    // }else if(nameNode=='gui3_huilu10'){
    //     changeCSS('备用',-222,10,60)
    // }else if(nameNode=='gui3_huilu11'){
    //     changeCSS('备用',-222,10,30)
    // }else if(nameNode=='gui2_huilu01'){
    //     changeCSS('展厅10回路',140,10,90)
    // }else if(nameNode=='gui2_huilu02'){
    //     changeCSS('展厅11回路',140,10,60)
    // }else if(nameNode=='gui2_huilu03'){
    //     changeCSS('展厅12回路',140,10,30)
    // }else if(nameNode=='gui2_duanlq'){
    //     changeCSS('展厅电源1',140,10,270)
    // }else if(nameNode=='gui2_duanlqge'){
    //     changeCSS('展厅电源2',140,10,170)
    // }

}

var solids=[]
function setColor(_mesh){
    if(solids.length>0){
        for(var i in solids){
            solids[i].geometry.dispose();
            solids[i].parent.children.pop();
        }
    }
    solids=[];
    var solid = new THREE.Mesh(_mesh.geometry,select_material);
    _mesh.add(solid);
     solids.push(solid);
}

//电流走向按钮
 const path_btn=document.getElementById('path')
 path_btn.onclick=()=> {
       console.log('电流走向')
    }

window.changhua={
    parseData:function(data){  
        //改变模型颜色
        var model= engine.scene.getObjectByName(data) 
        setColor(model)
        switch(data){
            case 'gui1':
                engine.animateCamera(engine.camera.position,engine.controls.target,{x:150,y:-330,z:200},{x:150,y:0,z:200})
                //外框线
                // pushValue(outlineObjects,airSwitchs[0])
                // engine.effects.setOutlineObjects(outlineObjects)
            break;
            case 'gui2':
                engine.animateCamera(engine.camera.position,engine.controls.target,{x:0,y:-330,z:200},{x:0,y:0,z:200})
                break;
            case 'gui3':
                engine.animateCamera(engine.camera.position,engine.controls.target,{x:-150,y:-330,z:200},{x:-150,y:0,z:200})
                break;
            default:
                break;
        } 
}

}

var devices=[
    'gui1',
    'gui2',
    'gui3',
    'gui3_huilu01',
    'gui3_huilu02',
    'gui3_huilu03',
    'gui3_huilu04',
    'gui3_huilu05',
    'gui3_huilu06',
    'gui3_huilu07',
    'gui3_huilu08',
    'gui3_huilu09',
    'gui3_huilu10',
    'gui3_huilu11',
    'gui2_huilu01',
    'gui2_huilu02',
    'gui2_huilu03',
    'gui2_duanlq',
    'gui2_duanlqge',
]

document.addEventListener('keydown',myKeyDown)
function myKeyDown(id) {
    switch(id.key) {
        case '1':
           
            break;
        case '2':
           
            break;
        case '3':
           
            break; 
            case '4':
            
            break;        
        default:
            break;
}}

var index=0
 //关联数据
 function getMqtt(){
        
    var client=engine.getMqtt()
    
    client.on('message',function (topic, message) {
        index++;   //62
       const deviceName=topic.substring(13)
    //    console.log(index+':'+deviceName+':'+message.toString())
       //message.toString().match(/\"SwitchOn\": \d/)   是个数组
       //message.toString().match(/\"SwitchOn\": \d/)[0]   "SwitchOn": 0
    //    let circleState=(message.toString().match(/\"SwitchOn\": \d/)[0])
       let value=message.toString().match(/\d/)[0]    //0  1
       let open=true;   //默认分闸
       switch(deviceName){
           case 'Room_Circle_1':
               if(value=="1"){
                openAndCloseState(!open,5)
               }else{
                openAndCloseState(open,5)
               }
               break;
            case 'Room_Circle_2':
                if(value=="1"){
                    openAndCloseState(!open,6)
                }else{
                    openAndCloseState(open,6)
                }
                break;   
            case 'Room_Circle_3':
                if(value=="1"){
                    openAndCloseState(!open,7)
                }else{
                    openAndCloseState(open,7)
                }
                break;  
            case 'Room_Circle_4':
                if(value=="1"){
                    openAndCloseState(!open,8)
                }else{
                    openAndCloseState(open,8)
                }
                break;  
            case 'Room_Circle_5':
                if(value=="1"){
                    openAndCloseState(!open,9)
                }else{
                    openAndCloseState(open,9)
                }
                break;
            case 'Room_Circle_6':
                if(value=="1"){
                    openAndCloseState(!open,10)
                }else{
                    openAndCloseState(open,10)
                }
                    break;   
            case 'Room_Circle_7':
                if(value=="1"){
                    openAndCloseState(!open,11)
                 }else{
                    openAndCloseState(open,11)
                }
                break; 
            case 'Room_Circle_8':
                 if(value=="1"){
                    openAndCloseState(!open,12)
                }else{
                    openAndCloseState(open,12)
                }
                break;                                                                   
           default:
               break;
   
          }
    })

}


}