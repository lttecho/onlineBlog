# 关于package.json的依赖安装

在前端项目中使用npm或者yarn安装依赖时，除了会下载第三方包到node_modules中，还会在package.json文件中记录下该依赖的相关信息。而在package.json中有多个不同的配置项可以记录安装的依赖，常见的两种dependencies的配置是devDependencies和dependencies，另外还有不常用的peerDependencies、peerDependenciesMeta、bundleDependencies和optionalDependencies。对于常用的devDependencies和dependencies，如何区分依赖项的安装应该记录在哪一项中呢？

### dependencies和devDependencies的区别

使用命令`npm install` 或者 `yarn add` 会将第三方依赖记录在dependencies对象中。dependencies是生产依赖，是在生产环境中需要使用到的依赖，比如Vue、React这些框架。

使用`npm install -D` 或者 `yarn add --dev` 会将第三方依赖记录在devDependencies对象中。devDependencies是开发依赖，是在开发过程中需要使用到的依赖项，或者说在项目上线环境中不需要使用到的依赖都应该记录在devDependencies中，比如测试工具、lint工具等。

### nodejs为什么要区分dependencies和devDependencies呢

npm包在安装时是嵌套安装的，也就是说当安装某一个依赖时，同时也会安装这个依赖所需要的依赖。而nodejs区分dependencies和devDependencies就是为了在安装某个依赖时不需要去安装这个依赖的开发依赖，因为这些开发依赖不会影响运行，从而减少node_modules的体积。

比如在安装Vue时，虽然package.json中只会记录Vue的信息，但实际在node_modules中还会安装Vue的生产依赖，如果Vue的package.json中将devDependencies中的配置项记录在dependencies中，就会导致我们自己的项目在安装Vue时也要安装许多不影响Vue运行的依赖项，从而导致我们自己项目的node_modules变大。

反之，如果将生产依赖错误地记录在了devDependencies中，会导致别的项目在安装我这个npm包后运行时找不到依赖项而报错。



### 常见的开发依赖项

- 预处理器，包括css的预处理器sass、less、stylus，js的预处理器babel等，这些工具是为了提供给开发者良好的开发环境，将代码最终转换成浏览器可识别的代码。

- 构建工具，如webpack、vite等，这些工具只在开发阶段使用，一旦打包好项目就不需要了。
- 测试工具，比如e2e、karma等，这些工具只有在开发者测试组件、代码时使用。
- lint类工具，比如eslint、prettier、tslint等等，只是在开发过程中辅助开发者统一代码格式。



