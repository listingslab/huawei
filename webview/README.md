# Kangaroo Cart

webview vs 1.0.0

![logo](https://image.ibb.co/hZrPza/app_icon.png)
[View on Expo](https://expo.io/@cdaligent/app-expo "Expo")
![QR](https://image.ibb.co/cyFKfF/QR_Kangaroo_Cart.png)

React frontend application which can be delivered to POS terminal screens running at 800 x 600 resolution. The app is an SPA running in a div which is restricted to a maximum dimension of 800x600, but is responsive within that size so that it will also work well on a mobile device.

Originally Developed for usTwo for the Cancer Council, January 2017. This is a React Applicaition (found in ./src) which compiles into a standalone HTML folder called build. It uses webpack to produce a lightning fast, hot-reload environment to work in.

#### Get the apps
![Apple Store](https://image.ibb.co/hGSRua/download_apple.png)
[Apple Store](https://itunes.apple.com/app/apple-store/id982107779?ct=www&mt=8 "Apple's Apple Store")
![Google Play](https://image.ibb.co/bRbVLF/download_google.png)
[Play Store](https://play.google.com/store/apps/details?id=host.exp.exponent&referrer=www "Google's Play Store")

#### Install

cd to your working directory (ours is ~/node) and run the following. Clone this repo. Checkout both master and epic branches but DO NOT develop into them. Create a story. Develop that. Once it's done, merge into epic.

```bash
git clone <this-repo-url> new-project-name
cd new-project-name
# git checkout correct branche
# git make your new branch

npm install
npm start

# check your install at http://localhost.

# make a change that you can see

# commit changes to your branch

# push the new branch

# finished? create pull request.
```

Basta. That's it. You should be running a local dev environment using webpack devserver. Your App is viewable on http://localhost:8080.

#### Stack

This is a complete Webpack build development environment which enables fast in-editor pre-testing of our React app against lint rules for both JavaScript and SCSS and enables multi-device testing while we develop and compile the app.


#### CSS (scss)
Styling for the various react components and templates has been split out into the same folders as the React code they relate to, but there are a few other files to look out for.

*/src/containers/App.scss*

This file can be used to apply styles application wide. It's a useful place for responsiveness related styling.

*/src/templates/HeathlyLunchbox/HLB.scss*

This file controls the style for all of the lunchbox builder screens.

#### Using Atom editor?

Install IDE linting. It's proper helpful

`apm install linter-eslint`

`apm install linter-stylelint`

#### NPM Scripts

`npm start`
Runs webpack-dev-server with hot reload

`npm run build`
Creates production ready application into /build folder

`npm run elint`
Run & Summarise the linting process

`npm run slint`
Run the style lint process
