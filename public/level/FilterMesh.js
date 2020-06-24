
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
    parseXML()
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
    path: 'libs/loading.json' // the path to the animation json
  });

  animate_loading.setSpeed(0.7)

  //主视野
  function cameraFlyHome(x,y,z){
    engine.animateCamera(engine.camera.position,engine.controls.target,{x:x,y:y,z:z},{x:0,y:0,z:1})
}

 //线
 var material = new THREE.LineBasicMaterial({
	color: 0x0000ff
});


function parseXML(){
    if (window.XMLHttpRequest)
    {// code for IE7+, Firefox, Chrome, Opera, Safari
    xmlhttp=new XMLHttpRequest();
    //  console.log(xmlhttp)
    }
    xmlhttp.open("GET","../mesh/path/point2.xml",false);
    xmlhttp.send();
    xmlDoc=xmlhttp.responseXML;
    console.log(xmlDoc)
    var listArr=[]
    // console.log(xmlDoc.getElementsByTagName('noi:GEO_POINT_LIST_3D')[0].children[0].attributes[0].nodeValue)
     var list= xmlDoc.getElementsByTagName('noi:GEO_POINT_LIST_3D')
     
     for(var j=0;j<list.length;j++){

         var pointList=list[j]
         for(var i=0;i<pointList.children.length;i++){
            var x= pointList.children[i].attributes[0].nodeValue
            var y= pointList.children[i].attributes[1].nodeValue
            var z= pointList.children[i].attributes[2].nodeValue
            // console.log('x:'+x+'y:'+y+'z:'+z)
            listArr.push(x,y,z)
         }
     }

     var geometry = new THREE.Geometry();
    for(var i=0;i<listArr.length;i+=3){
        geometry.vertices.push(new THREE.Vector3(listArr[i],listArr[i+1],listArr[i+2]))
    }
    // var line = new THREE.Line( geometry, material );
    // engine.scene.add( line );
    var pointarr=[]
    for (var i = 0; i < geometry.vertices.length; i++) {

        var x=  parseFloat(geometry.vertices[i].x)
        var y=  parseFloat(geometry.vertices[i].y)
        var z=  parseFloat(geometry.vertices[i].z)

        var pointvec3 = new THREE.Vector3(x, y, z);
      
        // console.log(geometry.vertices[i])
      
        console.log(pointvec3)
        pointarr.push(pointvec3);
    }
    console.log(pointarr)

    var testArr=[
        new THREE.Vector3(0,0,0),
        new THREE.Vector3(0,0,100),
    ]
    // console.log(testArr[1])
    var pipeSpline = new THREE.CatmullRomCurve3(pointarr);
    var tubeGeometry = new THREE.TubeGeometry(pipeSpline, 128, 1, 16, false);
    var textureLoader = new THREE.TextureLoader();
    var texture = textureLoader.load('../textures/' +'halfYellow' + '.png');
            texture.wrapS = THREE.RepeatWrapping;
            texture.wrapT = THREE.RepeatWrapping;
            texture.repeat.x = 150;
            var tubeMaterial = new THREE.MeshPhongMaterial({
                map: texture,
                transparent: true,
                emissive: 0x0033ff,
                emissiveIntensity: 10,
                depthTest: false,
                color: 0x0033ff
            }); 
            var tube = new THREE.Mesh(tubeGeometry, tubeMaterial);
            var outGeo = new THREE.TubeGeometry(pipeSpline, 128, 0.1, 16, false);
            var outMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.15 });
            var outCube = new THREE.Mesh(outGeo, outMaterial);
            engine.scene.add(outCube);
            outCube.add(tube);
            engine.addEventListener("update", function () {
                texture.offset.x -= 0.02;
            });
}



// // gltf模型加载
//  var loader = new THREE.GLTFLoader();
//     loader.load('mesh/gltfLight/shapan.gltf', function (gltf) {
//         loadMesh = gltf.scene;
//         // loadMesh.scale.set(100,100,100);
//         // loadMesh.position.set(0,0,15)
//         // loadMesh.rotation.set(Math.PI/2,Math.PI/2,Math.PI)
//         // _this.engine.scene.add(loadMesh);
//     });

// this.apartmentelectricPower('../mesh/path',20)
}

//公寓电力走向
var ele = [];
MakerJS.FilterMesh.prototype.apartmentelectricPower = function (dir, repeatx) {
    var scope =this. engine;
    for (var i = 0; i < 6; i++) {
        var electric_loader = new MakerJS.Path();
        electric_loader.index = i;
        electric_loader.addEventListener('load', function (event) {
            var path = event.content;
            var geometry = path.geometry;
            var pointarr = [];
            for (var i = 0; i < geometry.vertices.length; i++) {
                //var pointvec3 = new THREE.Vector3(geometry.vertices[i].x, geometry.vertices[i].y, geometry.vertices[i].z);
                pointarr.push(geometry.vertices[i]);
            }

            var pipeSpline = new THREE.CatmullRomCurve3(pointarr);
            var tubeGeometry = new THREE.TubeGeometry(pipeSpline, 128, 0.05, 16, false);
            var textureLoader = new THREE.TextureLoader();
            let color = path.index % 2 == 0 ? "halfYellow" : "halfRed";
            var texture = textureLoader.load('../textures/' +'halfYellow' + '.png');
            texture.wrapS = THREE.RepeatWrapping;
            texture.wrapT = THREE.RepeatWrapping;
            texture.repeat.x = repeatx;
            var tubeMaterial = new THREE.MeshPhongMaterial({
                map: texture,
                transparent: true,
                emissive: 0x0033ff,
                emissiveIntensity: 10,
                depthTest: false,
                color: 0x0033ff
            }); //这种材质需要添加光照,光照侧才会显示
            //console.log(tubeMaterial)
            var tube = new THREE.Mesh(tubeGeometry, tubeMaterial);
            scope.blooms.addBloomObjects(tube)
            var outGeo = new THREE.TubeGeometry(pipeSpline, 128, 0.1, 16, false);
            var outMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.15 });
            var outCube = new THREE.Mesh(outGeo, outMaterial);
            outCube.translateZ(-39);
            scope.scene.add(outCube);
            outCube.add(tube);
            ele.push(outCube);

            scope.addEventListener("update", function () {
                texture.offset.x -= 0.02;
            });

        });
        var s = dir + "/电流" + ".PATH";
        //console.log(s)
        electric_loader.load(s);
    }
}


