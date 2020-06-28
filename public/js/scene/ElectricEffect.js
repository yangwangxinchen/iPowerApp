MakerJS.ElectricEffect=function(engine){
this.engine=engine

}

//电力走向
// var ele = [];
MakerJS.ElectricEffect.prototype.electricPower = function (dir, repeatx) {
    var scope =this.engine;
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
            // ele.push(outCube);

            scope.addEventListener("update", function () {
                texture.offset.x -= 0.02;
            });

        });
        var s = dir + "/电流" + ".PATH";
        //console.log(s)
        electric_loader.load(s);
    }
}


