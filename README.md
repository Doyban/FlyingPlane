# FlyingPlane

- Android: https://play.google.com/store/apps/details?id=com.doyban.flyingplane
- iOS: https://apps.apple.com/us/app/flyyingplane/id6470124867

Join the FlyyingPlane community and embark on the ultimate flying challenge!
How far can you go?
Download now and find out!

FlyyingPlane is an exciting, never-ending mobile game that will keep you on the edge of your seat!
Navigate your plane through a series of challenging obstacles, jumping and dodging to achieve the highest score possible.
With simple yet engaging gameplay, FlyyingPlane is perfect for casual gamers and thrill-seekers alike.

Features:
• Intuitive controls for a seamless gaming experience
• Stunning graphics and dynamic environments
• Endless gameplay with increasing difficulty
• Compete with friends and players worldwide on the leaderboard
• Free to download and play, with optional in-game purchases

## 1. Install dependencies :

Navigate to the project repo directory.

Run:

`npm install`

assuming node installed in PC.

## 2. Run the development server:

Run:

`npm run start`

This will run a server so game automatically opens in your defualt browser with browser-sync properties. It will also start a watch process, so you can change the source and the process will recompile and refresh the browser automatically.

### 3. Contributor Instructions

- Use **camelCase** for global variable names, function params
  Ex :- `this.globalVariable = null`
- Use **snake_case** for local variables
  Ex :- `let local_variables = null`

- Use **UPPER_CASE** in **_snake_case_** for constants
  Ex :- `const CONSTANT_NAME = 0`

- Use **camelCase** for function name declarations
  Ex :- `function functionName () {}`

- Use **UpperCamelCase** for class names
  Ex :- `class ClassName {}`

### Webpack fix

Running `export NODE_OPTIONS=--openssl-legacy-provider` might be needed before `npm run start` due to `webpack` problem.

### Important

Even though the package name in stores is `FlyingPlane`, some of the metadata info might refer to `tappyplane`, so don't get confused. `TappyPlane` wasn't possible to submit to `Google PlayStore`.
