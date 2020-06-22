
MakerJS.Effects = function (engine) {
    this.engine = engine;

    var params = {
        edgeStrength: 5,
        edgeGlow: 0.5,  
        edgeThickness: 1,
        pulsePeriod: 0,
        usePatternTexture: false
    };

    var clearParams={
        edgeStrength: 0,
        edgeGlow: 0,  
        edgeThickness: 0,
        pulsePeriod: 0,
        usePatternTexture: false
    }

    this.outlinePass = new THREE.OutlinePass(new THREE.Vector2(window.innerWidth, window.innerHeight), this.engine.scene, this.engine.camera);
    this.outlinePass.visibleEdgeColor.set("#00F");    
    this.outlinePass.hiddenEdgeColor.set("#00F"); //遮挡处颜色

    // console.log("外轮廓:"+this.outlinePass)

    this.outlinePass.edgeStrength = Number(params.edgeStrength);
    this.outlinePass.edgeGlow = Number(params.edgeGlow);
    this.outlinePass.edgeThickness = Number(params.edgeThickness);
    this.outlinePass.pulsePeriod = Number(params.pulsePeriod);
    this.outlinePass.usePatternTexture = Number(params.usePatternTexture);

    // var scope = this;
    // var onLoad = function (texture) {
    //     scope.outlinePass.patternTexture = texture;
    //     texture.wrapS = THREE.RepeatWrapping;
    //     texture.wrapT = THREE.RepeatWrapping;
    // };
    // var loader = new THREE.TextureLoader();
    // loader.load('textures/tri_pattern.jpg', onLoad);

    this.outlinePass.enabled = false;
    this.engine.addPass(this.outlinePass);
    
    this.line_material = new THREE.LineBasicMaterial({
        color: "#000" ,        //#B0C4DE
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

    // this.solids = [];
    this.lines = [];
    this.aloneLines=[];

    this.wireframe_material = new THREE.MeshBasicMaterial({
        color:  "#FFF",        //0xff6600,
        polygonOffset: true,
        polygonOffsetFactor: 1, // positive value pushes polygon further away
        polygonOffsetUnits: 1,
        depthTest: true,
        opacity: 0.5,
        transparent: true,
        wireframe:true,
    });
    
    //选中物体的颜色
    this.solid_material = new THREE.MeshBasicMaterial({
        color: 0x87cefa,
        polygonOffset: true,
        polygonOffsetFactor: 1, // positive value pushes polygon further away
        polygonOffsetUnits: 1,
        depthTest: true,
        opacity: 0.7,
        transparent: true,
    });

    //虚化物体的颜色
    this.unreal_material = new THREE.MeshBasicMaterial({
        color: 0x778899,
        depthTest: true,
        opacity: 0.2,
        transparent: true,
        });

}

MakerJS.Effects.prototype = {

    constructor: MakerJS.Effects,
    
    setOutlineObjects : function (objects) {

        this.outlinePass.selectedObjects = objects;
        this.outlinePass.enabled = objects.length > 0;
        this.engine.requestFrame();
    },
   
    setWireframeObjects: function (objects, wireframe_material) {

        if(this.wireframes){
            for(var i in this.wireframes){
                this.wireframes[i].parent.children.pop();
            }
        }


        this.wireframes = [];
        let material = wireframe_material || this.wireframe_material;

        for(var i in objects)
        {
            if (objects[i] instanceof THREE.Mesh)
            {
                var wireframe = new THREE.Mesh(objects[i].geometry,this.wireframe_material);
                objects[i].add(wireframe);
                this.wireframes.push(wireframe);
            }
        }
        this.engine.requestFrame();
    },

    setSolidObjects: function (objects,solid_material) {
        //先清理掉上一帧的缓存数据
        if(this.solids){
            for(var i in this.solids){
                var s = this.solids[i].parent.children.pop();
                if(s.geometry) s.geometry.dispose();
                // this.solids[i].geometry.dispose();
                // this.solids[i].parent.children.pop();
            }
           
        }

        this.solids = [];
        let material = solid_material || this.solid_material;
        //更新当前选中的物体
        for(var i in objects)
        {
            if (objects[i] instanceof THREE.Mesh)
            {
                var solid = new THREE.Mesh(objects[i].geometry,this.solid_material);
                objects[i].add(solid);
                this.solids.push(solid);
            }
        }
        console.log("实体:"+objects.length)
        this.engine.requestFrame();
    },

    setEdgesObjects : function (objects, line_material) {

        for(var i in this.lines){
            this.lines[i].geometry.dispose();
            this.lines[i].parent.children.pop();
        }

        this.lines = [];
        let material = line_material || this.line_material;

        for(var i in objects)
        {
            if (objects[i] instanceof THREE.Mesh)
            {
                var wireframe = new THREE.EdgesGeometry(objects[i].geometry); //WireframeGeometry
                wireframe.boundingBox = objects[i].geometry.boundingBox;
                wireframe.boundingSphere = objects[i].geometry.boundingSphere;
                var line = new THREE.LineSegments(wireframe, material);
                objects[i].add(line);
                this.lines.push(line);
            }
        }
        this.engine.requestFrame();
    },

   
    addEdgesObject:function(object,line_material){
        let material = line_material || this.line_material;
        if(object instanceof THREE.Mesh){
        var wireframe = new THREE.EdgesGeometry(object.geometry);
        var line = new THREE.LineSegments(wireframe, material);
        object.add(line);
        this.aloneLines.push(line)
       }

    },

    removeEdgesObject:function(){
     for(var i in this.aloneLines){
         this.aloneLines[i].geometry.dispose();
         this.aloneLines[i].parent.children.pop();
     }
     this.aloneLines=[]

    },

    //虚化物体
    unrealObject:function(object,line_material){
    let material = line_material || this.line_material;
    if(object instanceof THREE.Mesh){
        this.addEdgesObject(object,material);
        object.material=this.unreal_material;
    }

}
    
}
