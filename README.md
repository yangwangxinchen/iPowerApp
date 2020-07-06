# iPowerApp

#public主要文件目录

一 ./js
threejs库包含的部分js

../scene makerjs库  

bloom effects engine...... 

Engine.js  整个场景的唯一单例，包含了以下逻辑
1.相机 场景 渲染器 后处理效果（部分）
2.world模型加载
3.相机动画
4.mqtt（回路，设备状态数据关联）

二 ./level
../libs 动画加载界面库

关卡界面：
展厅       exhibitionHall.html 
展厅配电房 hallDistribution.html
箱式变电站 distributionRoom.html

关卡逻辑：
FilterMesh.js 
1.关卡加载完毕后读取场景模型并加载相应场景页面
2.关卡加载动画

dependent.js  依赖的相关js

exhibitionHall.js  
-展厅监测设备（灯，沙盘...）关联,
-辉光效果    `engine.blooms.setEnable(true)  engine.blooms.addBloomObjects(xxx)`
-边缘线效果  `engine.effects.addEdgesObject(xxx) / engine.effects.setEdgesObjects(xxx)`
-虚化效果    `engine.effects.unrealObject(xxx)`
-外轮廓效果
`pushValue(outlineObjects,##)`  将需要使用外轮廓的物体加入到该数组中
`engine.blooms.addBloomObjects(##) `
`engine.effects.setOutlineObjects(outlineObjects) `
 
hallDistribution.js  
回路灯状态关联

distributionRoom.js 
配电房电柜预览

关卡样式：
hall.css:场景按钮,ui样式

三 ./mesh
Path :xml路径
Worlds:
world模型文件 材质路径需更改
 <materials>
        <library>worlds/PDF/PDF_2020-06-18_15-20-50-8/materials/PDF.mat</library>
 </materials>

场景模型 贴图路径需更改 
<texture name="diffuse">worlds/5F_ZT/5F_ZT_2020-06-28_11-56-45-8/textures/ditan2.png</texture>

四 ./textures 贴图纹理

运行
--start_server.bat    测试服务器
--html_start.bat      展厅页面