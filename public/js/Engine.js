var MakerJS = { REVISION: '1.0' };
var Public_Engine;
'use strict';

MakerJS.Engine = function () {
    // // @ 单例控制
    const canvas = document.querySelector('#Maker_Render_Canvas');
    const MakerJS_div = document.getElementById("MakerJS");
    this.div = MakerJS_div;
    this.canvas = canvas;
    

    this.renderEnabled = false;
    this.realtime = true;

    this.needReset = false;

    var screenSize={
    //  width:400,  //window.innerWidth  //MakerJS_div.offsetWidth
    //  height:304 ,  //window.innerHeight

     width:window.innerWidth,
     height:window.innerHeight
    }

    this.width=screenSize.width
    this.height=screenSize.height

    var devicePixelRatio = window.devicePixelRatio || 1;

    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x040306); //new THREE.Color(0x212121); // 0x7f7f7f

     this.camera = new THREE.PerspectiveCamera(60, this.width / this.height, 1, 10000);
    //  this.camera.position.set(0,800,100)
     this.camera.up.set(0, 0, 1);  //设置相机以z轴为上方  默认y轴为上方
    

    //辅助线
    // this.axesHelper = new THREE.AxesHelper( 1000 );
    // this.scene.add( this.axesHelper );

    
    this.renderer = new THREE.WebGLRenderer({
        canvas: canvas,
        antialias:true,
        alpha:true
    });
    this.renderer.autoClear = false;   //让后处理有效果,关闭自动清除,后面需要手动清除
    this.renderer.setClearColor(0xffffff,0);  //背景透明
    this.renderer.setSize(this.width, this.height);
    this.renderer.setPixelRatio(devicePixelRatio);
    
    
    //轨道控制器
    this.controls = new THREE.OrbitControls(this.camera, MakerJS_div);
    // this.controls.autoRotate=false
    this.controls.target.set(0,0,1)
    // this.controls.maxPolarAngle=1    //垂直旋转角度
    // this.controls.enablePan=false;  //禁用拖拽
    this.controls.enableDamping = true;
    this.controls.dampingFactor = 0.8;
    this.controls.update();
    // for reset
	//this.controls.target0 = this.target.clone();
    
    // console.log(this.controls)

    this.composer = new THREE.EffectComposer(this.renderer);
    this.composer.setPixelRatio(devicePixelRatio);

    this.taaRenderPass = new THREE.TAARenderPass(this.scene, this.camera);
    this.taaRenderPass.unbiased = false;
    this.composer.addPass(this.taaRenderPass);

    this.renderPass = new THREE.RenderPass(this.scene, this.camera);
    this.composer.addPass(this.renderPass);  //渲染当前场景
    this.renderPass.enabled = false; //关闭通道

    var copyPass = new THREE.ShaderPass(THREE.CopyShader);
    this.composer.addPass(copyPass);  //输出到屏幕

    this.taaRenderPass.enabled = true;
    this.taaRenderPass.sampleLevel = 2;

    window.addEventListener('resize', resizeWindow, false);

    var scope = this;
    //字体
    new THREE.FontLoader().load('./js/fonts/helvetiker_regular.typeface.json', function (font) {
        scope.font = font;
    });

    //中文字体，简宋
    new THREE.FontLoader().load('./js/fonts/STSong_Regular.json', function (font) {
        scope.hanfont = font;
    });

    var clock = new THREE.Clock();
    function resizeWindow() {
        const width=screenSize.width
        const height=screenSize.height
        scope.camera.aspect = width / height;
        scope.camera.updateProjectionMatrix();   //更新相机

        // resize viewport width and height
        scope.renderer.setSize(width,height);  
        scope.composer.setSize(width,height);
        scope.blooms.setSize(width,height);

        // scope.renderer.render(scope.scene, scope.camera);//执行渲染操作
     
        scope.requestFrame();
    }

   

