MakerJS.distributionRoom=function(){
    var engine
    var sceneMeshs=[]

    //透明物体的颜色
    var unreal_material = new THREE.MeshBasicMaterial({
    color: 0x87cefa,
    polygonOffset: true,
    polygonOffsetFactor: 1, // positive value pushes polygon further away
    polygonOffsetUnits: 1,
    depthTest: true,
    opacity: 0.1,
    transparent: true,
    });

    var trans_material = new THREE.MeshBasicMaterial({
        color: 0x87cefa,
        polygonOffset: true,
        polygonOffsetFactor: 1, // positive value pushes polygon further away
        polygonOffsetUnits: 1,
        depthTest: true,
        opacity: 0.8,
        transparent: true,
        });
    
    //线材质
    var line_material = new THREE.LineBasicMaterial({
        color: "#ff0" ,        //0x87cefa,
        linewidth: 1,
        // polygonOffset: true,
        // polygonOffsetFactor: 1, 
        // polygonOffsetUnits: 1,
        // depthTest: false,
        opacity: 0.8,
        transparent: true,
        lights:false
    });

    //获取场景模型  在filtermesh 中初始化
    this.initSceneMeshs=function (_engine,_meshsName){
        engine=_engine;
        for(var i in _meshsName){
           let obj= engine.scene.getObjectByName(_meshsName[i])
           sceneMeshs.push(obj)
        }
        // console.log(sceneMeshs)
         init()
    }
  
    //init
    function init(){
       
        setWallUnreal()
        initCSS3DRenderer()
        getCabinet()
        
        engine.nodeSelection.addEventListener('choose',eveChoose)
        engine.addEventListener('update',eveUpdate)
    }
    

    //外墙的虚化
    function setWallUnreal(){
       for(var i in sceneMeshs){ 
           if(sceneMeshs[i].name=="waike"||sceneMeshs[i].name=="wuding"){
            engine.effects.unrealObject(sceneMeshs[i])
           }
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
        label3d.scale.set(0.2,0.2,0.2)
        engine.scene.add(label3d)
        return  label3d
    }

    var low_p01_css,low_p02_css,high_p03_css,high_p04_css,change_p05_css
    var A_VOL=232.9,
        A_ELE=0.613,
        UAB_VOL=406,
        TEMP=31.5

    //设置css样式
    function setCSS(){
        var device01=document.getElementById('device01')
        device01.innerText="进线柜\n"+"A相电压:"+A_VOL+"V"+"\nA相电流:"+A_ELE+"A"+"\nUAB线电压:"+UAB_VOL+"V"+"\n温度:"+TEMP+"℃"
        // deviceDiv.innerText="A相电压     A相电流\n"+A_VOL+"V     "+A_ELE+"A"+"\nUAB线电压     温度\n"+UAB_VOL+"V     "+TEMP+"℃"
        low_p01_css=createCSS3DObject(device01)
        low_p01_css.position.set(-135,-20,50)
        low_p01_css.rotation.set(-Math.PI/2,0,Math.PI)
        
        var device02=document.getElementById('device02')
        device02.innerText="进线柜\n"+"A相电压:"+A_VOL+"V"+"\nA相电流:"+A_ELE+"A"+"\nUAB线电压:"+UAB_VOL+"V"+"\n温度:"+TEMP+"℃"
        low_p02_css=createCSS3DObject(device02)
        low_p02_css.position.set(-135,20,50)
        low_p02_css.rotation.set(Math.PI/2,0,0)

        var device03=document.getElementById('device03')
        device03.innerText="门卫加路灯回路\n"+"A相电压:"+A_VOL+"V"+"\nA相电流:"+A_ELE+"A"+"\nUAB线电压:"+UAB_VOL+"V"+"\n温度:"+TEMP+"℃"
        high_p03_css=createCSS3DObject(device03)
        high_p03_css.position.set(142,20,50)
        high_p03_css.rotation.set(Math.PI/2,0,0)

        var device04=document.getElementById('device04')
        device04.innerText="大楼车间回路\n"+"A相电压:"+A_VOL+"V"+"\nA相电流:"+A_ELE+"A"+"\nUAB线电压:"+UAB_VOL+"V"+"\n温度:"+TEMP+"℃"
        high_p04_css=createCSS3DObject(device04)
        high_p04_css.position.set(142,-20,50)
        high_p04_css.rotation.set(-Math.PI/2,0,Math.PI)

        var device05=document.getElementById('device05')
        device05.innerText="变压器\n"+"回路总数:"+8+"条"+"\n输出容量:"+"60kWA"+"\n设备总数:"+21+"个"
        change_p05_css=createCSS3DObject(device05)
        change_p05_css.position.set(26,-40,46)
        change_p05_css.rotation.set(Math.PI/2,0,0)


    }
    
    
    var low_p01,low_p02,high_p03,high_p04,change_p05,
        low_m01,low_m02,high_m03,high_m04

    //获取各型号电柜
    function getCabinet(){
        low_p01= engine.scene.getObjectByName("dyg2")
        low_m01= low_p01.material
        low_p02= engine.scene.getObjectByName("dyg1")
        low_m02= low_p02.material
        high_p03= engine.scene.getObjectByName("gyg1")
        high_m03= high_p03.material
        high_p04= engine.scene.getObjectByName("gyg2")
        high_m04= high_p04.material
        change_p05=engine.scene.getObjectByName("byq")

    }

    //重置材质
    function resetMat(){
        low_p01.material=low_m01;
        low_p02.material=low_m02;
        high_p03.material=high_m03;
        high_p04.material=high_m04;
        engine.effects.removeEdgesObject()
    }

    //选中事件
    function eveChoose (e)  {
        var nameNode
        if(e.content instanceof THREE.Mesh) nameNode=e.content.name
    
        if(nameNode=="dyg2"){
            resetMat()
            engine.effects.addEdgesObject(low_p01,line_material)
            engine.effects.addEdgesObject(low_p02)
            low_p02.material=unreal_material
            // low_p01.material=trans_material
            //相机动画
            engine.animateCamera(engine.camera.position,engine.controls.target,{x:-78,y:170,z:100},{x:-78,y:0,z:100})
           
        }else if(nameNode=="dyg1"){
            resetMat()
            engine.effects.addEdgesObject(low_p01)
            engine.effects.addEdgesObject(low_p02,line_material)
            low_p01.material=unreal_material
            engine.animateCamera(engine.camera.position,engine.controls.target,{x:-78,y:-170,z:100},{x:-78,y:0,z:100})
           
        }else if(nameNode=="gyg1"){
            resetMat()
            engine.effects.addEdgesObject(high_p03,line_material)
            engine.effects.addEdgesObject(high_p04)
            high_p04.material=unreal_material
            engine.animateCamera(engine.camera.position,engine.controls.target,{x:78,y:-270,z:100},{x:78,y:0,z:100})
        }else if(nameNode=="gyg2"){
            resetMat()
            engine.effects.addEdgesObject(high_p03)
            engine.effects.addEdgesObject(high_p04,line_material)
            high_p03.material=unreal_material
            engine.animateCamera(engine.camera.position,engine.controls.target,{x:78,y:270,z:100},{x:78,y:0,z:100})
        }else if(nameNode=="byq"){
            resetMat()
            engine.effects.addEdgesObject(change_p05,line_material)
            engine.animateCamera(engine.camera.position,engine.controls.target,{x:0,y:-260,z:100},{x:0,y:0,z:100})
        }
        
    }
    
    var timer=0
    //update
    function eveUpdate(){

    if(css3DRenderer){
        css3DRenderer.render(engine.scene, engine.camera );
    }
    // timer++;
    // if(timer%120==0){
    //     A_VOL=230+parseFloat( (Math.random()*2 + 0.5).toFixed(2)) 
    //     A_ELE=parseFloat( (Math.random()*0.5 + 0.3).toFixed(2)) 
    //     UAB_VOL=410+parseFloat( (Math.random()*2 + 0.4).toFixed(2)) 
    //     // TEMP=30
    //     // device01.innerText="进线柜\n"+"A相电压:"+A_VOL+"V"+"\nA相电流:"+A_ELE+"A"+"\nUAB线电压:"+UAB_VOL+"V"+"\n温度:"+TEMP+"℃"
    // }
    


    } 

}  
 




