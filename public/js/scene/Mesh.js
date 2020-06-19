MakerJS.Mesh = function() {
    this.url = "";
    this.bound_box = null;
    this.bound_sphere = null;
    this.surfaces = null;
    this.bones = null;
    this.animations = null;
};

MakerJS.Mesh.prototype = {

    constructor: MakerJS.Mesh,

    compuateVertexNormals: function(i) {
        var surface = this.surfaces[i];

        if (surface.normals) return surface.normals;

        var num_vertex = surface.vertex.length / 3;
        var normals = new Float32Array(surface.vertex.length);
        for (var j = 0; j < num_vertex; j++) {
            //切线转法线

            var tangent_x = surface.tangents[j * 4];
            var tangent_y = surface.tangents[j * 4 + 1];
            var tangent_z = surface.tangents[j * 4 + 2];
            var tangent_w = surface.tangents[j * 4 + 3];

            var x2 = tangent_x * 2.0;
            var y2 = tangent_y * 2.0;
            var z2 = tangent_z * 2.0;
            var xx2 = tangent_x * x2;
            var yy2 = tangent_y * y2;
            var yz2 = tangent_y * z2;
            var zx2 = tangent_z * x2;
            var wx2 = tangent_w * x2;
            var wy2 = tangent_w * y2;

            normals[j * 3] = zx2 + wy2;
            normals[j * 3 + 1] = yz2 - wx2;
            normals[j * 3 + 2] = 1.0 - xx2 - yy2;
        }
        surface.normals = normals;
        return surface.normals;
    },

    loadBufferGeometry: function(geometry, asGroups) {
        if (this.surfaces.length > 1) {
            this.mergeSurfaces(geometry, this.surfaces, asGroups);
        } else {
            if (this.surfaces[0].uv) geometry.addAttribute('uv', new THREE.BufferAttribute(this.surfaces[0].uv, 2));
            geometry.addAttribute("position", new THREE.BufferAttribute(this.surfaces[0].vertex, 3));
            geometry.addAttribute('normal', new THREE.BufferAttribute(this.compuateVertexNormals(0), 3));
            geometry.setIndex(new THREE.BufferAttribute(this.surfaces[0].indices, 1));
        }

        geometry.boundingBox = this.bound_box;
        geometry.boundingSphere = this.bound_sphere;
    },

    loadGeometry: function(geometry, asGroups) {

        if (geometry instanceof THREE.BufferGeometry) {
            return this.loadBufferGeometry(geometry, asGroups);
        }

        for (var i in this.surfaces) {
            var surface = this.surfaces[i];
            this.compuateVertexNormals(i);

            for (var j = 0; j < surface.vertex.length / 3; j++) {
                geometry.vertices.push(new THREE.Vector3(surface.vertex[j * 3], surface.vertex[j * 3 + 1], surface.vertex[j * 3 + 2]));
            }

            geometry.faceVertexUvs[0] = [];

            for (var j = 0; j < surface.indices.length / 3; j++) {
                var v1 = surface.indices[j * 3];
                var v2 = surface.indices[j * 3 + 1];
                var v3 = surface.indices[j * 3 + 2];
                var vertexNormals = [
                    new THREE.Vector3(surface.normals[v1 * 3], surface.normals[v1 * 3 + 1], surface.normals[v1 * 3 + 2]),
                    new THREE.Vector3(surface.normals[v2 * 3], surface.normals[v2 * 3 + 1], surface.normals[v2 * 3 + 2]),
                    new THREE.Vector3(surface.normals[v3 * 3], surface.normals[v3 * 3 + 1], surface.normals[v3 * 3 + 2])
                ];

                geometry.faces.push(new THREE.Face3(v1, v2, v3, vertexNormals));
                geometry.faceVertexUvs[0].push(
                    [
                        new THREE.Vector2(surface.uv[v1 * 2], surface.uv[v1 * 2 + 1]),
                        new THREE.Vector2(surface.uv[v2 * 2], surface.uv[v2 * 2 + 1]),
                        new THREE.Vector2(surface.uv[v3 * 2], surface.uv[v3 * 2 + 1])
                    ]
                );
            }
        }

        geometry.boundingBox = this.bound_box;
        geometry.boudingSphere = this.bound_sphere;
    },

    mergeSurfaces: function(geometry, surfaces, asGroups) {

        if (surfaces == undefined || surfaces.length == 0) return;

        let posLen = 0;
        let indexLen = 0;
        let normLen = 0;
        let uvLen = 0;

        for (var j in surfaces) {
            posLen += surfaces[j].vertex.length;
            var normals = this.compuateVertexNormals(j);
            normLen += normals.length;
            if (surfaces[j].uv) {
                uvLen += surfaces[j].uv.length;
            }
            indexLen += surfaces[j].indices.length;
        }

        let sumIndexCursor = 0;
        let sumPosCursor = 0;
        let sumNormCursor = 0;
        let sumUVCursor = 0;

        var sumIndexArr = new Uint32Array(indexLen);
        var sumPosArr = new Float32Array(posLen);
        var sumNormArr = new Float32Array(normLen);
        var sumUVArr = new Float32Array(uvLen);

        var vector = new THREE.Vector3();

        for (var j in surfaces) {
            var surface = surfaces[j];

            for (var k = 0; k < surface.indices.length; k++) {
                sumIndexArr[k + sumIndexCursor] = sumPosCursor + surface.indices[k];
            }

            // mesh with mutiple surface materials
            if (asGroups) {
                // 材质可能还有问题
                geometry.groups.push({ start: sumIndexCursor, count: surface.indices.length, materialIndex: j });
            }

            sumIndexCursor += surface.indices.length;

            var num_vertex = surface.vertex.length / 3;
            var num_normals = surface.normals.length / 3;

            if (surface.transform) // 顶点作用矩阵
            {
                for (var k = 0; k < num_vertex; k++) {
                    vector.set(surface.vertex[3 * k], surface.vertex[3 * k + 1], surface.vertex[3 * k + 2]);
                    vector.applyMatrix4(surface.transform);

                    sumPosArr[3 * (sumPosCursor + k)] = vector.x;
                    sumPosArr[3 * (sumPosCursor + k) + 1] = vector.y;
                    sumPosArr[3 * (sumPosCursor + k) + 2] = vector.z;
                }

                for (var k = 0; k < num_normals; k++) {
                    vector.set(surface.normals[3 * k], surface.normals[3 * k + 1], surface.normals[3 * k + 2]);
                    vector.transformDirection(surface.transform);

                    sumNormArr[3 * (sumNormCursor + k)] = vector.x;
                    sumNormArr[3 * (sumNormCursor + k) + 1] = vector.y;
                    sumNormArr[3 * (sumNormCursor + k) + 2] = vector.z;
                }
            } else {
                for (var k = 0; k < num_vertex; k++) {
                    sumPosArr[3 * (sumPosCursor + k)] = surface.vertex[3 * k];
                    sumPosArr[3 * (sumPosCursor + k) + 1] = surface.vertex[3 * k + 1];
                    sumPosArr[3 * (sumPosCursor + k) + 2] = surface.vertex[3 * k + 2];
                }

                for (var k = 0; k < num_normals; k++) {
                    sumNormArr[3 * (sumNormCursor + k)] = surface.normals[3 * k];
                    sumNormArr[3 * (sumNormCursor + k) + 1] = surface.normals[3 * k + 1];
                    sumNormArr[3 * (sumNormCursor + k) + 2] = surface.normals[3 * k + 2];
                }
            }

            sumPosCursor += num_vertex;
            sumNormCursor += num_normals;

            if (surface.uv) {
                for (var k = 0; k < surface.uv.length; k++) {
                    sumUVArr[k + sumUVCursor] = surface.uv[k];
                }
                sumUVCursor += surface.uv.length;
            }
        }

        geometry.addAttribute('uv', new THREE.BufferAttribute(sumUVArr, 2));
        geometry.addAttribute("position", new THREE.BufferAttribute(sumPosArr, 3));
        geometry.addAttribute('normal', new THREE.BufferAttribute(sumNormArr, 3));
        geometry.setIndex(new THREE.BufferAttribute(sumIndexArr, 1));
    }
};

