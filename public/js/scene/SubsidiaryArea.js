/* 园区边界*/
MakerJS.SubsidiaryArea = function(engine) {

    this.engine = engine;

    this.showGrid = function(){

        var gridHelper = new THREE.GridHelper( 2000, 100  );
        gridHelper.rotateX(Math.PI * 90/180);
        this.engine.scene.add( gridHelper );
    }

    this.showSubsidiary = function(file,lineStyle,w,h)
    {
            // path
            this.path_loader = new MakerJS.Path();
            var engine = this.engine;

            this.path_loader.addEventListener('load', function (event) {

                var path = event.content;
                var geometry = path.geometry;
                var geo = new THREE.LineGeometry();
                // var geo=new THREE.Geometry();
                var pointarr = [];

                for(var i = 0; i < geometry.vertices.length; i++)
                {
                    pointarr.push(geometry.vertices[i].x);
                    pointarr.push(geometry.vertices[i].y);
                    pointarr.push(geometry.vertices[i].z);
                    if(i == geometry.vertices.length - 1){
                        pointarr.push(geometry.vertices[0].x);
                        pointarr.push(geometry.vertices[0].y);
                        pointarr.push(geometry.vertices[0].z);
                    }
                }
                // console.log(pointarr)
                geo.setPositions(pointarr);
                // geo.setFromPoints (pointarr)

                var materials = [];
                
                for(var i in lineStyle)
                {
                    var m = new THREE.LineMaterial({color: lineStyle[i].color, linewidth: 1});
                    if(lineStyle[i].width) m.linewidth = lineStyle[i].width;
                    if(lineStyle[i].transparent) m.transparent = lineStyle[i].transparent;
                    materials.push(m);
                }

                for(var i in materials)
                {
                    materials[i].resolution.set(window.innerWidth, window.innerHeight);
                }

                var numFloors = 1;
                for(var i = 0; i < numFloors; i++) 
                {
                    var floorline = new THREE.Line2(geo, materials[i % materials.length]);
                    floorline.translateZ(39.241 * i);

                    //线发光
                    //engine.blooms.addBloomObjects(floorline);
                    // floorline.visible = false;

                    // //文字
                    // var gem = new THREE.TextGeometry((i+1).toString() + " F", {
                    //    // font: this.engine.font,
                    //     size: 100,
                    //     height: 5,
                    //     curveSegments: 12,
                    //     bevelEnabled: true,
                    //     bevelThickness: 0.5,
                    //     bevelSize: 5,
                    //     bevelSegments: 5
                    // });

                    // gem.center();
                    // var mat = new THREE.MeshPhongMaterial({
                    //     color: 0xc9e4ff, //0xfdfdfc, //0x149ddf,//0xc9ffff,
                    //     //specular: 0x009900,
                    //     shininess: 30,
                    //     flatShading: true
                    // });
            
                    // var textObj = new THREE.Mesh(gem, mat);
                    // gem.dispose();
                    // textObj.rotateX(Math.PI * 90/180);
                    // var s = 0.03;
                    // textObj.scale.set(s, s, s);
                    // textObj.position.set(70,0,3.5); //左侧
                    // textObj.name = (i + 1).toString();
                    // floorline.add(textObj);
                    // textObj.userData.selectSource = textObj;
                    // //  scope.floorlines.push(floorline);

                    //console.log(floorline)
                    //floorline.scale.set(10,10,10)

                    engine.scene.add(floorline);
                }
                //geo.dispose();

            });

         this.path_loader.load(file);
    }
}

MakerJS.SubsidiaryArea.prototype = Object.create(THREE.EventDispatcher.prototype);