this.cameraFly=function(targetPos,controlsPos,time){
   
    //相机起始位置需要在外面定义 如果以参数传入,相机最后的位置会异常
    var currentCameraPos=scope.camera.position

    function fly (targetPos,controlsPos,time){
        //缓动方式:四次方的缓动   类型:前半段加速 后半段减速
        var tween=new TWEEN.Tween(currentCameraPos).to(targetPos,1000*time).easing(TWEEN.Easing.Quadratic.InOut)
        var update =function(){
            scope.camera.position.set(currentCameraPos.x,currentCameraPos.y,currentCameraPos.z)
            scope.controls.target=controlsPos    //控制器中心点
        }
        tween.onUpdate(update)
        return tween;
    }
    
    var tw=fly(targetPos,controlsPos,time)

    return tw
    
}
 

// console.log(scope.camera)
    function update() {
        
        scope.controls.update(clock.getDelta()); //更新控制器
        scope.scene.updateMatrixWorld();  //更新场景矩阵 可以获得实时更新的(位置等)数据
        TWEEN.update()  //更新补间动画
        scope.dispatchEvent({ type: "update" });
    }

    
    function render() {
        update();
        // scope.renderer.autoClear = false;
        scope.renderer.clear();  //渲染器清除颜色、深度,模板缓存.
        scope.renderer.render(scope.scene, scope.camera);//执行渲染操作
        
        //需要在渲染之后执行才有后处理效果
        scope.blooms.render();
        scope.composer.render();

        scope.dispatchEvent({ type: "render" });
    }
    
    function animate() {
       
        requestAnimationFrame(animate);  //请求再次渲染函数
        
        //控制实时渲染
        if (scope.renderEnabled) {
            // stats.begin();
            render();
            // stats.end();
        }
    }
    
    animate();
   
    this.requestFrame();
   
    
    //add light
    this.directionalLight = new THREE.DirectionalLight('#fff',0.7); 
    this.directionalLight.position.set(30,-100,200).normalize();
    //console.log(this.directionalLight)
    //this.directionalLight.lookAt(new THREE.Vector3(50, 100, 75));
    this.scene.add(this.directionalLight);
    //ambient light
    this.ambientLight = new THREE.AmbientLight('#fff', 0.3);
    this.scene.add(this.ambientLight);

    //根据相机位置改变光照位置
    this.controls.addEventListener('change', function (event) {
        // scope.directionalLight.rotation.copy(scope.camera.rotation);
        // // scope.directionalLight.position.set(scope.camera.position.x, scope.camera.position.y, scope.camera.position.z);
        // scope.directionalLight.position.copy(scope.camera.position);
        scope.requestFrame();
    });

    //  console.log(this.controls)

    //directional light
    var SHADOW_MAP_WIDTH = 1024 * 4,
        SHADOW_MAP_HEIGHT = 1024 * 2;

    // this.renderer.shadowMapEnabled = false; // 开启阴影，加上阴影渲染
    // this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    var size = 20;
    // this.directionalLight.castShadow = true; // 投射阴影
    // this.directionalLight.shadow.camera.near = 0.1;
    // this.directionalLight.shadow.camera.far = 800;
    // this.directionalLight.shadow.camera.right = size;
    // this.directionalLight.shadow.camera.left = -size;
    // this.directionalLight.shadow.camera.top = size;
    // this.directionalLight.shadow.camera.bottom = -size;
    // this.directionalLight.shadow.mapSize.width = SHADOW_MAP_WIDTH;
    // this.directionalLight.shadow.mapSize.height = SHADOW_MAP_HEIGHT;

    

    this.world = new MakerJS.World(this);
    // this.lods = new MakerJS.LODs(this);    //world 里面的lod一同注释掉了,暂时不需要lod
   
    this.effects = new MakerJS.Effects(this);
    this.blooms = new MakerJS.Bloom(this);
    this.nodeSelection = new MakerJS.NodeSelection(this);
    //过滤模型
    this.FilterMesh=new MakerJS.FilterMesh(this);

    // 环境贴图
    this.scene.background = new THREE.CubeTextureLoader()
        .setPath('textures/skybox1/')
        .load(['PX.jpg', 'NX.jpg', 'PY.jpg', 'NY.jpg', 'PZ.jpg', 'NZ.jpg']);

    this.world.addEventListener('loadEnd', function (event) {

        // Public_Engine.focusWorld(true);
        // if (scope.world.world_name == "morenshitu") {
        //     // scope.controls.target0.set(154.07286071777344, 117.0617904663086, 50);
        //     // scope.controls.target0.set(0, 100, 50);

        //     scope.controls.reset();
        // }
        // else if (scope.world.world_name == "jijianguan") {
        //     var objs = scope.helper.getObjectsByName("网格");
        //     if (objs.length > 0) {
        //         var center = scope.helper.getWorldCenter(objs[0]);
        //         scope.controls.target0.set(center.x, center.y, center.z);
        //         scope.controls.reset();
        //     }
        // }
        // else if (scope.world.world_name == "jiudian") {
        //     var objs = scope.helper.getObjectsByName("酒店01");
        //     if (objs.length > 0) {
        //         var center = scope.helper.getWorldCenter(objs[0]);
        //         scope.controls.target0.set(center.x, center.y, center.z);
        //         scope.controls.reset();
        //     }
        // }
    });

};