Object.assign(MakerJS.Mesh.prototype, THREE.EventDispatcher.prototype, {
    load: function(url, onLoad, onProgress, onError) {

        var scope = this;
        this.url = url;

        function load_mesh(data) {

            var reader = new MakerJS.StreamReader(data);

            function info_mesh() {
                // info_mesh
                var magic = reader.readInt();
                // need validation

                // bounds
                var min = reader.readVector3();
                var max = reader.readVector3();
                var center = reader.readVector3();
                var radius = reader.readFloat();

                scope.bound_box = new THREE.Box3(min, max);
                scope.bound_sphere = new THREE.Sphere(center, radius);

                // bones
                scope.bones = new Array(reader.readInt2());
                for (var i = 0; i < scope.bones.length; i++) {
                    var name = reader.readString2(); // 待实现
                    reader.seekCur(reader.readShort());
                }

                //animatons
                scope.animations = new Array(reader.readInt2());
                for (var i = 0; i < scope.animations.length; i++) {
                    var name = reader.readString2();
                }

                //surface
                scope.surfaces = new Array(reader.readInt2());
                for (var i = 0; i < scope.surfaces.length; i++) {

                    //surface name
                    var suface_name = reader.readString2();

                    //surface bounds
                    var min = reader.readVector3();
                    var max = reader.readVector3();
                    var center = reader.readVector3();
                    var radius = reader.readFloat();

                    scope.surfaces[i] = {};
                    scope.surfaces[i].boundingBox = new THREE.Box3(min, max);
                    scope.surfaces[i].boundingSphere = new THREE.Sphere(center, radius);

                    //surface targets
                    scope.surfaces[i].targets = new Array(reader.readInt2());
                    for (var j = 0; j < scope.surfaces[i].targets.length; j++) {
                        //tartget name
                        var name = reader.readString2();
                    }
                }

                return magic;
            }

            var magic = info_mesh();

            if (magic != reader.readInt())
                return;

            //load_mesh
            var b_xyz, b_rot, b_scale;

            //bone transformation

            for (var i = 0; i < scope.bones.length; i++) {
                //b_xyz = reader.readVector3();
                //b_rot = reader.readVector4();
                //b_scale = reader.readVector3();
                reader.seekCur(40);
            };

            //animation frames
            for (var i = 0; i < scope.animations.length; i++) {
                scope.animations[i] = {};

                // skip
                //bone animations
                scope.animations[i].bones = reader.readInt2();

                //var a_bones = reader.readShortArray(num_bones);
                reader.seekCur(scope.animations[i].bones * 2);

                //frames
                var flags = reader.getInt2();

                var num_frames = reader.readChar();
                for (var j = 0; j < num_frames; j++) {
                    for (var k = 0; k < num_bones;) {
                        var flags = reader.readUChar();
                        if (flags & 0x07) {
                            if (flags & (1 << 0)) reader.seekCur(4);
                            if (flags & (1 << 1)) reader.seekCur(4);
                            if (flags & (1 << 2)) reader.seekCur(4);
                        }
                        if (flags & 0x08) {
                            if (flags & (1 << 3)) reader.seekCur(2);
                            if (flags & (1 << 3)) reader.seekCur(2);
                            if (flags & (1 << 3)) reader.seekCur(2);
                            if (flags & (1 << 3)) reader.seekCur(2);
                        }
                        if (flags & 0x70) {
                            if (flags & (1 << 4)) reader.seekCur(4);
                            if (flags & (1 << 5)) reader.seekCur(4);
                            if (flags & (1 << 6)) reader.seekCur(4);
                        }
                    }
                }
            }

            // surfaces geometry
            for (var i = 0; i < scope.surfaces.length; i++) {
                // @ to do
                // 暂不处理多targets的逻辑
                var vertex;
                var tangents;
                var num_vertex = 0;
                var num_tangents = 0;

                var surface = scope.surfaces[i];

                //targets
                for (var j = 0; j < surface.targets.length; j++) {
                    num_vertex = reader.readInt2();
                    vertex = reader.readFloatArray(num_vertex * 3);

                    //切线
                    num_tangents = reader.readInt2();
                    tangents = new Float32Array(num_tangents * 4);
                    for (var k = 0; k < num_tangents; k++) {
                        tangents[k * 4] = reader.readShort() / 32767.0;
                        tangents[k * 4 + 1] = reader.readShort() / 32767.0;
                        tangents[k * 4 + 2] = reader.readShort() / 32767.0;
                        tangents[k * 4 + 3] = reader.readShort() / 32767.0;
                        //tangents.normalize();
                    }
                }

                // weights
                var num_s_weights = reader.readInt2();
                for (var j = 0; j < num_s_weights; j++) {
                    var num_weights = reader.readUChar();
                    reader.seekCur(num_weights * 4); // skip
                }

                //first texture coordinates
                var num_texcoords_0 = reader.readInt2();
                var texcoords_0 = reader.readFloatArray(num_texcoords_0 * 2);
                for (var k = 0; k < texcoords_0.length; k++) {
                    if (k % 2 == 1) {
                        texcoords_0[k] = 1 - texcoords_0[k];
                    }
                }
                //second texture coordinates
                var num_texcoords_1 = reader.readInt2();
                //var texcoords_1 = reader.readFloatArray(num_texcoords_1 * 2);
                reader.seekCur(num_texcoords_1 * 2 * 4); // skip

                //colors
                var num_colors = reader.readInt2();
                reader.seekCur(num_colors * 4); // skip

                //indices
                var cindices, tindices;

                // coordinate indices
                var num_cindices = reader.readInt2();
                //var num_cvertex = getNumCVertex();
                var num_cvertex = num_vertex;

                if (num_cvertex < 256) { cindices = reader.readUCharArray(num_cindices); } else if (num_cvertex < 65536) { cindices = reader.readUShortArray(num_cindices); } else { cindices = reader.readIntArray(num_cindices); }

                // triangle indices
                var num_tindices = reader.readInt2();
                var num_tvertex = num_vertex;

                num_tvertex = Math.max(num_vertex, num_tangents);
                num_tvertex = Math.max(num_tvertex, num_texcoords_0);
                num_tvertex = Math.max(num_tvertex, num_texcoords_1);
                num_tvertex = Math.max(num_tvertex, num_colors);

                //var num_tvertex = getNumTVertex();
                if (num_tvertex < 256) { tindices = reader.readUCharArray(num_tindices); } else if (num_tvertex < 65536) { tindices = reader.readUShortArray(num_tindices); } else { tindices = reader.readIntArray(num_tindices); }

                //number of vertices
                num_vertex = vertex.length / 3;
                num_vertex = Math.max(num_vertex, tangents.length / 4);
                num_vertex = Math.max(num_vertex, texcoords_0.length / 4);

                // remap vertices
                var indices = new Uint32Array(num_vertex);
                for (var j = 0; j < cindices.length; j++) {
                    indices[tindices[j]] = cindices[j];
                }

                var re_vertex = new Float32Array(num_vertex * 3);
                for (var j = 0; j < num_vertex; j++) {
                    var k = indices[j];
                    re_vertex[j * 3] = vertex[k * 3];
                    re_vertex[j * 3 + 1] = vertex[k * 3 + 1];
                    re_vertex[j * 3 + 2] = vertex[k * 3 + 2];
                }

                if (texcoords_0.length > 0) {
                    var uv;
                    if (texcoords_0.length / 2 == num_vertex) {
                        uv = texcoords_0;
                    } else {
                        uv = new Float32Array(num_vertex * 2);
                        for (var j = 0; j < num_vertex; j++) {
                            uv[j * 2] = texcoords_0[j * 2];
                            uv[j * 2 + 1] = texcoords_0[j * 2 + 1];
                        }
                    }

                    surface.uv = uv;
                }

                surface.vertex = re_vertex;
                surface.tangents = tangents;
                surface.indices = tindices;
            }

            // check third magic
            magic = reader.readInt();
        }

        function onLoaded(event) {
            if (event.target.status === 200 || event.target.status === 0) {

                // var url = decodeURIComponent(event.target.responseURL)
                // var arrUrl = url.split("//");
                // var start = arrUrl[1].indexOf("/");
                // var relUrl = arrUrl[1].substring(start + 1);//stop省略，截取从start开始到结尾的所有字符

                load_mesh(event.target.response || event.target.responseText);
                scope.dispatchEvent({ type: 'load' }); //, content: scope 
            } else {
                scope.dispatchEvent({ type: 'error', message: 'Couldn\'t load URL [' + url + ']', response: event.target.statusText });
            }
        }

        onLoad = onLoaded;

        var xhr = new XMLHttpRequest();
        xhr.addEventListener('load', onLoaded, true);
        // xhr.addEventListener( 'onProgress', function ( event ) {
        // scope.dispatchEvent( { type: 'progress', loaded: event.loaded, total: event.total } );
        // }, false );
        xhr.addEventListener('error', function() {
            scope.dispatchEvent({ type: 'error', message: 'Couldn\'t load URL [' + url + ']' });
        }, false);

        if (xhr.overrideMimeType) xhr.overrideMimeType('text/plain; charset=x-user-defined');
        xhr.open('GET', url, true);
        xhr.responseType = 'arraybuffer';
        xhr.send(null);
    },
});
