
MakerJS.FilterMesh=function(engine){

this.engine=engine;
var _this=this;
this.world_name;

this.distributionRoomMeshs=[];
this.exhibitionHallMeshs=[];
this.hallDistributionMeshs=[];

this.monitoring_material = new THREE.MeshBasicMaterial({
    color: "#1E90FF",
    // emissive :0xFDE951,
    polygonOffset: true,
    //polygonOffsetFactor: 1, // positive value pushes polygon further away
    polygonOffsetUnits: 1,
    depthTest: true,
    opacity: 0.3,
    transparent: true,
});

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


this.engine.world.addEventListener('loadEnd', loadEnd)
//关卡加载完毕
function loadEnd(){


    document.getElementById('mask').style.display='none'
    switch(this.world_name) {
        
        case 'distributionRoom':
            this.engine.camera.position.set(0,-300,200)
            var distributionRoom=new MakerJS.distributionRoom()
            console.log(_this.distributionRoomMeshs)
            distributionRoom.initSceneMeshs(engine,_this.distributionRoomMeshs)
        break;
        case 'exhibitionHall':
            this.engine.camera.position.set(0,-100,200)
            console.log(_this.exhibitionHallMeshs)
            var exhib=new MakerJS.exhibitionHall()
            exhib.init(engine,_this.exhibitionHallMeshs)
        break;
        case 'hallDistribution':
            this.engine.camera.position.set(0,-800,500)
            console.log(_this.hallDistributionMeshs)
            var hallDistribution=new MakerJS.hallDistribution()
            hallDistribution.initSceneMeshs(engine,_this.hallDistributionMeshs)
        break;
        
        default:
        break;
      } 
}

//加载动画
var animate_loading = lottie.loadAnimation({
    container: document.getElementById('mask'), // the dom element that will contain the animation
    renderer: 'svg',
    loop: true,
    autoplay: true,
    path: 'js/scene/loading.json' // the path to the animation json
  });

  animate_loading.setSpeed(0.7)

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


