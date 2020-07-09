MakerJS.FieldTips = function (engine) {
    this.engine = engine;
    this.enable = false;
    var _this=this;

    this.engine.cssScene = new THREE.Scene();
    this.engine.cssRenderer = new THREE.CSS3DRenderer();

    this.engine.cssRenderer.setSize(window.innerWidth, window.innerHeight);
    this.engine.cssRenderer.domElement.style.position = 'absolute';
    this.engine.cssRenderer.domElement.style.top = 0;
    this.engine.cssRenderer.domElement.id = "CSSRenderer";
    // console.log(this.engine.cssRenderer.domElement);
    document.getElementById("MakerJS").appendChild(this.engine.cssRenderer.domElement);  //幕布整合
    this.engine.addEventListener("update", function () {
       _this.engine.cssRenderer.render(  _this.engine.cssScene,  _this.engine.camera );
    });

}
MakerJS.FieldTips.prototype = {

    constructor: MakerJS.FieldTips,
    render: function () {
        this.engine.cssRenderer.render(this.engine.cssScene, this.engine.camera);
    },
    clear : function(){
        document.getElementById("MakerJS").removeChild(document.getElementById("CSSRenderer"))
        this.engine.cssRenderer.domElement.style.position = 'absolute';
        this.engine.cssRenderer.domElement.style.top = 0;
        this.engine.cssRenderer.domElement.id = "CSSRenderer";
        document.getElementById("MakerJS").appendChild(this.engine.cssRenderer.domElement);  //幕布整合
        // console.log(this.engine.cssRenderer.domElement.childNodes[0])
        this.engine.cssRenderer.domElement.childNodes[0].innerHTML = "";
        // this.engine.cssRenderer.domElement.innerHTML = ""
        this.engine.cssScene.children = [];
    },
    setSize: function (width, height) {
        //bloom
        this.engine.cssRenderer.setSize(width, height);
    },

    cssInfoRender: function (firstVec3, secondVec3, element , name) {
        var tipPalne;

        // if (!this.enable) return;
        //new THREE.Vector3(x, y, z)
        var tipPalne = new THREE.CSS3DObject(element);   //div转换
        tipPalne.position.x = secondVec3.x;
        tipPalne.position.y = secondVec3.y;
        tipPalne.position.z = secondVec3.z;
        this.engine.cssScene.add(tipPalne);
        tipPalne.scale.set(0.05, 0.05, 0.05);  //整体缩小，谷歌浏览器字体最小为12px
        tipPalne.name = name;

        var pointarr = [firstVec3,secondVec3]
        var pipeSpline = new THREE.CatmullRomCurve3(pointarr);
        let r =  1;
        // if(path.index == 0) r = 0.1;
        var tubeGeometry = new THREE.TubeGeometry(pipeSpline, 128, r * 0.05, 16, false);
        var textureLoader = new THREE.TextureLoader();
        var texture = textureLoader.load('../textures/halfYellow.png');
        texture.wrapS = THREE.RepeatWrapping;
        texture.wrapT = THREE.RepeatWrapping;
        let repeatx = 1;
        texture.repeat.x = repeatx;
        var tubeMaterial = new THREE.MeshPhongMaterial({ 
            map: texture, 
            transparent: true, 
            emissive :  0x0033ff,
            emissiveIntensity : 10,
            depthTest: false,
            color : 0x0033ff
        });  //这种材质需要添加光照,光照侧才会显示
        var tube = new THREE.Mesh(tubeGeometry, tubeMaterial);
        this.engine.scene.add(tube);
        tube.name = "path_animation";
        this.engine.blooms.addBloomObjects(tube)
        this.engine.addEventListener("update", function () {
            // texture.offset.x -= 0.02;
        });

        //起点小球
        var geometryP = new THREE.SphereGeometry(0.3, 16, 16);   //球体半径，水平分段数，垂直分段数
        var materialP = new THREE.MeshBasicMaterial({ color: 0xffff00, side: THREE.DoubleSide });
        var firstSphere = new THREE.Mesh(geometryP, materialP);
        firstSphere.position.set(firstVec3.x, firstVec3.y, firstVec3.z);
        // console.log(firstSphere);
        firstSphere.name = name;
        this.engine.scene.add(firstSphere);  //起点小球
        let scope = this;
        this.engine.addEventListener("update", function () {
            tipPalne.rotation.x = scope.engine.camera.rotation.x;
            tipPalne.rotation.y = scope.engine.camera.rotation.y;
            tipPalne.rotation.z = scope.engine.camera.rotation.z;
        });
        var lineInstance={line:tube,point:firstSphere,plane:tipPalne}
        return lineInstance
    },
    cssInfoRenderLink: function (firstVec3, secondVec3, element) {
        var tipPalne;

        // if (!this.enable) return;
        var tipPalne = new THREE.CSS3DObject(element);   //div转换
        tipPalne.position.x = secondVec3.x;
        tipPalne.position.y = secondVec3.y;
        tipPalne.position.z = secondVec3.z;
        tipPalne.name = name;
        this.engine.cssScene.add(tipPalne);
        tipPalne.scale.set(0.05, 0.05, 0.05);  //整体缩小，谷歌浏览器字体最小为12px

        //画线
        var deltaX = secondVec3.x - firstVec3.x;
        var turnPoint = new THREE.Vector3(firstVec3.x + deltaX / 2, firstVec3.y, firstVec3.z);  //1、2点高度一致

        var positions = [];
        positions.push(firstVec3.x, firstVec3.y, firstVec3.z);
        positions.push(turnPoint.x, turnPoint.y, turnPoint.z);
        positions.push(secondVec3.x, secondVec3.y, secondVec3.z);

        var Lgeometry = new THREE.LineGeometry();
        Lgeometry.setPositions(positions);
        var matLine = new THREE.LineMaterial({
            color: 0xffffff,
            linewidth: 2, // in pixels
            dashed: false,
            transparent: true,
            opacity: 0.5
        });
        matLine.resolution.set(window.innerWidth, window.innerHeight); // resolution of the viewport
        var line = new THREE.Line2(Lgeometry, matLine);
        line.computeLineDistances();
        line.scale.set(1, 1, 1);
        line.name = name;
        this.engine.scene.add(line);

        //起点小球
        var geometryP = new THREE.SphereGeometry(0.3, 16, 16);   //球体半径，水平分段数，垂直分段数
        var materialP = new THREE.MeshBasicMaterial({ color: 0xffff00, side: THREE.DoubleSide });
        var firstSphere = new THREE.Mesh(geometryP, materialP);
        firstSphere.position.set(firstVec3.x, firstVec3.y, firstVec3.z);
        // console.log(firstSphere);
        firstSphere.name = name;
        this.engine.scene.add(firstSphere);  //起点小球
        let scope = this;
        this.engine.addEventListener("update", function () {
            tipPalne.rotation.x = scope.engine.camera.rotation.x;
            tipPalne.rotation.y = scope.engine.camera.rotation.y;
            tipPalne.rotation.z = scope.engine.camera.rotation.z;
        });
    },

    cssInfoRenderPanel: function(pos, element) {
        var tipplane = new THREE.CSS3DObject(element);
        tipplane.position.x = pos.x;
        tipplane.position.y = pos.y;
        tipplane.position.z = pos.z;
        tipplane.name = name;
        this.engine.cssScene.add(tipplane);
        tipplane.scale.set(0.05, 0.05, 0.05);  
    },
    cssInfoRenderLink2: function (firstVec3, secondVec3, element, scale) {
        var tipPalne;

        // if (!this.enable) return;
        var tipPalne = new THREE.CSS3DObject(element);   //div转换
        tipPalne.position.x = secondVec3.x;
        tipPalne.position.y = secondVec3.y;
        tipPalne.position.z = secondVec3.z;
        tipPalne.name = name;
        
        this.engine.cssScene.add(tipPalne);
        tipPalne.scale.set(scale, scale, scale);  //整体缩小，谷歌浏览器字体最小为12px


        //画线
        var deltaX = secondVec3.x - firstVec3.x;
        var turnPoint = new THREE.Vector3(firstVec3.x + deltaX / 2, firstVec3.y, firstVec3.z);  //1、2点高度一致

        var positions = [];
        positions.push(firstVec3.x, firstVec3.y, firstVec3.z);
        positions.push(turnPoint.x, turnPoint.y, turnPoint.z);
        positions.push(secondVec3.x, secondVec3.y, secondVec3.z);

        var Lgeometry = new THREE.LineGeometry();
        Lgeometry.setPositions(positions);
        var matLine = new THREE.LineMaterial({
            color: 0xffffff,
            linewidth: 2, // in pixels
            dashed: false,
            transparent: true,
            opacity: 0.5
        });
        matLine.resolution.set(window.innerWidth, window.innerHeight); // resolution of the viewport
        var line = new THREE.Line2(Lgeometry, matLine);
        line.computeLineDistances();
        line.scale.set(1, 1, 1);
        line.name = name;
        this.engine.scene.add(line);
        Lgeometry.dispose();
        matLine.dispose();
        //起点小球
        var geometryP = new THREE.SphereGeometry(0.3, 16, 16);   //球体半径，水平分段数，垂直分段数
        var materialP = new THREE.MeshBasicMaterial({ color: 0xffff00, side: THREE.DoubleSide });
        var firstSphere = new THREE.Mesh(geometryP, materialP);
        firstSphere.position.set(firstVec3.x, firstVec3.y, firstVec3.z);
        firstSphere.scale.set(10*scale, 10*scale, 10*scale);
        // console.log(firstSphere);
        firstSphere.name = name;
        this.engine.scene.add(firstSphere);  //起点小球
        geometryP.dispose();
        materialP.dispose();
        let scope = this;
        this.engine.addEventListener("update", function () {
            tipPalne.rotation.x = scope.engine.camera.rotation.x;
            tipPalne.rotation.y = scope.engine.camera.rotation.y;
            tipPalne.rotation.z = scope.engine.camera.rotation.z;
        });

    },



}