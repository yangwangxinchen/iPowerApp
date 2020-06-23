
MakerJS.FilterMesh=function(engine){

this.engine=engine;
var _this=this;
this.world_name;

this.distributionRoomMeshs=[];
this.exhibitionHallMeshs=[];
this.hallDistributionMeshs=[];


this.get_meshArray = function (meshPath,meshArray) {
    //get relative path   
    var index1 = meshPath.lastIndexOf("/");
    var index3 = meshPath.lastIndexOf(".");
    var meshName = meshPath.substring(index1+1, index3);
    // console.log(meshName)
    meshArray.push(meshName)
}

//根据world文件名赋值数组  在world 调用
this.set_meshArray=function(world_name,meshPath){
    if(this.world_name==undefined){
        this.world_name=world_name
        // console.log(this.world_name)
    }
    switch(world_name) {
        case 'distributionRoom':   //配电房
            this.get_meshArray(meshPath,this.distributionRoomMeshs)
           break;
        case 'exhibitionHall':     //展厅
            this.get_meshArray(meshPath,this.exhibitionHallMeshs)
           break;
        case 'hallDistribution':    //配电间
            this.get_meshArray(meshPath,this.hallDistributionMeshs)
        default:
           break;
   } 
}


//遍历场景 将场景物体名存入数组
function  traverseScene(arr){
    engine.scene.traverse(
        function(obj){
        //  console.log(obj.name)
         arr.push(obj.name)
        }
    )
}


//关卡加载完毕
this.engine.world.addEventListener('loadEnd', loadEnd)

function loadEnd(){
    this.world_name=engine.world.world_name
    console.log(this.world_name)
    //加载动画隐藏
    document.getElementById('mask').style.display='none'
    //总览按钮
    const view_btn=document.getElementById('view')
    switch(this.world_name) {
        case 'distributionRoom':
            this.engine.camera.position.set(0,-300,200)
            traverseScene(_this.distributionRoomMeshs)
            console.log(_this.distributionRoomMeshs)
            var distributionRoom=new MakerJS.distributionRoom()
            distributionRoom.initSceneMeshs(engine,_this.distributionRoomMeshs)
            if(view_btn)view_btn.onclick=function(){ cameraFlyHome(0,-300,200)} 
        break;
        case 'exhibitionHall':
            this.engine.camera.position.set(0,-100,200)
            traverseScene(_this.exhibitionHallMeshs)
            console.log(_this.exhibitionHallMeshs)
            var hall=new MakerJS.exhibitionHall()
            hall.init(engine,_this.exhibitionHallMeshs)
            if(view_btn)view_btn.onclick=function(){ cameraFlyHome(0,-100,200)} 
        break;
        case 'hallDistribution':
            this.engine.camera.position.set(0,-800,500)
            traverseScene(_this.hallDistributionMeshs)
            console.log(_this.hallDistributionMeshs)
            var hallDistribution=new MakerJS.hallDistribution()
            hallDistribution.initSceneMeshs(engine,_this.hallDistributionMeshs)
            if(view_btn)view_btn.onclick=function(){ cameraFlyHome(0,-800,500)} 
        break;
        case 'test':
            this.engine.camera.position.set(0,-100,200)
            break;
        
        default:
        break;
      } 
}



//开场加载动画
var animate_loading = lottie.loadAnimation({
    container: document.getElementById('mask'), // the dom element that will contain the animation
    renderer: 'svg',
    loop: true,
    autoplay: true,
    path: 'js/scene/loading.json' // the path to the animation json
  });

  animate_loading.setSpeed(0.7)

  //主视野
  function cameraFlyHome(x,y,z){
    engine.animateCamera(engine.camera.position,engine.controls.target,{x:x,y:y,z:z},{x:0,y:0,z:1})
}

 
 
// // gltf模型加载
//  var loader = new THREE.GLTFLoader();
//     loader.load('mesh/gltfLight/shapan.gltf', function (gltf) {
//         loadMesh = gltf.scene;
//         // loadMesh.scale.set(100,100,100);
//         // loadMesh.position.set(0,0,15)
//         // loadMesh.rotation.set(Math.PI/2,Math.PI/2,Math.PI)

//         // engine.scene.getObjectByName("展台01").add(loadMesh)
        

//         // _this.engine.scene.add(loadMesh);
//     });



}