MakerJS.Engine.prototype = Object.create(THREE.EventDispatcher.prototype);
MakerJS.Engine.prototype.constructor = MakerJS.Engine;

// 清除场景
MakerJS.Engine.prototype.clear = function () {
    this.renderer.dispose();
    this.scene.dispose();
    this.world.clear();
    this.clearScene();
    // Public_Engine = null;
};


MakerJS.Engine.prototype.requestFrame = function () {
    this.renderEnabled = true;

    if (this.renderTimeout) { // 清除计时器
        clearTimeout(this.renderTimeout);
    }

    if (!this.realtime) {
        var scope = this;
        // 请求式渲染 - 延迟渲染1.5秒
        this.renderTimeout = setTimeout(function () {
            scope.renderEnabled = false;
        }, 1500);
    }
};


MakerJS.Engine.prototype.setRealtime = function (v) {
    this.realtime = v;
    this.requestFrame();
};

MakerJS.Engine.prototype.addPass = function (pass) {
    if (pass == undefined) return;

    var id = this.composer.passes.indexOf(pass);
    if (id == -1) {
        this.composer.addPass(pass);
    }
};

MakerJS.Engine.prototype.removePass = function (pass) {
    if (pass == undefined) return;

    var id = this.composer.passes.indexOf(pass);
    if (id != -1) {
        this.composer.passes.splice(id, 1);
    }
};

MakerJS.Engine.prototype.setTAA = function (value, level) {
    this.taaRenderPass.enabled = value;
    this.renderPass.enabled = !this.taaRenderPass.enabled;
    if (level) this.taaRenderPass.sampleLevel = level;
};

MakerJS.Engine.prototype.setAmbientOcclusion = function (e) {

    if (e) {
        var width = window.innerWidth;
        var height = window.innerHeight;
        var scope = this;

        this.camera.far = 700;
        this.camera.updateProjectionMatrix();

        if (this.aoPass == undefined) {
            this.aoPass = new THREE.SAOPass(this.scene, this.camera, false, true);

            this.aoPass.params.saoIntensity = 0.06;
            this.aoPass.params.saoScale = 1.2;
            this.aoPass.params.saoKernelRadius = 25;

            this.ambientLight.color.setHex(0xEEF4FC);
        }
        this.addPass(this.aoPass);


    } else {
        this.camera.far = 10000;
        this.camera.updateProjectionMatrix();

        this.removePass(this.aoPass);
    }
};

MakerJS.Engine.prototype.clearScene = function (begin, end) {
    let scope = this;
    var scene = scope.scene;
    var _idx = scene.children.length - 1;
    if (!begin && !end) {
        begin = 0;
        end = _idx
    }

    // 删除group，释放内存
    function deleteObject(group) {
        if (!group) return;

        let children = group.children;
        for (let i in children) {
            deleteObject(children[i]);
        }

        // 删除掉所有的模型组内的mesh
        group.traverse(function (item) {

            // 删除几何体
            if (item.geometry) {
                item.geometry.dispose();
            }

            // 删除材质
            if (item.material) {
                if (Array.isArray(item.material)) {
                    for (var i in item.material) {
                        item.material[i].dispose();
                    }
                } else {
                    item.material.dispose();
                }
            }
        });
    }

    for (var i = end; i > begin; i--) {
        let child = scene.children[i];
        if (child.userData.constant == undefined) {
            // deleteObject(child);
            // scene.remove(child);
        }
    }
}

