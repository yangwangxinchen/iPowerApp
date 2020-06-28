
MakerJS.xmlPath=function(engine){

    parseXML();
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
          
            // console.log(pointvec3)
            pointarr.push(pointvec3);
        }
        console.log(pointarr)
    
    
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


}

