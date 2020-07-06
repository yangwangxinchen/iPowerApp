// document.write(' <link type="text/css" rel="styleSheet"  href="./hall.css" />')

document.write(
    `
  <!--引入threejs -->
  <script src='../js/libs/three.min.js'></script>
  <!-- tween 动画 -->
  <script src="../js/libs/Tween.js"></script>
  <!-- 引入后处理 -->
  <script src="../js/postprocessing/EffectComposer.js"></script>
  <script src="../js/postprocessing/RenderPass.js"></script>
  <script src="../js/postprocessing/ShaderPass.js"></script>
  <script src="../js/postprocessing/UnrealBloomPass.js"></script>
  <script src="../js/postprocessing/OutlinePass.js"></script>
  <script src="../js/postprocessing/BloomPass.js"></script>
  <script src="../js/postprocessing/SSAARenderPass.js"></script>
  <script src="../js/postprocessing/TAARenderPass.js"></script>

  <!-- SSAO --> 
  <script src="../js/math/SimplexNoise.js"></script>
  <script src="../js/shaders/SSAOShader.js"></script>
  <script src="../js/postprocessing/SSAOPass.js"></script>

  <!-- 引入后期处理通道js -->
  <script src="../js/shaders/CopyShader.js"></script>
  <script src="../js/shaders/SAOShader.js"></script>
  <script src="../js/shaders/DepthLimitedBlurShader.js"></script>
  <script src="../js/shaders/UnpackDepthRGBAShader.js"></script>
  <script src="../js/shaders/BloomShader.js"></script>
  <script src="../js/shaders/LuminosityHighPassShader.js"></script>
 
  <!-- dds加载贴图 -->
  <script src="../js/loaders/DDSLoader.js"></script>
  <!-- 引入场景相关js -->
  <script src="../js/Engine.js"></script>
  <script src="../js/scene/World.js"></script>
  <script src="../js/scene/Mesh.js"></script>
  <script src="../js/scene/Merger.js"></script>
  <script src="../js/scene/Materials.js"></script>
  <script src="../js/scene/Effects.js"></script>
  <script src="../js/scene/Bloom.js"></script>
  <script src="../js/loaders/FileLoader.js"></script>
  <script src="../js/scene/LODs.js"></script>
  <script src="../js/scene/Stream.js"></script>
  <script src="../js/scene/NodeSelection.js"></script>
  <!-- 路径 -->
  <script src='../js/scene/Path.js'></script>
  <script src="../js/scene/SubsidiaryArea.js"></script>
  <script src='../js/lines/LineSegmentsGeometry.js'></script>
  <script src='../js/lines/LineGeometry.js'></script>
  <script src='../js/lines/LineMaterial.js'></script>
  <script src='../js/lines/LineSegments2.js'></script>
  <script src='../js/lines/Line2.js'></script>
  <script src='../js/lines/Wireframe.js'></script>
  <script src='../js/lines/WireframeGeometry2.js'></script>

  <!-- 旋转 -->
  <script src="../js/libs/OrbitControls.js"></script>
  <!-- css2d -->
  <script src="../js/libs/CSS2DRenderer.js"></script>
  <script src="../js/libs/CSS3DRenderer.js"></script>
  
  <!-- 执行脚本 -->
  <script src="FilterMesh.js"></script>
  <script src="../js/scene/xmlPath.js"></script>
  <script src="../js/scene/ElectricEffect.js"></script>
  
  <!-- mqtt  -->
  <script src="https://unpkg.com/mqtt/dist/mqtt.min.js" type="text/javascript"></script>
  <!-- 模型加载 -->
  <script src="../js/loaders/GLTFLoader.js"></script>
  <script src="../js/loaders/OBJLoader.js"></script>
  <script src='../js/loaders/FBXLoader.js'></script>
  <script src='../js/libs/inflate.min.js'></script>

  <!-- 加载动画 -->
  <script src="libs/lottie.js"></script>
  <!-- 性能监测 -->
  <script src="../js/libs/stats.js"></script>

  <script src="../js/scene/FieldTips.js"></script>

    `
);