MakerJS.Engine.prototype.load = function (file, merge, callback) {

    var scope = this;
    this.clearScene();
    this.world.clear();
    this.clear();

    scope.needReset = true;

    var loader = new MakerJS.FileLoader(file);

    function _do_parse(filecontent, filename) {

        var index1 = filename.lastIndexOf(".");
        var index2 = filename.length;
        var postf = filename.substring(index1, index2);

        if (postf == '.world') {
            scope.world.load(filecontent, filename, merge);
        } else if (postf == '.mesh') {
            // var mesh_loader = new MakerJS.Mesh();
            // mesh_loader.addEventListener('load', function(event) {
            //     // async loaded, process geometry
            //     var mesh = event.content;
            //     var num_surfaces = mesh.surfaces.length;
            //     for (var j = 0; j < num_surfaces; j++) {
            //         var m = new THREE.Mesh(mesh.surfaces[j].geometry, new THREE.MeshPhongMaterial({ side: 1, shininess: 31, color: 0xFFFF00 }));
            //         scope.scene.add(m);
            //     }
            // });
            // mesh_loader.load(filename);
        }
    }

    var scene = scope.scene;
    var _idx = scene.children.length - 1;
    
    //p 文本内容
    loader.load(function (p) {
        _do_parse(p, file);
        // console.log(p)
        if (callback) callback();
         //加载
        console.log('load： ' + file);
    });


    this.clearScene(0, _idx);
};

MakerJS.Engine.prototype.getMqtt=function(){
    var client = mqtt.connect("mqtt://www.vrmaker.com.cn:61614/mqtt",{
			username: 'vrmaker',
  			password: 'vrmaker',
		});

		client.on("connect", function () {
			console.log("connected。。。。");
			client.subscribe("changhua/get/#");
		});

		// client.on("message", function (topic, message) {
		// 	if(!/Room/.test(topic)) return
		// 	// if(/Humi_VAL|CO2_VAL|Temp_VAL/.test(topic)) return
		// 	// if(/InfraredMov1_Alarm/.test(topic)) return
		// 	message = message.toString();
		// 	// console.log(topic.substring(13) + ":" + message);
		// 	// if (/\"SwitchOn\": \d/.test(message)) {
		// 	// 	value = message.match(/\"SwitchOn\": \d/)[0].match(/\d/)[0];
		// 	// 	// console.log(topic+":  "+value)
		// 	// } else if (Number(message) !== NaN) {
		// 	// 	// console.log(topic+":  "+message)
		// 	// } else console.log(topic + ":  " + message);
        // });
        return client;
}

MakerJS.Engine.prototype.animateCamera = function(oldP, oldT, newP, newT, span = 3000, callBack) {
    var scope = this;
    var tween = new TWEEN.Tween({
        x1: oldP.x, // 相机x
        y1: oldP.y, // 相机y
        z1: oldP.z, // 相机z
        x2: oldT.x, // 控制点的中心点x
        y2: oldT.y, // 控制点的中心点y
        z2: oldT.z // 控制点的中心点z
    });
    tween.to({
        x1: newP.x,
        y1: newP.y,
        z1: newP.z,
        x2: newT.x,
        y2: newT.y,
        z2: newT.z
    }, span);
    tween.onUpdate(function(object) {
        scope.controls.position0.x = object.x1;
        scope.controls.position0.y = object.y1;
        scope.controls.position0.z = object.z1;
        scope.controls.target0.x = object.x2;
        scope.controls.target0.y = object.y2;
        scope.controls.target0.z = object.z2;
        scope.controls.update();
        scope.controls.reset();
    })
    tween.onComplete(function() {
        scope.controls.enabled = true;
        callBack && callBack()
    })
    tween.easing(TWEEN.Easing.Cubic.InOut);
    tween.start();
    this.addEventListener("update", function() {
        TWEEN.update();
    })
}

