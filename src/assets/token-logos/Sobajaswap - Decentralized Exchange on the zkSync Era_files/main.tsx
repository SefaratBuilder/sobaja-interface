import { injectQuery as __vite__injectQuery } from "/@vite/client";import { createHotContext as __vite__createHotContext } from "/@vite/client";import.meta.hot = __vite__createHotContext("/src/main.tsx");import * as RefreshRuntime from "/@react-refresh";

if (!window.$RefreshReg$) throw new Error("React refresh preamble was not loaded. Something is wrong.");
const prevRefreshReg = window.$RefreshReg$;
const prevRefreshSig = window.$RefreshSig$;
window.$RefreshReg$ = RefreshRuntime.getRefreshReg("/Users/Pantinho_1/Desktop/pan/sobaja-interface/src/main.tsx");
window.$RefreshSig$ = RefreshRuntime.createSignatureFunctionForTransform;

import __vite__cjsImport1_react_jsxDevRuntime from "/node_modules/.vite/deps/react_jsx-dev-runtime.js?v=2ff22281"; const _jsxDEV = __vite__cjsImport1_react_jsxDevRuntime["jsxDEV"];
import __vite__cjsImport2_react from "/node_modules/.vite/deps/react.js?v=2ff22281"; const React = __vite__cjsImport2_react.__esModule ? __vite__cjsImport2_react.default : __vite__cjsImport2_react;
import __vite__cjsImport3_reactDom_client from "/node_modules/.vite/deps/react-dom_client.js?v=2ff22281"; const ReactDOM = __vite__cjsImport3_reactDom_client.__esModule ? __vite__cjsImport3_reactDom_client.default : __vite__cjsImport3_reactDom_client;
import App from '/src/App.tsx?t=1681535785335';
import { Provider } from '/node_modules/.vite/deps/react-redux.js?v=2ff22281';
import store from '/src/states/index.ts?t=1681534944688';
import getLibrary from '/src/utils/getLibrary.ts';
import { createWeb3ReactRoot, Web3ReactProvider } from '/node_modules/.vite/deps/@web3-react_core.js?v=2ff22281';
import __vite__cjsImport9_buffer from "/node_modules/.vite/deps/buffer.js?v=2ff22281"; const Buffer = __vite__cjsImport9_buffer["Buffer"];
const Web3ProviderNetwork = createWeb3ReactRoot('NETWORK');
_c = Web3ProviderNetwork;
window.Buffer = Buffer;
ReactDOM.createRoot(document.getElementById('root')).render(/*#__PURE__*/ _jsxDEV(React.StrictMode, {
    children: /*#__PURE__*/ _jsxDEV(Provider, {
        store: store,
        children: /*#__PURE__*/ _jsxDEV(Web3ReactProvider, {
            getLibrary: getLibrary,
            children: /*#__PURE__*/ _jsxDEV(Web3ProviderNetwork, {
                getLibrary: getLibrary,
                children: /*#__PURE__*/ _jsxDEV(App, {}, void 0, false, {
                    fileName: "/Users/Pantinho_1/Desktop/pan/sobaja-interface/src/main.tsx",
                    lineNumber: 18,
                    columnNumber: 21
                }, this)
            }, void 0, false, {
                fileName: "/Users/Pantinho_1/Desktop/pan/sobaja-interface/src/main.tsx",
                lineNumber: 17,
                columnNumber: 17
            }, this)
        }, void 0, false, {
            fileName: "/Users/Pantinho_1/Desktop/pan/sobaja-interface/src/main.tsx",
            lineNumber: 16,
            columnNumber: 13
        }, this)
    }, void 0, false, {
        fileName: "/Users/Pantinho_1/Desktop/pan/sobaja-interface/src/main.tsx",
        lineNumber: 15,
        columnNumber: 9
    }, this)
}, void 0, false, {
    fileName: "/Users/Pantinho_1/Desktop/pan/sobaja-interface/src/main.tsx",
    lineNumber: 14,
    columnNumber: 5
}, this));
var _c;
$RefreshReg$(_c, "Web3ProviderNetwork");


