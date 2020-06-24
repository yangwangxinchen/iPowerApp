MakerJS.Path = function () {
    this.url = "";
    this.frames;
    this.geometry;
};

MakerJS.Path.prototype = {

    constructor: MakerJS.Path,
    
    load:function(file){
        function __load(){

        }
    },

	__load_path : function (data) {
        var reader = new MakerJS.StreamReader(data);
        var scope = this;

        // magic1
        var magic = reader.readInt();
        //console.log("magic1:" + magic);


        // frames
        var num_frames = reader.readInt();
        scope.frames = new Array(num_frames);

        // times(暂时没用)
        var num_times = num_frames;
        var times = new Float32Array();

        var geobuf = new THREE.Geometry();
        for(var i = 0; i < scope.frames.length; i++)
        {
            // 空几何体
            scope.geometry = geobuf;
            scope.frames[i] = {};
            //scope.frames[i]['xyz'] = new THREE.Vector3();
            let xyz = new THREE.Vector3(); 
            let rot = new THREE.Vector4();
            let scale = new THREE.Vector3();

            var flags = reader.readUChar();
            //console.log("flags:"+flags);
            times[i] = reader.readFloat();

            if(flags & (1 << 0)) 
            {
                xyz.x = reader.readFloat();
                //console.log("i:" + i + "的xyz_x的值:" + xyz.x);
            }
            if(flags & (1 << 1)) 
            {
                xyz.y = reader.readFloat();
                //console.log("i:" + i + "的xyz_y的值:" + xyz.y);
            }
            if(flags & (1 << 2)) 
            {
                xyz.z = reader.readFloat();
                //console.log("i:" + i + "的xyz_z的值:" + xyz.z);

            }
		    if(flags & (1 << 3)){
                rot.x = reader.readShort() / 32767.0;
                rot.y = reader.readShort() / 32767.0;
                rot.z = reader.readShort() / 32767.0;
                rot.w = reader.readShort() / 32767.0;
                rot.normalize();
            } 
		    if(flags & (1 << 4)) scale.x = reader.readFloat();
		    if(flags & (1 << 5)) scale.y = reader.readFloat();
            if(flags & (1 << 6)) scale.z = reader.readFloat();

            
            scope.frames[i].xyz = xyz;
            scope.frames[i].rot = rot;
            scope.frames[i].scale = scale;
            
            if(i > 0)
            {
                if(scope.frames[i].xyz.x == 0)
                {
                    scope.frames[i].xyz.x = scope.frames[i-1].xyz.x;   
    
                }
                if(scope.frames[i].xyz.y == 0)
                {
                    scope.frames[i].xyz.y = scope.frames[i-1].xyz.y;
                }
                if(scope.frames[i].xyz.z == 0)
                {
                    scope.frames[i].xyz.z = scope.frames[i-1].xyz.z;
                }
            }
            // 给空白几何体添加点信息
            scope.frames[i].xyz = xyz;
            scope.frames[i].rot = rot;
            scope.frames[i].scale = scale;
            scope.geometry.vertices.push(scope.frames[i].xyz);

        };
        
        // for(var i = 0; i < scope.frames.length; i++)
        // {
        //     var f = scope.frames[i];
        //     if(i != 0)
        //     {
        //         f = scope.frames[i-1];
        //     }
        //     scope.geometry.vertices.push(f.xyz);

        // }



        // magic 2
        magic = reader.readInt();
        //console.log("magic2:" + scope.geometry.vertices);       

        return this;
        
	},
};

Object.assign(MakerJS.Path.prototype, THREE.EventDispatcher.prototype, {
	load: function( url, onLoad, onProgress, onError ) {

		var scope = this;
		this.url = url;

		function onLoaded(event) {
			if (event.target.status === 200 || event.target.status === 0) {
				var path = scope.__load_path(event.target.response || event.target.responseText);
				scope.dispatchEvent({ type: 'load', content: path });
			}
			else {
				scope.dispatchEvent({ type: 'error', message: 'Couldn\'t load URL [' + url + ']', response: event.target.statusText });
			}
		}

		onLoad = onLoaded;
		
		var xhr = new XMLHttpRequest();
		xhr.addEventListener('load', onLoaded, true );

		if ( xhr.overrideMimeType ) xhr.overrideMimeType( 'text/plain; charset=x-user-defined' );
		xhr.open( 'GET', url, true );
		xhr.responseType = 'arraybuffer';
        xhr.send( null );

	}, 
});
