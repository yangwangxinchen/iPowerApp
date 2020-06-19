MakerJS.Bloom = function(engine) {
    this.engine = engine;
    this.enable = false;

    var params = {
        exposure: 0.8,    //0.8
        bloomStrength: 1,    //1.2
        bloomThreshold: 0,
        bloomRadius: 0,
        scene: "Scene with Glow"
    };

    // bloom
    this.BLOOM_SCENE = 1;

    var darkMaterial = new THREE.MeshBasicMaterial({ color: "black" });
    var materials = {};

    var bloomLayer = new THREE.Layers();
    bloomLayer.set(this.BLOOM_SCENE);

    this.darkenNonBloomed = function(obj) {
        if (obj.isMesh && bloomLayer.test(obj.layers) === false) {
            materials[obj.uuid] = obj.material;
            obj.material = darkMaterial;
        }
    }

    this.restoreMaterial = function(obj) {
        if (materials[obj.uuid]) {
            obj.material = materials[obj.uuid];
            delete materials[obj.uuid];
        }
    }

    //创建 bloomPass
    var bloomPass = new THREE.UnrealBloomPass(new THREE.Vector2(window.innerWidth, window.innerHeight), 1.5, 0.4, 0.85);
    bloomPass.threshold = params.bloomThreshold;
    bloomPass.strength = params.bloomStrength;
    bloomPass.radius = params.bloomRadius;
    //创建 RenderPass
    var renderScene = new THREE.RenderPass(this.engine.scene, this.engine.camera);
    //创建 EffectComposer
    this.bloomComposer = new THREE.EffectComposer(this.engine.renderer);
    this.bloomComposer.renderToScreen = false;
    this.bloomComposer.addPass(renderScene);
    // 眩光通道bloomPass插入到composer
    this.bloomComposer.addPass(bloomPass);
    
    this.finalPass = new THREE.ShaderPass(
        new THREE.ShaderMaterial({
            uniforms: {
                baseTexture: { value: null },
                bloomTexture: { value: this.bloomComposer.renderTarget2.texture }
            },
            vertexShader: THREE.BloomShader.vertexShader,
            fragmentShader: THREE.BloomShader.fragmentShader,
            defines: {}
        }), "baseTexture"
    );
    this.finalPass.needsSwap = true;

    this.black = new THREE.Color(0x000000);
}

MakerJS.Bloom.prototype = {

    constructor: MakerJS.Bloom,

    setSize: function(width, height) {
        //bloom
        this.bloomComposer.setSize(width, height);
    },

    setEnable: function(value) {
        if (this.enable == value) return;
        // console.log("value",value)
        if(value)
        {
            this.engine.addPass(this.finalPass);
        }
        else 
        {
            this.engine.removePass(this.finalPass);
        }
        this.enable = value;
    },

    render: function() {
        if (!this.enable) return;

        var bg = this.engine.scene.background;
        this.engine.scene.background = this.black;
        this.engine.scene.traverse(this.darkenNonBloomed);
        this.bloomComposer.render();
        this.engine.scene.traverse(this.restoreMaterial);
        this.engine.scene.background = bg;
    },

    // 添加需要Bloom的物体
    addBloomObjects: function(objects) {
        if (objects.length > 0) {
            for (i = 0; i < objects.length; i++) {
                objects[i].layers.enable(this.BLOOM_SCENE);
            }
        } else {
            
            objects.layers.enable(this.BLOOM_SCENE);
        }
        // console.log('addBloomObjects')
    },

    // 移除不需要Bloom的物体
    removeBloomObjects: function(objects) {
        if (objects.length > 0) {
            for (i = 0; i < objects.length; i++) {
                objects[i].layers.disable(this.BLOOM_SCENE);
            }
        } else {
            objects.layers.disable(this.BLOOM_SCENE);
        }
    },
}
