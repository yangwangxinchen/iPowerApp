
MakerJS.xmlPath=function(engine){

    //path    "../mesh/path/line.xml"
    this.parseXML=function(path){
        if (window.XMLHttpRequest)
        {// code for IE7+, Firefox, Chrome, Opera, Safari
        xmlhttp=new XMLHttpRequest();
        //  console.log(xmlhttp)
        }
        xmlhttp.open("GET",path,false);
        xmlhttp.send();
        xmlDoc=xmlhttp.responseXML;
        // console.log(xmlDoc)
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
            // console.log(pointvec3)
            pointarr.push(pointvec3);
            if(i==geometry.vertices.length-1){
                var x=  parseFloat(geometry.vertices[0].x)
                var y=  parseFloat(geometry.vertices[0].y)
                var z=  parseFloat(geometry.vertices[0].z)
                // var pointvec3 = new THREE.Vector3(x, y, z);
            }
            // pointarr.push(pointvec3);

        }
        // console.log(pointarr)
    
    /*
        TubeGeometry(path : Curve, tubularSegments : Integer, radius : Float, radialSegments : Integer, closed : Boolean)
        path — Curve - 一个由基类Curve继承而来的路径。
        tubularSegments — Integer - 组成这一管道的分段数，默认值为64。
        radius — Float - 管道的半径，默认值为1。
        radialSegments — Integer - 管道横截面的分段数目，默认值为8。
        closed — Boolean 管道的两端是否闭合，默认值为false。
    */
        var pipeSpline = new THREE.CatmullRomCurve3(pointarr);
        var tubeGeometry = new THREE.TubeGeometry(pipeSpline, 128, 10, 16, true);
        var textureLoader = new THREE.TextureLoader();
        var texture = textureLoader.load('../textures/' +'halfYellow' + '.png');
                texture.wrapS = THREE.RepeatWrapping;
                texture.wrapT = THREE.RepeatWrapping;
                texture.repeat.x = 100;
                var tubeMaterial = new THREE.MeshPhongMaterial({
                    // map: texture,
                    // transparent: true,
                    // emissive: 0x0033ff,
                    // emissiveIntensity: 10,
                    // depthTest: false,
                    color: '#4169E1'
                }); 
                var tube = new THREE.Mesh(tubeGeometry, tubeMaterial);
                // tube.scale.set(0.1,0.1,0.1)
                var outGeo = new THREE.TubeGeometry(pipeSpline, 128, 10, 16, true);
                var outMaterial = new THREE.MeshBasicMaterial({ color: '#4169E1', transparent: true, opacity: 0.15 });
                var outCube = new THREE.Mesh(outGeo, outMaterial);
                outCube.scale.set(0.1,0.1,0.1)
                outCube.position.set(0,0,-140)
                engine.scene.add(outCube);
                outCube.add(tube);
                var lineMat= new THREE.LineBasicMaterial({
                    color: '#4169E1'  ,      //#B0C4DE
                    linewidth: 1,
                    opacity: 0.25,
                    transparent: true,
                });
                // engine.effects.addEdgesObject(outCube,lineMat)
                // engine.blooms.setEnable(true)
                engine.blooms.addBloomObjects(tube)
                engine.addEventListener("update", function () {
                    // texture.offset.x -= 0.02;
                });
    }


}

