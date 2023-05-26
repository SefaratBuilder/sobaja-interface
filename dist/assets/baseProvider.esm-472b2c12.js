import{b as o,D as v,K as a,a4 as s,a5 as P,a6 as l,a7 as f}from"./index-52a2ca78.js";import{B as y,d as h,p as u}from"./baseControllers.esm-aa487116.js";function d(t,r){var e=Object.keys(t);if(Object.getOwnPropertySymbols){var i=Object.getOwnPropertySymbols(t);r&&(i=i.filter(function(n){return Object.getOwnPropertyDescriptor(t,n).enumerable})),e.push.apply(e,i)}return e}function c(t){for(var r=1;r<arguments.length;r++){var e=arguments[r]!=null?arguments[r]:{};r%2?d(Object(e),!0).forEach(function(i){o(t,i,e[i])}):Object.getOwnPropertyDescriptors?Object.defineProperties(t,Object.getOwnPropertyDescriptors(e)):d(Object(e)).forEach(function(i){Object.defineProperty(t,i,Object.getOwnPropertyDescriptor(e,i))})}return t}class C extends y{constructor(r){let{config:e,state:i}=r;if(super({config:e,state:i}),o(this,"_providerEngineProxy",null),!e.chainConfig)throw a.invalidProviderConfigError("Please provide chainConfig");if(!e.chainConfig.chainId)throw a.invalidProviderConfigError("Please provide chainId inside chainConfig");if(!e.chainConfig.rpcTarget)throw a.invalidProviderConfigError("Please provide rpcTarget inside chainConfig");this.defaultState={chainId:"loading"},this.defaultConfig={chainConfig:e.chainConfig,networks:{[e.chainConfig.chainId]:e.chainConfig}},super.initialize()}get provider(){return this._providerEngineProxy}set provider(r){throw new Error("Method not implemented.")}addChain(r){if(!r.chainId)throw s.ethErrors.rpc.invalidParams("chainId is required");if(!r.rpcTarget)throw s.ethErrors.rpc.invalidParams("chainId is required");this.configure({networks:c(c({},this.config.networks),{},{[r.chainId]:r})})}getChainConfig(r){var e;const i=(e=this.config.networks)===null||e===void 0?void 0:e[r];if(!i)throw s.ethErrors.rpc.invalidRequest(`Chain ${r} is not supported, please add chainConfig for it`);return i}getProviderEngineProxy(){return this._providerEngineProxy}updateProviderEngineProxy(r){this._providerEngineProxy?this._providerEngineProxy.setTarget(r):this._providerEngineProxy=h(r)}}class p{constructor(){o(this,"_providerEngineProxy",null)}get provider(){return this._providerEngineProxy}set provider(r){throw new Error("Method not implemented.")}addChain(r){throw new Error("Method not implemented.")}async setupProvider(r){const e=this.getPrivKeyMiddleware(r),i=new P;i.push(e);const n=u(i);this.updateProviderEngineProxy(n)}async switchChain(r){return Promise.resolve()}getProviderEngineProxy(){return this._providerEngineProxy}updateProviderEngineProxy(r){this._providerEngineProxy?this._providerEngineProxy.setTarget(r):this._providerEngineProxy=h(r)}getPrivKeyMiddleware(r){const e={getPrivatekey:async()=>r};return this.createPrivKeyMiddleware(e)}createPrivKeyMiddleware(r){let{getPrivatekey:e}=r;async function i(n,g){g.result=await e()}return l({private_key:f(i)})}}o(p,"getProviderInstance",async t=>{const r=new p;return await r.setupProvider(t.privKey),r});v();export{C as B,p as C};
