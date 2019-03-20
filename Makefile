craete:
	cordova create . com.dilawar.hippo Hippo \
	    --template cordova-template-framework7-vue-webpack

init:
	cordova platform add android 
	cordova platform add browser
	npm install font-awesome 
	npm install vue

build:
	cordova build android --release
	find platforms -name "*.apk" | xargs -I f du -h f

run:
	cordova run browser -- --live-reload

