# TappyPlane

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
