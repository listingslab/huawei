## Kangaroo

Build and share truly native apps that work across both iOS and Android. Everything is open source, free and uses React Native.

![logo](https://image.ibb.co/hZrPza/app_icon.png)

![QR](https://image.ibb.co/cyFKfF/QR_Kangaroo_Cart.png)

Kangaroo is a React Native Mobile App dev environment used to publish a PWA to iOS and Android via Expo. Scan this QR code to view the latest build  (Expo app required)

####[View on Expo](https://expo.io/@cdaligent/app-expo "Expo")

#### Get the app

Install the Expo app for your device.

![Apple Store](https://image.ibb.co/hGSRua/download_apple.png)

[Apple Store](https://itunes.apple.com/app/apple-store/id982107779?ct=www&mt=8 "Apple's Apple Store")
![Google Play](https://image.ibb.co/bRbVLF/download_google.png)

[Play Store](https://play.google.com/store/apps/details?id=host.exp.exponent&referrer=www "Google's Play Store")

#### About Expo

With Expo you can build, share and enjoy many mobile experiences.
Download the app to try kangaroo today. Kangaroo Cart is React Native App delivered via Expo. It makes Magento apps easy. It's a full React Native Mobile App development environment to publish a PWA to iOS and Android.

#### Licence
[Open Software License](https://opensource.org/licenses/OSL-3.0 "OSL-3.0")

![Aligent](https://image.ibb.co/n3GGSv/aligent_logo.png)
=======
# Project Manager Application
	

## Principle technology used

- [NodeJS](https://nodejs.org/en/)
- [React](https://facebook.github.io/react/index.html)
- [Webpack](https://webpack.github.io/)
- [ES6/7 via Babel](https://babeljs.io/docs/learn-es2015/)
- [Local CSS](https://github.com/webpack/css-loader)
- [RxJS](http://reactivex.io/)
- [Electron](http://electron.atom.io/)
- [Koa](http://koajs.com/)
- [LokiDB](http://lokijs.org/)

#### Because of open internet issues in China you can either use a VPN or the Taobao Chinese registry mirror

```
	$ npm install --registry=http://registry.npm.taobao.org
	Or you can alias NPM to use it:
```

## Getting started

PMAPP requires a UNIX or Linux based build environment

	git clone https://mikeybox@bitbucket.org/mikeybox/pm-app.git
	cd pm-app/development
	npm run setup
	npm run dev
	npm run api

Now point your browser to [http://localhost:9090/webpack-dev-server/](http://localhost:9090/webpack-dev-server/).

For a non-autoloading version, use [http://localhost:9090/](http://localhost:9090/)

### Deployment
To release changes made to the application you can run the below deployment method, it will create a release folder in the development directory. Inside that folder you will find an app folder with all the files required to run the application inside an electron wrapper.

	npm run deploy

Then copy that folder in to a prebuilt electron build. 
[Find builds here](https://github.com/electron/electron/releases)

	On OS X:

	electron/Electron.app/Contents/Resources/app/
	├── package.json
	├── main.js
	└── ...

	On Windows and Linux:

	electron/resources/app
	├── package.json
	├── main.js
	└── ...
	
	

###Basic Architecture

PMAPP is a React front end application built for webkit(Chrome) render engine. The application makes use of react-router to handle state changes across the application and to load the various `views`. The modules are split in to three main sections `views`, `components` and `streams`. 

`Views` hold components and typically handle loading data for the components being rendered. 

`Components` are lower level modules that can later be used in other places to build views or other larger components. 

`Streams` access data via the parent RxJS singleton `CRUD` which handles REST requests to the server. The streams are used to subscribe to different endpoints in the API.

###API

PMAPP runs an internal web server at [localhost:3000](http://localhost:3000) when in development this provides the rest data endpoints but when released and packaged it also hosts the bundled html and js application. It stores data to the disk in JSON format using a loki database to manage collections. When installed the database is stored in user AppData/pm-app under windows and Application Support/pm-app on OSX.

###CMS
PMAPP has a CMS for changing and creating learning content this can be found in the development folder. 

###Basic config options
The main `package.json` contains an object called `appconfig` this can be used to inject variables in to the application javascript environment. This object is attached at `window.PMAPP`

###Creating an installer for Windows
Any installer software can be used, in the current build we're using [Advanced Installer](http://www.advancedinstaller.com/) this an easy to use `MSI` creator which can be used to create shortcuts for the app and add files. A step by step guide can be found [here](http://www.advancedinstaller.com/user-guide/tutorial-simple.html) or use the `PM APP.aip` file. Add the build and files to the installer application folder and build an MSI.
You can find the app icon for use when creating a short cut in the app folder after doing a deploy. 




>>>>>>> c73a399928ca91e286a33e1565a33c2815c69537
