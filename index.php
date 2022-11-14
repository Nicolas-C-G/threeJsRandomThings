<link rel="stylesheet" type="text/css" href="style/general.scss">
<!-- Import maps polyfill -->
<!-- Remove this when import maps will be widely supported -->
<script async src="https://unpkg.com/es-module-shims@1.3.6/dist/es-module-shims.js"></script>

<script type="importmap">
	{
		"imports": {
			"three": "./node_modules/three/build/three.module.js",
			"three/addons/": "./node_modules/three/examples/jsm/",
			"dat.gui": "./node_modules/dat.gui/build/dat.gui.module.js",
			"gsap": "./node_modules/gsap/index.js"
		}
	}
</script>

<!-- simple cube hello world -->
<script type="module" src="js/importGlbModelEfect1.js"></script> 