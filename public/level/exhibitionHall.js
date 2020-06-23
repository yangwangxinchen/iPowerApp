
MakerJS.exhibitionHall=function(){

        var engine;
        var _this=this;
       
        this.engine=null;
        var exhibitionHallMeshs=[];
        
        this.line_material = new THREE.LineBasicMaterial({
            color: "#00f" ,        //#B0C4DE
            linewidth: 1,
            polygonOffset: true,
            polygonOffsetFactor: 1, // positive value pushes polygon further away
            polygonOffsetUnits: 1,
            depthTest: true,
            opacity: 0.8,
            transparent: true,
            lights:false,
            // alphaTest:0.9
        });

        //new THREE.MeshPhongMaterial材质需要添加光照,光照侧才会显示
        this.solid_material =new THREE.MeshBasicMaterial({
            color: "#778899",
            // emissive :0x4169E1,
            polygonOffset: true,
            //polygonOffsetFactor: 1, // positive value pushes polygon further away
            polygonOffsetUnits: 1,
            depthTest: true,
            opacity: 0.5,
            transparent: true,
        });

        var beam_material = new THREE.MeshBasicMaterial({
            color: "#0000ff",
            // opacity: 0.6,
            // transparent: false,
            // lights:false,
            // side:THREE.DoubleSide
        });

        var  tapeLight_material=new THREE.MeshLambertMaterial({
            color :"#000000",
        });
        
        this.lampshade_material = new THREE.MeshLambertMaterial({
            color: 0x000000,
            // emissive :0xFDE951,
            polygonOffset: true,
            //polygonOffsetFactor: 1, // positive value pushes polygon further away
            polygonOffsetUnits: 1,
            depthTest: true,   //启用 深度遮挡
            opacity: 0.7,
            transparent: true,
        });
        
        this.monitoring_material = new THREE.MeshBasicMaterial({
            color: "#00ff00",
            opacity: 0.3,
            transparent: true,
            side: THREE.DoubleSide
        });

        var thermal_material = new THREE.MeshBasicMaterial({
            color: "#ff0000",
            opacity: 0.3,
            transparent: true,
            side: THREE.DoubleSide
        });

        
        this.lampClose_material = new THREE.MeshLambertMaterial({
            color: 0xffffff,
            // emissive :0xffff00,
            polygonOffset: true,  
            //polygonOffsetFactor: 1, // positive value pushes polygon further away
            polygonOffsetUnits: 1,
            depthTest: true,
            opacity: 0.7,
            transparent: true,
        });
        
        this.lampOpen_material = new THREE.MeshLambertMaterial({
            color: 0xffffff,
            emissive :0xffffff,
            polygonOffset: true,     //多边形偏移
            polygonOffsetFactor: 1, // positive value pushes polygon further away
            polygonOffsetUnits: 1,
            depthTest: false,
            opacity: 1,
            transparent: true,
            lightMapIntensity:2
        });
        var yellow_material = new THREE.MeshLambertMaterial({
            color: "#FFFF00",
            emissive :"#FFFF00",
            // polygonOffset: true,     //多边形偏移
            // polygonOffsetFactor: 1, // positive value pushes polygon further away
            // polygonOffsetUnits: 1,
            depthTest: false,
            opacity: 1,
            transparent: true,
            // lightMapIntensity:2
        });
        
        
        this.glass_material = new THREE.MeshBasicMaterial({
            color: "#778899",
            // emissive :0xFDE951,
            // polygonOffset: true,
            //polygonOffsetFactor: 1, // positive value pushes polygon further away
            // polygonOffsetUnits: 1,
            depthTest: true,
            opacity: 0.3,
            transparent: true,
        });
        
        //体积光效果
        var texture_alpha = new THREE.TextureLoader().load( 'mesh/gltfLight/alpha.png' );
        // 使用透明纹理进行材质创建alphaMap: texture
        var volumeLight_material = new THREE.MeshPhongMaterial( 
            {
                 alphaMap: texture_alpha, 
                 color:0xADD8E6 ,
                 emissive:0x888888, 
                 transparent:true, opacity:0.3
            });
        
        var unreal_material =new THREE.MeshBasicMaterial({
                color: 0x778899,
                // polygonOffset: true,
                // polygonOffsetFactor: 1, // positive value pushes polygon further away
                // polygonOffsetUnits: 1,
                // depthTest: true,
                opacity: 0.7,
                transparent: true,
                });
        
        //设备开关状态
        function device_on_off(devices,open,lampMat){
            //传入参数需要写在前面
            var lampOpenMaterial=lampMat||_this.lampOpen_material
            for(var de in devices){
                device=engine.scene.getObjectByName(devices[de]) 
                if(open){
                    device.material=lampOpenMaterial;
                    // engine.blooms.setEnable(true)
                    engine.blooms.addBloomObjects(device)
                }else{
                   
                    device.material=_this.lampClose_material;  
                    // engine.blooms.setEnable(false)
                    engine.blooms.removeBloomObjects(device)
                }
            }
        }
        
        var volumeLights=[];
        //体积光模型
        function volumeLights_visible(visible){
            for(var i in volumeLights){
                volumeLights[i].visible=visible
            }
        }
        
        
        //筒灯灯罩
        var cir_light_state=false;
        // var cir_lights=[];
        this.circle_light=function(){
            cir_light_state=!cir_light_state;
            
        }
         
        
        //方灯
        var rectangleState=false;
        var rectangleLights=[]
        this.switchRoomLamp_S=function(state){
            if(rectangleLights.length==0) return
            rectangleState=state
            device_on_off(rectangleLights,state)
            volumeLights_visible(state)  //体积光模型
        }
        
        //展厅筒灯
        var circleState=false;
        var circleLights=[]

        function getHallLights(){
            for(var i=8;i<44;i++){
                var light;
                if(i<10){
                    light= 'yd_dguan0'+i
                }else{
                    light= 'yd_dguan'+i
                }   
                circleLights.push(light)
              }
        //   console.log(circleLights)
        }

        function switchRoomLamp_D(state){
            if(circleLights.length==0) return

            circleState=state
            device_on_off(circleLights,state)
        }

        //走廊筒灯
        var hallwayLights=[]
        function getHallwayLights(){

        for(var i=1;i<8;i++){
          var light= 'yd_dguan0'+i
          hallwayLights.push(light)
        }
        
        // console.log(hallwayLights)
        }

        function switchHallwayLamp(state){
        device_on_off(hallwayLights,state,yellow_material)
        }

        //配电房筒灯
        var distributionLights=[]
        function getDistributionLights(){
        for(var i=44;i<53;i++){
                var light= 'yd_dguan'+i
                distributionLights.push(light)
        }
        //   console.log(distributionLights)
        }
        
        function switchDistributionLamp(state){
            device_on_off(distributionLights,state,yellow_material)
        }

        //灯带
        var tapelight
        var tapelights=[]
        function getTapeLights(){

            tapelight=engine.scene.getObjectById(53)
            tapelight.material=new THREE.MeshLambertMaterial({ color :"#000000"});
            tapelights.push(tapelight)
        }
        function switchTapeLight(state){
            if(state){
                pushValue(outlineObjects,tapelight)
                tapelight.material=new THREE.MeshLambertMaterial({ color :"#00BFFF"});
                engine.blooms.addBloomObjects(tapelight)
                // engine.effects.setOutlineObjects(tapelights)

            }else{
                  
                removeByValue(outlineObjects,tapelight)
                tapelight.material=new THREE.MeshLambertMaterial({ color :"#000000"});
                engine.blooms.removeBloomObjects(tapelight)
                // engine.effects.setOutlineObjects(outlineObjects)
                // engine.effects.outlinePass.enabled=false
            }
            engine.effects.setOutlineObjects(outlineObjects)

        }
        
        //更改材质   material three 材质类型
        function  change_mesh_material(meshName,material){
          let meshNode= engine.scene.getObjectByName(meshName)
          meshNode.material=material
        }
        
        //设置边缘线效果
        function setEdgesEffect(){
             var walls=[]
             var wall_inside=_this.engine.scene.getObjectByName('bgs_waikuang')
             var wall_out=_this.engine.scene.getObjectByName('5louwaiqiang')
             change_mesh_material('bgs_waikuang',_this.solid_material)
             change_mesh_material('5louwaiqiang',_this.solid_material)

             var stand= engine.scene.getObjectByName('zhantai');
             walls.push(wall_inside,wall_out,stand)
             for(var i in monitorings) {
                let mon=engine.scene.getObjectByName(monitorings[i]) 
                walls.push(mon)
            }
            //边缘线
            engine.effects.setEdgesObjects(walls)
            
             for(var i in airSwitchs){
                // walls.push(airSwitchs[i])
                engine.effects.addEdgesObject(airSwitchs[i],_this.line_material)
            }

            var display=engine.scene.getObjectByName('xianshiqi')
            engine.effects.unrealObject(display)
            
            //线框
            // engine.effects.setWireframeObjects(walls)
        }
        
      
        var sands=[]
        var sandFloorDefaultMaterial;
        var sandFloorBloomMaterial=new THREE.MeshPhongMaterial({color: 0xffffff,emissive :0xffffff});
        function getSand(){
           var sand= engine.scene.getObjectByName('shapan')
           sands=sand.children
           sandFloorDefaultMaterial=sands[0].material

        }
        
         // 沙盘楼层    灯带
        function setSandState(state,floor){
            if(!isNaN(floor)){
            if(state){
                sands[floor-1].material=sandFloorBloomMaterial
            }else{
                sands[floor-1].material=sandFloorDefaultMaterial
            }
       
            }
        }

        //logo贴图    //镜像材质
        function setLogoMaterial(){
           var logo= engine.scene.getObjectByName('logo');
           var tex=new THREE.TextureLoader().load('textures/logo.PNG');  
            logo.rotateX(Math.PI)
            logo.material[1]=new THREE.MeshBasicMaterial({map:tex})
        }
        
        //更改玻璃材质
        function setGlass(){
            let glass=[]
            let glass_board= engine.scene.getObjectByName('boli02')
            let glass_door= engine.scene.getObjectByName('boli01')
            
            glass.push(glass_door,glass_board)
            // glass_board.visible=false
            // console.log(glass_door)
            
            for(var i in glass){
                glass[i].material=_this.glass_material
            }
            setLogoMaterial()
        }
        
    
        var airSwitchs=[]
        //遍历场景模型
        function traverseSceneMeshs(){
            
            for(var ex in exhibitionHallMeshs)
            {
                let meshName=exhibitionHallMeshs[ex]
                if(meshName.indexOf("fd_waike")!=-1){
                    change_mesh_material(meshName,_this.lampshade_material)
                }

                if(meshName.indexOf=='yd_waike'){
                    change_mesh_material(meshName,_this.lampshade_material)
                }

                if(meshName.indexOf("shizhui")!=-1){
                    monitorings.push(meshName);
                    change_mesh_material(meshName,_this.monitoring_material)
                }

                if(meshName.indexOf("fd_dguan")!=-1){
                    rectangleLights.push(meshName);
                    change_mesh_material(meshName,_this.lampClose_material)
                }
                if(meshName.indexOf("yd_dguan")!=-1){
                    change_mesh_material(meshName,_this.lampClose_material)
                }

                if(meshName.indexOf("fd_tijiguang")!=-1){
                    let mesh= engine.scene.getObjectByName(meshName)
                    mesh.material=volumeLight_material 
                    volumeLights.push(mesh);
                }
                if(meshName=='kongkai'){
                    let mesh= engine.scene.getObjectByName(meshName)
                    // change_mesh_material(meshName,beam_material)
                    airSwitchs.push(mesh)
                }
                if(meshName=='liangzhu'){
                    change_mesh_material(meshName, _this.solid_material)
                }
                if(meshName.indexOf("kongtiao")!=-1){
                    let mesh= engine.scene.getObjectByName(meshName)
                     airCons.push(mesh)
                }
                if(meshName.indexOf("diangui")!=-1){
                    let mesh= engine.scene.getObjectByName(meshName)
                    cabinets.push(mesh)
                }

            }
            // console.log(cabinets)
            getHallLights()
            getHallwayLights()
            getDistributionLights()
            getTapeLights()
            getSand()
            
        }

        //初始化
        this.init=function(_engine,_exhibitionHallMeshs){
            
            engine=_engine;
            this.engine=_engine
            exhibitionHallMeshs=_exhibitionHallMeshs;
            engine.blooms.setEnable(true)   //启用辉光

            traverseSceneMeshs()
            setEdgesEffect()  //边缘线
            volumeLights_visible(false);
           
            showHideMonitorView()
            
            label_3d()
           
            setGlass()
            setElectricCabinet()
       
            getMqtt()
            
            engine.addEventListener('update',eveUpdate)
            engine.nodeSelection.addEventListener('choose',eveChoose)
        } 
        
        //添加指示线
        function addNormalLine(x1,y1,z1,x2,y2,z2){
            const p1 =  new THREE.Vector3(x1,y1,z1)
            const p2 =  new THREE.Vector3(x2,y2,z2)
            const lineGeo = new THREE.Geometry()
            lineGeo.vertices.push(p1,p2)
            lineGeo.colors.push(new THREE.Color("#fff")) //
            const line = new  THREE.Line(lineGeo,new THREE.LineBasicMaterial({
                linewidth:1,//window无效
                // vertexColors: true,//使用顶点渐变着色
            }))
        
            const point=new THREE.Mesh(new THREE.SphereBufferGeometry( 0.15, 16, 8 ),new THREE.LineBasicMaterial({color:"#007F7F",transparent:true,opacity:0.8}))
            point.position.set(x1,y1,z1)
            engine.scene.add(line)
            engine.scene.add(point)
            // return line
        }
        
       
        //外轮廓数组
        var outlineObjects=[]
         
        //移除数组元素
        function removeByValue(arr,val){
            for(var i=0;i<arr.length;i++){
                if(arr[i]==val){
                    arr.splice(i,1);
                    break;
                }
            }
        }
        //添加数组元素
        function pushValue(arr,val){
            var flag=false;
            for(var i=0;i<arr.length;i++){
                if(arr[i]==val){
                  flag=true
                }
            }
            if(flag==false){
                arr.push(val)
            }
        }

        var airCons=[]
        //空调
        function switchAirC(num,state){
          if(state){
            pushValue(outlineObjects,airCons[num])     
          }else{
            removeByValue(outlineObjects,airCons[num])
          }
          engine.effects.setOutlineObjects(outlineObjects)
        }

        function getAirC(){
          
        }
        
    /*    //管道线
        const list=[
            [-20,5,-10],
            [10,5,-9],
            [10,5,20],
            [40,5,40]
        ]

        //获取曲线
        const getLineGeo=list=>{
         const l=[]
         for(let i=0;i<list.length;i++){
             l.push(new THREE.Vector3())
         }


        }

        //管道几何体
        function tubeCreate(){
            const tubeGeometry = new THREE.TubeGeometry(res.curve, 1000, 0.1, 30)
            const texture = new THREE.TextureLoader().load("./textures/red_line.png")
            texture.wrapS = texture.wrapT = THREE.RepeatWrapping; //每个都重复
            texture.repeat.set(1, 1);
            const tubeMesh = new THREE.Mesh(tubeGeometry , new THREE.MeshBasicMaterial({map:texture,side:THREE.BackSide,transparent:true}))
            texture.needsUpdate = true
            engine.scene.add(tubeMesh)
        }
      */  

        
     /*   var airsPlane=[]
        //1.uv贴图修改偏移
        const loader_t  = new THREE.TextureLoader()
        var texture;
        loader_t.load("textures/arrow.png",t =>{ 
            texture = t
            texture.wrapS = THREE.RepeatWrapping;
            texture.wrapT = THREE.RepeatWrapping;
            texture.repeat.set(4,4)
            var plane =  new THREE.Mesh(new THREE.PlaneBufferGeometry(10,10),new THREE.MeshBasicMaterial({
                // color:"#f00",
                map:texture,
                transparent:true,
                side:THREE.DoubleSide,
                opacity:0.5,
            }))
            plane.position.set(65,-1.5,45)
            plane.rotateY(Math.PI/2)
        
            var plane1=plane.clone()
            plane1.position.set(-42,5.5,45)
            airsPlane.push(plane,plane1)
            // engine.scene.add(plane,plane1)
        })
        
        //2.着色器中uniform变量更新 每帧更改x y的偏移
        */
        
       /*   function createSprite(){
                //精灵
                var textured = new THREE.TextureLoader().load("dropBg.png");
                var spriteMaterial = new THREE.SpriteMaterial({
                // color: 0xffffff,
                map: textured
                });
        
                var group=new THREE.Group();
              
                var obj=_this.engine.scene.getObjectByName('方灯体积光15')
                for(var i=0;i<5;i++)
                {
                    var sprite = new THREE.Sprite(spriteMaterial);
                    sprite.position.set(obj.position.x,obj.position.y+i*17,obj.position.z+5)
                    // console.log(sprite);
                    sprite.scale.x = 10;
                    sprite.scale.y = 5; 
                    group.add(sprite)
                }
                
                engine.scene.add(group);
               
        } */
        
        var labelRenderer
        //样式 类似billboard 
        function label_2d(){
            var obj=_this.engine.scene.getObjectByName('kongtiao01')
            var objDiv = document.createElement( 'div' );
            objDiv.className = 'label';
            objDiv.textContent = '室内圆灯';
            var objLabel = new THREE.CSS2DObject( objDiv );
            obj.add( objLabel );
            labelRenderer = new THREE.CSS2DRenderer();
            labelRenderer.setSize( window.innerWidth, window.innerHeight );
            labelRenderer.domElement.style.position = 'absolute';
            labelRenderer.domElement.style.top = '0px';
            document.body.appendChild( labelRenderer.domElement );
            _this.engine.controls = new THREE.OrbitControls(_this.engine.camera, labelRenderer.domElement);
        }
        
        //通过样式实现3d效果
        var css3DRenderer
        var circuitCount=10;
        var circuitRun=2
        var capacity=1000
        function label_3d(){
             //渲染
             css3DRenderer = new THREE.CSS3DRenderer()
             css3DRenderer.setSize( engine.width,engine.height )
             css3DRenderer.domElement.style.position = 'absolute'
             css3DRenderer.domElement.style.top = 0
             css3DRenderer.domElement.style.pointerEvents = "none"
             document.body.appendChild(css3DRenderer.domElement );
            var smartBox= _this.css3DObjectCreate(document.getElementById("box3"))
            smartBox.position.set(-84,5,25)
            smartBox.rotation.set(0,Math.PI/2,Math.PI/2)
            addNormalLine( -84,5,20,-84,5,24) 
        }
        
        //创建css3DObject
        this.css3DObjectCreate=function(div){
         
         if(!css3DRenderer) console.error('css3DRenderer 未定义')
         var label3d = new THREE.CSS3DObject( div)
         label3d.scale.set(0.05,0.05,0.05)
         engine.scene.add(label3d)
         return  label3d
        }
        
       
        //相机飞行
        this.cameraFly=function(_name,_x,_y,_z,time){
            var nameNode=_this.engine.scene.getObjectByName(_name)
            var controlPos =nameNode.getWorldPosition()
            // console.log(controlPos)
            var targetPos={x:_x,y:_y,z:_z }
            // var targetPos={x:0,y:10,z:10 }
            var t=engine.cameraFly(targetPos,controlPos,time)
            t.start()
            t.onComplete(function(){ 
            })
        }
        
        //主视野
        // function cameraFlyHome(){
        //     engine.animateCamera(engine.camera.position,engine.controls.target,{x:0,y:-100,z:200},{x:0,y:0,z:1})
        // }
        
        
        //监控视锥
        function createMonitorView(radiusTop,radiusBottom,height,radialSegments,heightSegments,openEnded){
            //圆柱顶部半径   圆柱底部半径  圆柱高  圆柱侧面分段 圆柱高度分段  圆柱底面开放还是封顶
            var geometry = new THREE.CylinderGeometry( radiusTop,radiusBottom, height, radialSegments,heightSegments,openEnded);
            var material = new THREE.MeshBasicMaterial( {color: 0x0000ff} );
            var cylinder = new THREE.Mesh( geometry, material );
             
            var m1= engine.scene.getObjectById(242)
            m1.add( cylinder );
            // console.log(m1.getWorldDirection())
            // var po=m1.getWorldDirection()
            // // console.log(m1.rotation)
            // cylinder.position.set(0,0,0)
            //var worldPosition = new THREE.Vector3();
           // mesh.getWorldPosition(worldPosition);
           
            cylinder.rotation.set(0,0,Math.PI)//Math.PI/4
            // cylinder.setRotationFromAxisAngle(new THREE.Vector3(0,1,1),30)
            // console.log(cylinder)
        }

        var monitorings=[]
        //显示隐藏监控视锥
        function showHideMonitorView(id){
            for (var i in monitorings){
                let mon=engine.scene.getObjectByName(monitorings[i]) 
                mon.visible=false
            }
            if(arguments.length>0&&!isNaN(id)){
                var roomMon=engine.scene.getObjectById(id)
                roomMon.visible=true
            }
        }

        // 展厅
        function roomMonitor(){
            showHideMonitorView(243)
        }
        //配电间
        function  roomDistributionMonitor(){
            showHideMonitorView(247)
            var roomMon= engine.scene.getObjectById(247)
            roomMon.material=_this.monitoring_material
        }
        //门禁
        function roomAccessMonitor(){
            showHideMonitorView(30)
        }

        //热成像
        function roomThermalMonitor(){
            showHideMonitorView(247)
            var roomMon= engine.scene.getObjectById(247)
            roomMon.material=thermal_material  
        }

    /*   function monitorRotate(id){
            var monitor=engine.scene.getObjectById(id)
                var yaw=Math.PI/180;
                var rate=30
                var angle=yaw*rate;
        
                setInterval(() => {
                    if( monitor.rotation.z>1.37){
                        angle=-yaw*rate
                        }else if(monitor.rotation.z<-1.27){
                        angle=yaw*rate
                        }
                        // monitor.rotation.set(0,0,monitor.rotation.z+angle)
                        var newP={x:monitor.rotation.x,y:monitor.rotation.y,z:monitor.rotation.z+angle}
                        RotationMonitor(monitor.rotation, newP,1500,monitor)
                }, 2000);
                
         }


         //旋转摄像头
         function RotationMonitor (oldP, newP, span,monitor) {
         var tween = new TWEEN.Tween({
            x1: oldP.x, 
            y1: oldP.y, 
            z1: oldP.z, 
        });
        tween.to({
            x1: newP.x,
            y1: newP.y,
            z1: newP.z,

        }, span);
        tween.onUpdate(function(object) {
            monitor.rotation.x= object.x1;
            monitor.rotation.y = object.y1;
            monitor.rotation.z = object.z1;
    
        })
        tween.onComplete(function() {
        })
        tween.easing(TWEEN.Easing.Cubic.InOut);
        tween.start();
    }  */

    //透明度渐变
    function opacityChange(from,to){
        _this.line_material.opacity=from
        var tween=new TWEEN.Tween(_this.line_material)
        tween.to({opacity:to},1500)
        tween.onUpdate(function(object) {
           
        })
        tween.easing(TWEEN.Easing.Cubic.InOut);
        tween.start();
    }

    //门禁记录
    function  accessRecord(state){
        var access=engine.scene.getObjectByName('boli01');
        if(state){
         //单独物体的边缘线
         engine.effects.addEdgesObject(access,_this.line_material)
         opacityChange(0,1)
        }else{
         engine.effects.removeEdgesObject(access)
        }
         
    }

    //红外传感 TODO

    var cabinets=[];
         //展厅内的配电柜
         function setElectricCabinet(){
          for(var i in cabinets){
              cabinets[i].material=unreal_material
              engine.effects.addEdgesObject(cabinets[i])
          }
         }

        //每帧检测
        function eveUpdate(){
                // if(labelRenderer){
                //   // labelRenderer.render(engine.scene, engine.camera );
                // }
               
                if(css3DRenderer){
                    css3DRenderer.render(engine.scene, engine.camera );
                    document.getElementById("box3").innerHTML= `
                    <div class='box-child'>
                        <span class='box3-text' style='font-size:18px'>智能配电箱</span>
                        <span class='box3-text'></span>
                    </div>
                    <div class='box-child'>
                        <span class='box3-text'>回路总数:</span>
                        <span class='box3-text'>${circuitCount}条</span>
                    </div>
                    <div class='box-child'>
                        <span class='box3-text'>回路运行:</span>
                        <span class='box3-text'>${circuitRun}条</span>
                    </div>
                    <div class='box-child'>
                        <span class='box3-text'>总功率:</span>
                        <span class='box3-text'>${capacity}kW</span>
                    </div>
                `
                }
                
                // if(texture){
                //     // texture.offset.x -= 0.05
                //     // texture.offset.y += 0.01
                // }
                TWEEN.update();     
        }
        
        function eveChoose(e){
            var nameNode;
            if(e.content instanceof THREE.Mesh)nameNode=e.content.name
           if(nameNode=="kongkai"){
             //TODO  跳转到智能配电箱(回路(资产)管理)  向手机端发送指令
             param = {type:'toCircleManage',}
             window.ReactNativeWebView&&window.ReactNativeWebView.postMessage(JSON.stringify(param)) ; 
           }

        }

        //切换tab时 清除其他tab的显示状态
        function clearControlTab(){
            showHideMonitorView()
            accessRecord(false)
        }

         //接收手机端指令
        window.changhua = {
            roomMonitor:()=>{
                roomMonitor()
            },
            roomDistributionMonitor:()=>{
                roomDistributionMonitor()
            },
            roomAccessMonitor:()=>{
                roomAccessMonitor()
            },
            roomThermalMonitor:()=>{
                roomThermalMonitor()
            },
            //视频监控
            showHideMonitorView:()=>{
                clearControlTab()
                roomMonitor()
            },
            //门禁记录
            accessRecord:()=>{
                clearControlTab()
                accessRecord(true)//描边显示门  
            }
            
            //控制面板
            //接线图
            //资产管理
        }


         //关联数据
         function getMqtt(){
        
            var client=engine.getMqtt()
            
            client.on('message',function (topic, message) {
               // console.log("topic:",topic.toString())
               const deviceName=topic.substring(13)
               //test() 方法用于检测一个字符串是否匹配某个模式
               // if(!/Room/.test(topic)) return
               //1开 0关
            //    console.log(topic.substring(13)+":"+message.toString())
           if(/\"SwitchOn\": \d/.test(message)){
               let value=message.toString().match(/\"SwitchOn\": \d/)[0].match(/\d/)[0]
               // console.log(deviceName+message.toString())
               switch(deviceName){
                   case 'Room_S_Lamp':    //平板灯
                       if(value=="1"){
                          _this.switchRoomLamp_S(true);
                       }else{
                          _this.switchRoomLamp_S(false);
                       }
                       break;
                   case 'Room_D_Lamp_1':  //展厅筒灯
                       if(value=="1"){
                          switchRoomLamp_D(true);
                       }else{
                          switchRoomLamp_D(false);
                       }
                       break;
                   case 'Hallway_S_Lamp':  //走廊射灯
                       if(value=="1"){
                           switchHallwayLamp(true)
                       }else{
                           switchHallwayLamp(false)
                       }
                       break;
                   case 'Room_D_Lamp_2':  //配电房射灯
                       if(value=="1"){
                          switchDistributionLamp(true)
                       }else{
                           switchDistributionLamp(false)
                       }
                       break;   
                   case 'Room_B_Lamp':  //灯带
                       if(value=="1"){
                           switchTapeLight(true)
                       }else{
                           switchTapeLight(false)
                       }
                       break;       
                   case 'Room_AirC_1':         //左空调
                       if(value=="1"){
                          switchAirC(1,true);   
                       }else{
                           switchAirC(1,false);
                       }
                       break;
                   case 'Room_AirC_2':     //右空调
                       if(value=="1"){
                          switchAirC(0,true);
                       }else{
                           switchAirC(0,false);
                       }
                       break;
                                        
                   default:
                       break;
                  }
           }
           else{
            var stateValue=message.toString().match(/\d/)[0] 
               console.log(deviceName+':'+stateValue)
                  switch(deviceName){
                case '5F_L_Light':     //5F_ML_Light   1F_L_Light  1F_R_Light  WS_R_Light
                if(stateValue=="1"){
                  setSandState(true,5)
                }else{
                  setSandState(false,5)
                }
             case '5F_R_Light':     
                if(stateValue=="1"){
                  setSandState(true,5)
                }else{
                  setSandState(false,5)
                }
             case '5F_ML_Light':     
                if(stateValue=="1"){
                  setSandState(true,5)
                }else{
                  setSandState(false,5)
                }    
                break;
             case '5F_MR_Light':     
                if(stateValue=="1"){
                  setSandState(true,5)
                }else{
                  setSandState(false,5)
                }    
                break;
             case '4F_R_Light':     
                if(stateValue=="1"){
                  setSandState(true,4)
                }else{
                  setSandState(false,4)
                }    
                break;
             case '4F_L_Light':     
                if(stateValue=="1"){
                  setSandState(true,4)
                }else{
                  setSandState(false,4)
                }    
                break;
             case '4F_M_Light':     
                if(stateValue=="1"){
                  setSandState(true,4)
                }else{
                  setSandState(false,4)
                }    
                break; 
             case '3F_R_Light':     
                if(stateValue=="1"){
                  setSandState(true,3)
                }else{
                  setSandState(false,3)
                }    
                break;
             case '3F_M_Light':     
                if(stateValue=="1"){
                  setSandState(true,3)
                }else{
                  setSandState(false,3)
                }    
                break;
             case '3F_L_Light':     
                if(stateValue=="1"){
                  setSandState(true,3)
                }else{
                  setSandState(false,3)
                }    
                break;
             case '2F_L_Light':     
                if(stateValue=="1"){
                  setSandState(true,2)
                }else{
                  setSandState(false,2)
                }    
                break;
             case '2F_M_Light':     
                if(stateValue=="1"){
                  setSandState(true,2)
                }else{
                  setSandState(false,2)
                }    
                break;
             case '2F_R_Light':     
                if(stateValue=="1"){
                  setSandState(true,2)
                }else{
                  setSandState(false,2)
                }    
                break;
             case '1F_R_Light':     
                if(stateValue=="1"){
                  setSandState(true,1)
                }else{
                  setSandState(false,1)
                }    
                break;
             case '1F_L_Light':     
                if(stateValue=="1"){
                  setSandState(true,1)
                }else{
                  setSandState(false,1)
                }    
                break; 
            case 'WS_R_Light':     //车间灯
                if(stateValue=="1"){
                  
                }else{
                 
                }    
                break;   
            case 'WS_L_Light':     //车间灯
                if(stateValue=="1"){
                  
                }else{
                 
                }    
                break;                                      
                default:
                    break;
            }

           }
            })
       }
       
        
        //总览
        // const view_btn=document.getElementById('view')
        // view_btn.onclick=cameraFlyHome;
        
        // 智能配电箱
        const box_btn=document.getElementById('box')
        box_btn.onclick=()=> {
            // _this.cameraFly('diangui1',-60,-2,20,3)
            engine.animateCamera(engine.camera.position,engine.controls.target,{x:-60,y:4,z:20},{x:-200,y:4,z:20},3000, 
               function(){opacityChange(1,0)} )
            
            //出现智能配电箱界面
            param = {type:'toCircleManage',}
            window.ReactNativeWebView&&window.ReactNativeWebView.postMessage(JSON.stringify(param)) ; 
        }
        
        //沙盘
         const sand_btn=document.getElementById('sand')
         sand_btn.onclick=()=> {
            //  _this.cameraFly('zhantai',60,2,20,3)
            engine.animateCamera(engine.camera.position,engine.controls.target,{x:60,y:2,z:20},{x:200,y:2,z:20})
            }
        
        
        //键盘按键测试
        document.addEventListener('keydown',myKeyDown)
        function myKeyDown(id) {
            switch(id.key) {
                case '1':
                     switchRoomLamp_D(!circleState)
                   break;
                case '2':
                    _this.switchRoomLamp_S(!rectangleState)
                   break;
                case '3':
                  roomMonitor()
                   break;
                case '4':
                    roomDistributionMonitor()
                   break;
                case '5':
                    roomAccessMonitor()
                   break;
                case '6':
                   roomThermalMonitor()
                   break;   
                case '7':
                    switchTapeLight(true)
                    break;
                case '8':
                    switchTapeLight(false)
                    break;
                case '9':
                    accessRecord(true)
                    break;  
                case 'u':
                    switchAirC(0,true)
                    break;
                case 'i':
                    switchAirC(0,false)
                    break; 
                case 'o':
                    switchAirC(1,true)
                    break;
                case 'p':
                    switchAirC(1,false)
                    break;                           
                default:
                   break;
            } 
        }
        
     
       
        
}