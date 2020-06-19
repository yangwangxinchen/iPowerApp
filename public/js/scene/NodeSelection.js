MakerJS.NodeSelection = function (engine) {
    this.engine = engine;
    this.nodes = [];
    this.intersectObjects = [];
    this.choosefloorobject;
    this.chooseflowobject;
    this.choosebuildingobject;
    this.chooseobject;
    var changeEvent = { type: 'change' };
    // 射线拾取
    var scope = this;
    var raycaster = new THREE.Raycaster();
    var mouse = new THREE.Vector2();

    this.engine.div.addEventListener('mousedown', onTouchDown);
    window.addEventListener('mouseup', onTouchUp);

    this.engine.div.addEventListener('touchstart', onTouchDown);
    window.addEventListener('touchend', onTouchUp);

    
    
    // function doubleClick(event){
      
    // }

    // var elem=document.querySelector('#MakerJS')
    // var evt=document.createEvent('Event')
    // evt.initEvent('choose')
     
    
    

    function onTouchDown(event) {
        var x, y;
        //涉及引发事件的触摸点的列表  [0]  第一个手指
        if (event.changedTouches) {
            x = event.changedTouches[0].pageX;
            y = event.changedTouches[0].pageY;
        } else {
            ////event.clientX 事件属性返回当事件被触发时鼠标指针的水平坐标
            x = event.clientX;
            y = event.clientY;
        }
        mouse.x = x;
        mouse.y = y;
    }

    function onTouchUp(event) {
        var x, y;
        if (event.changedTouches) {
            x = event.changedTouches[0].pageX;
            y = event.changedTouches[0].pageY;
        } else {
            x = event.clientX;
            y = event.clientY;
        }

        // click
        if (x == mouse.x && y == mouse.y) {
            var pos = new THREE.Vector2();
            pos.x = (x / window.innerWidth) * 2 - 1;
            pos.y = - (y / window.innerHeight) * 2 + 1;
            checkIntersection(pos);
        }
    }

    function checkIntersection(pos) {
        raycaster.setFromCamera(pos, scope.engine.camera);
        var intersects = raycaster.intersectObject(scope.engine.scene, true);
        //var selected = null;
        scope.intersectObjects = [];
        if (intersects.length > 0) {
           
            for (var i in intersects) {
                // if (intersects[i].object.type == "Mesh") {
                    let select = intersects[i].object;
                    
                    // let selectpoint = intersects[i].point;
                    // console.log(selectpoint);    
					if(select && select.name != undefined) {
                        scope.chooseobject = select;
                        scope.intersectObjects.push(select)
                    }
                    else {
                        scope.chooseobject = null;
                    }
                    break;
            }
      
        // engine.effects.setSolidObjects(scope.intersectObjects);
        // engine.effects.setOutlineObjects(scope.intersectObjects)
        console.log(scope.chooseobject)
        scope.dispatchEvent({ type: 'choose',content: scope.chooseobject});
        scope.dispatchEvent({ type: 'chooseMore',content: scope.intersectObjects});
       
    }
}}

// function _select(scope, n, status){
//     if (status == undefined && status == 0) {
//         scope.nodes.clear();
//     }

//     if (status == -1){ // 移除
//         for (var i in scope.nodes){
//             if (scope.nodes[i] == n) {
//                 scope.nodes.splice(i, 1);
//                 break;
//             }
//         }
//     } else { // 添加
//         scope.nodes.push(n);
//     }
// }

MakerJS.NodeSelection.prototype = Object.create(THREE.EventDispatcher.prototype);
// MakerJS.NodeSelection.prototype.constructor = MakerJS.NodeSelection;

// MakerJS.NodeSelection.prototype.colouringNodes = function(nodes,update){
//     if(Array.isArray(nodes)){
//         this.intersectObjects = nodes;
//         // this.engine.effects.setEdgesObjects(this.intersectObjects);
//         this.engine.effects.setOutlineObjects(this.intersectObjects);
//         if(update) this.dispatchEvent({ type: 'change' ,content : this.intersectObjects});
//     }
// }
// MakerJS.NodeSelection.prototype.selectNodes = function(nodes,update){
//     if(Array.isArray(nodes)){
//         this.intersectObjects = nodes;
//         this.engine.effects.setSolidObjects(this.intersectObjects);
//         // this.engine.effects.setOutlineObjects(this.intersectObjects);
//         if(update) this.dispatchEvent({ type: 'change' ,content : this.intersectObjects});
//     }
// }
// MakerJS.NodeSelection.prototype.clear = function(){
//     this.nodes = [];
//     this.intersectObjects = [];
//     this.dispatchEvent({ type: 'change' ,content : this.intersectObjects});
// }

// Object.defineProperties(MakerJS.NodeSelection.prototype, {

//     // 接口暂未做实现
//     selectNode: function (n, status) {
//         _select(this, n, status);
//         this.dispatchEvent(changeEvent);
//     },

//    // 接口暂未做实现
//     selectNodes: function (nodes, status) {
//         for (var i in nodes){
//             _select(this, nodes[i], status);
//         }
//         this.dispatchEvent(changeEvent);
//     },

//    // 接口暂未做实现
//     clear: function () {
//         this.nodes = [];
//         this.dispatchEvent(changeEvent);
//     },

// });