window.$RefreshReg$ = prevRefreshReg;
window.$RefreshSig$ = prevRefreshSig;
import(/* @vite-ignore */ __vite__injectQuery(import.meta.url, 'import')).then((currentExports) => {
  RefreshRuntime.registerExportsForReactRefresh("/Users/Pantinho_1/Desktop/pan/sobaja-interface/src/main.tsx", currentExports);
  import.meta.hot.accept((nextExports) => {
    if (!nextExports) return;
    const invalidateMessage = RefreshRuntime.validateRefreshBoundaryAndEnqueueUpdate(currentExports, nextExports);
    if (invalidateMessage) import.meta.hot.invalidate(invalidateMessage);
  });
});

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1haW4udHN4Il0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBSZWFjdCBmcm9tICdyZWFjdCdcbmltcG9ydCBSZWFjdERPTSBmcm9tICdyZWFjdC1kb20vY2xpZW50J1xuaW1wb3J0IEFwcCBmcm9tICcuL0FwcCdcbmltcG9ydCB7IFByb3ZpZGVyIH0gZnJvbSAncmVhY3QtcmVkdXgnXG5pbXBvcnQgc3RvcmUgZnJvbSAnLi9zdGF0ZXMnXG5pbXBvcnQgZ2V0TGlicmFyeSBmcm9tICd1dGlscy9nZXRMaWJyYXJ5J1xuaW1wb3J0IHsgY3JlYXRlV2ViM1JlYWN0Um9vdCwgV2ViM1JlYWN0UHJvdmlkZXIgfSBmcm9tICdAd2ViMy1yZWFjdC9jb3JlJ1xuaW1wb3J0IHsgQnVmZmVyIH0gZnJvbSAnYnVmZmVyJ1xuY29uc3QgV2ViM1Byb3ZpZGVyTmV0d29yayA9IGNyZWF0ZVdlYjNSZWFjdFJvb3QoJ05FVFdPUksnKVxuXG53aW5kb3cuQnVmZmVyID0gQnVmZmVyXG5cblJlYWN0RE9NLmNyZWF0ZVJvb3QoZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3Jvb3QnKSBhcyBIVE1MRWxlbWVudCkucmVuZGVyKFxuICAgIDxSZWFjdC5TdHJpY3RNb2RlPlxuICAgICAgICA8UHJvdmlkZXIgc3RvcmU9e3N0b3JlfT5cbiAgICAgICAgICAgIDxXZWIzUmVhY3RQcm92aWRlciBnZXRMaWJyYXJ5PXtnZXRMaWJyYXJ5fT5cbiAgICAgICAgICAgICAgICA8V2ViM1Byb3ZpZGVyTmV0d29yayBnZXRMaWJyYXJ5PXtnZXRMaWJyYXJ5fT5cbiAgICAgICAgICAgICAgICAgICAgPEFwcCAvPlxuICAgICAgICAgICAgICAgIDwvV2ViM1Byb3ZpZGVyTmV0d29yaz5cbiAgICAgICAgICAgIDwvV2ViM1JlYWN0UHJvdmlkZXI+XG4gICAgICAgIDwvUHJvdmlkZXI+XG4gICAgPC9SZWFjdC5TdHJpY3RNb2RlPixcbilcbiJdLCJuYW1lcyI6WyJSZWFjdCIsIlJlYWN0RE9NIiwiQXBwIiwiUHJvdmlkZXIiLCJzdG9yZSIsImdldExpYnJhcnkiLCJjcmVhdGVXZWIzUmVhY3RSb290IiwiV2ViM1JlYWN0UHJvdmlkZXIiLCJCdWZmZXIiLCJXZWIzUHJvdmlkZXJOZXR3b3JrIiwid2luZG93IiwiY3JlYXRlUm9vdCIsImRvY3VtZW50IiwiZ2V0RWxlbWVudEJ5SWQiLCJyZW5kZXIiLCJTdHJpY3RNb2RlIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7QUFBQSxPQUFPQSxXQUFXLFFBQU87QUFDekIsT0FBT0MsY0FBYyxtQkFBa0I7QUFDdkMsT0FBT0MsU0FBUyxRQUFPO0FBQ3ZCLFNBQVNDLFFBQVEsUUFBUSxjQUFhO0FBQ3RDLE9BQU9DLFdBQVcsV0FBVTtBQUM1QixPQUFPQyxnQkFBZ0IsbUJBQWtCO0FBQ3pDLFNBQVNDLG1CQUFtQixFQUFFQyxpQkFBaUIsUUFBUSxtQkFBa0I7QUFDekUsU0FBU0MsTUFBTSxRQUFRLFNBQVE7QUFDL0IsTUFBTUMsc0JBQXNCSCxvQkFBb0I7S0FBMUNHO0FBRU5DLE9BQU9GLE1BQU0sR0FBR0E7QUFFaEJQLFNBQVNVLFVBQVUsQ0FBQ0MsU0FBU0MsY0FBYyxDQUFDLFNBQXdCQyxNQUFNLGVBQ3RFLFFBQUNkLE1BQU1lLFVBQVU7Y0FDYixjQUFBLFFBQUNaO1FBQVNDLE9BQU9BO2tCQUNiLGNBQUEsUUFBQ0c7WUFBa0JGLFlBQVlBO3NCQUMzQixjQUFBLFFBQUNJO2dCQUFvQkosWUFBWUE7MEJBQzdCLGNBQUEsUUFBQ0gifQ==