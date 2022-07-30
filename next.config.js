// next.config.js
const withAntdLess = require("next-plugin-antd-less")

const withPlugins = require("next-compose-plugins")

// module.exports = withLess({
//     ...withAntdLess({
//         // lessVarsFilePath: "./src/styles/variables.less", // optional
//         // lessVarsFilePathAppendToEndOfContent: false, // optional
//         // optional https://github.com/webpack-contrib/css-loader#object
//         // cssLoaderOptions: {
//         //     // ...
//         //     mode: "local",
//         //     // localIdentName: globalThis.__DEV__
//         //     //     ? "[local]--[hash:base64:4]"
//         //     //     : "[hash:base64:8]", // invalid! for Unify getLocalIdent (Next.js / CRA), Cannot set it, but you can rewritten getLocalIdentFn
//         //     exportLocalsConvention: "camelCase",
//         //     exportOnlyLocals: false,
//         //     // ...
//         //     getLocalIdent: (context, localIdentName, localName, options) => {
//         //         return "whatever_random_class_name"
//         //     },
//         // },

//         // for Next.js ONLY
//         nextjs: {
//             localIdentNameFollowDev: true, // default false, for easy to debug on PROD mode
//         },

//         // Other Config Here...

//         webpack(config) {
//             return config
//         },
//     }),
// })

module.exports = withPlugins([[withAntdLess, {}]], {})
