function w({mustBeMetaMask:t=!1,silent:o=!1,timeout:i=3e3}={}){d();let n=!1;return new Promise(r=>{console.log("window.bitkeep.ethereum=>>>>>>>>>>>>>>>>>>>>>>>",window.bitkeep.ethereum),window.bitkeep.ethereum?e():(window.addEventListener("ethereum#initialized",e,{once:!0}),setTimeout(()=>{e()},i));function e(){if(!n)if(n=!0,window.removeEventListener("ethereum#initialized",e),window.bitkeep.ethereum&&(!t||window.bitkeep.ethereum.isBitkeep))r(window.bitkeep.ethereum);else{const a=t&&window.bitkeep.ethereum?"Non-MetaMask window.bitkeep detected.":"Unable to detect window.bitkeep.";!o&&console.error("@metamask/detect-provider:",a),r(null)}}});function d(){if(typeof t!="boolean")throw new Error("@metamask/detect-provider: Expected option 'mustBeMetaMask' to be a boolean.");if(typeof o!="boolean")throw new Error("@metamask/detect-provider: Expected option 'silent' to be a boolean.");if(typeof i!="number")throw new Error("@metamask/detect-provider: Expected option 'timeout' to be a number.")}}export{w as default};
