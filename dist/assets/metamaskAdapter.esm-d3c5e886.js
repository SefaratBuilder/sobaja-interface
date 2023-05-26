import{F as l,b as a,G as E,H as p,I as v,W as h,J as r,K as w,L as s,M as A,N as m,O as f}from"./index-52a2ca78.js";import{B as C}from"./baseEvmAdapter.esm-18cf3284.js";function k({mustBeMetaMask:n=!1,silent:e=!1,timeout:t=3e3}={}){u();let i=!1;return new Promise(c=>{window.ethereum?o():(window.addEventListener("ethereum#initialized",o,{once:!0}),setTimeout(()=>{o()},t));function o(){if(i)return;i=!0,window.removeEventListener("ethereum#initialized",o);const{ethereum:d}=window;d&&(!n||d.isMetaMask)?c(d):(!e&&console.error("@metamask/detect-provider:",n&&d?"Non-MetaMask window.ethereum detected.":"Unable to detect window.ethereum."),c(null))}});function u(){if(typeof n!="boolean")throw new Error("@metamask/detect-provider: Expected option 'mustBeMetaMask' to be a boolean.");if(typeof e!="boolean")throw new Error("@metamask/detect-provider: Expected option 'silent' to be a boolean.");if(typeof t!="number")throw new Error("@metamask/detect-provider: Expected option 'timeout' to be a number.")}}var N=k;const g=l(N);class y extends C{constructor(){super(...arguments),a(this,"adapterNamespace",E.EIP155),a(this,"currentChainNamespace",p.EIP155),a(this,"type",v.EXTERNAL),a(this,"name",h.METAMASK),a(this,"status",r.NOT_READY),a(this,"metamaskProvider",null)}get provider(){return this.status===r.CONNECTED&&this.metamaskProvider?this.metamaskProvider:null}set provider(e){throw new Error("Not implemented")}async init(){let e=arguments.length>0&&arguments[0]!==void 0?arguments[0]:{};if(await super.init(e),super.checkInitializationRequirements(),this.metamaskProvider=await g({mustBeMetaMask:!0}),!this.metamaskProvider)throw w.notInstalled("Metamask extension is not installed");this.status=r.READY,this.emit(s.READY,h.METAMASK);try{A.debug("initializing metamask adapter"),e.autoConnect&&(this.rehydrated=!0,await this.connect())}catch(t){this.emit(s.ERRORED,t)}}async connect(){if(super.checkConnectionRequirements(),!this.metamaskProvider)throw m.notConnectedError("Not able to connect with metamask");this.status=r.CONNECTING,this.emit(s.CONNECTING,{adapter:h.METAMASK});try{await this.metamaskProvider.request({method:"eth_requestAccounts"});const{chainId:e}=this.metamaskProvider;if(e!==this.chainConfig.chainId&&(await this.addChain(this.chainConfig,!0),await this.switchChain(this.chainConfig,!0)),this.status=r.CONNECTED,!this.provider)throw m.notConnectedError("Failed to connect with provider");const t=()=>{var i;this.disconnect(),(i=this.provider)===null||i===void 0||i.removeListener("disconnect",t)};return this.provider.on("disconnect",t),this.emit(s.CONNECTED,{adapter:h.METAMASK,reconnected:this.rehydrated}),this.provider}catch(e){throw this.status=r.READY,this.rehydrated=!1,this.emit(s.ERRORED,e),e instanceof f?e:m.connectionError("Failed to login with metamask wallet")}}async disconnect(){var e;let t=arguments.length>0&&arguments[0]!==void 0?arguments[0]:{cleanup:!1};await super.disconnectSession(),(e=this.provider)===null||e===void 0||e.removeAllListeners(),t.cleanup?(this.status=r.NOT_READY,this.metamaskProvider=null):this.status=r.READY,await super.disconnect()}async getUserInfo(){if(this.status!==r.CONNECTED)throw m.notConnectedError("Not connected with wallet, Please login/connect first");return{}}async addChain(e){var t;let i=arguments.length>1&&arguments[1]!==void 0?arguments[1]:!1;super.checkAddChainRequirements(i),await((t=this.metamaskProvider)===null||t===void 0?void 0:t.request({method:"wallet_addEthereumChain",params:[{chainId:e.chainId,chainName:e.displayName,rpcUrls:[e.rpcTarget],blockExplorerUrls:[e.blockExplorer],nativeCurrency:{name:e.tickerName,symbol:e.ticker,decimals:e.decimals||18}}]})),this.addChainConfig(e)}async switchChain(e){var t;let i=arguments.length>1&&arguments[1]!==void 0?arguments[1]:!1;super.checkSwitchChainRequirements(e,i),await((t=this.metamaskProvider)===null||t===void 0?void 0:t.request({method:"wallet_switchEthereumChain",params:[{chainId:e.chainId}]})),this.setAdapterSettings({chainConfig:this.getChainConfig(e.chainId)})}}export{y as MetamaskAdapter};
