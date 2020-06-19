MakerJS.LODs = function (engine) {
    this.engine = engine;

    this.lod_meshes = [];
    this.lod_hidden = [];

    this.keys = ['墙','板','结构','门','设备']; // @ to do
    
    this.clear = function() {
        this.lod_meshes = [];
        this.lod_hidden = [];
    }

    this.update = function (camera_pos) {
		for(var i in this.lod_meshes){
			var mesh = this.lod_meshes[i];
			if(!mesh.visible) continue;

			var center = mesh.boundingSphere.center.clone();
			center.applyMatrix4(mesh.matrixWorld);
			var lens = center.sub(camera_pos).length();
			if(lens > mesh.userData.visibleDistance){
				mesh.visible = false;
				this.lod_hidden.push(mesh);
			}
		}
	}

	this.reset = function () {
		for(var i in this.lod_hidden){
			this.lod_hidden[i].visible = true;
		}
		this.lod_hidden = [];
    }
    
    this.applyNode = function (node, size) {

        var scope = this;
        function match(node){
            for(var i in scope.keys)
            {
                if(node.name.indexOf(scope.keys[i]) > -1)
                    return true;
            }
            return false;
        }

        if(!match(node)){

            if(size.x < 1 && size.y < 1 && size.z < 1){

                if(size.x < 0.3 && size.y < 0.3 && size.y < 0.3)
                {
                    node.userData.visibleDistance = 20;
                }
                else if(size.x < 0.6 && size.y < 0.6 && size.z < 0.6){
                    node.userData.visibleDistance = 35;
                }
                else if(size.x < 0.8 && size.y < 0.8 && size.z < 0.8){
                    node.userData.visibleDistance = 50;
                }
                else if(size.x < 1 && size.y < 1 && size.z < 1){
                    node.userData.visibleDistance = 70;
                }
                else if(size.x < 2 && size.y < 2 && size.z < 2){
                    node.userData.visibleDistance = 100;
                }
                else {
                    node.userData.visibleDistance = 150;
                }

                this.lod_meshes.push(node);
            }
            
        }else if(size.x < 0.3 && size.y < 0.3 && size.y < 0.3){
            node.userData.visibleDistance = 20;
            this.lod_meshes.push(node);
        }
    }
}
