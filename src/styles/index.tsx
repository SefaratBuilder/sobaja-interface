import { createGlobalStyle } from 'styled-components'
import BgWallet from 'assets/brand/bg-connect-wallet.png'

export const GlobalStyle = createGlobalStyle`
    ::-webkit-scrollbar {
        background: rgba(157,195,230,0.8);

        border-radius: 20px;
        width: 8px;
    }
    ::-webkit-scrollbar-thumb {
        background: rgba(157,195,230,0.3);

        border-radius: 20px;
        width: 8px;
    }
    :root{
        --color-text: rgb(18, 101, 171);
        --color-border-button: linear-gradient(44.7deg, #00FF00 14.53%, #00F322 20.2%, #00D378 33.65%, #00A5F7 51.36%, #171AFE 80.39%, #1B00FF 85.35%);
        --bg1: linear-gradient(87.2deg, #0a78a8 2.69%, #003655 98.02%);
        --bg2: linear-gradient(180deg,#0020333d 0%,rgb(0 38 60 / 79%) 100%),linear-gradient(0deg,#003b5c9e,#003b5ccf);
        --bg3: #ffffff1c;
        --bg4: #212c33;
        --bg5: #04131c;
        --bg6: #00B2FF;
        --btn1: linear-gradient(87.2deg, #00B2FF 2.69%, #003655 98.02%);
        --btn2: #ffffff1c;
        --border1: #c9c9c9;
        --border2: #003b5c;
        --border3: #04161d;
        --hover1: #c9c9c9;
        --hover2: #c9c9c921;
        --text1: #ffffff;
        --text2: #888888;
    }

    .t1 {
        color: var(--text1);
    }

    .t2 {
        color: var(--text2);
    }

    .to {
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
    }

    a {
        color: white;
        text-decoration: none;

        :hover {
            text-decoration: underline;
        }
    }

    img {
        width: 100%;
    }

    .b {
        font-weight: 600;
    }

    //style for biconomy connection modal
    .w3a-modal__header {
        /* background: white; */
        display: none!important;
        button {
            width: 100%!important;
        height: 100%!important;
        position: fixed!important;
        z-index: -1!important;
        width: 100vw!important;
        background: transparent!important;
        height: 100vh!important;
        left: 0!important;
        right: 0!important;
        top: 0!important;
        border: none !important;
        outline: none !important;

            svg {
                display: none!important;
            }
        }
    }

    .w3a-header__logo {
        width: 40px;
        height: 40px;
        position: relative;
        display: none;
        ::before {
            position: absolute;
            content: '';
            background: red;
            width: 100%;
            height: 100%;
        }
    }

    .w3a-header {
        display: flex;
        height: 0!important;
        align-items: center;
        gap: 10px;
        padding: 0 20px;
        background: white;
        color: #595857;
        overflow: hidden !important;
    }

    .w3a-header__title { 
        text-align: center;
        font-size: 25px;
        color: #5c6c7f;
    }

    .w3a-header__subtitle {
        font-size: 12px;
    }

    /* .w3a-modal__content {
        padding: 30px 34px;
        background: linear-gradient(180deg,#002033 0%,rgba(0,38,60,0.8) 100%) !important;
        color: #595857;
        border: 1px solid #003b5c;
        border-radius: 10px;
    } */


    .w3a-group__title {
        color: #595857;
        font-weight: 400;
        font-size: 14px;
        line-height: 1.5em;
        margin-bottom: 8px;
        text-transform: uppercase;
    }

    .w3a-adapter-list {
        display: flex;
        gap: 10px;
    }
    
    .w3a-adapter-item::marker {
        content: ''
    }

    .w3a-modal.w3a-modal--light:nth-child(1), .w3a-parent-container #w3a-modal {
        /* display: block !important; */
        position: fixed!important;
        right: 0!important;
        left:unset!important;

        top: 121.49px!important;
        height: 100vh!important;
        /* width: 400px!important; */
        max-width: 400px!important;
        width: 100%!important;
        background: url(${BgWallet})!important;
        background-size: 400px!important;
        background-repeat: no-repeat;
        z-index: 1000!important;
        padding: 20px !important;
        border-top: 1px solid #003b5c;
        border-left: 1px solid #003b5c;
        /* border: 1px solid #003b5c; */

        
        animation: fadeIn 0.4s ease-in-out;
        @media screen and (max-width: 1100px) {
            top: unset!important;
            bottom: 0!important;
            /* min-height: 600px; */
            height: 600px!important;
            animation: fadeUp 0.3s linear;
        }
        @media screen and (max-width: 442px) {
            width: 90%!important;
        }

    @keyframes fadeIn {
        from {
            transform: translateX(100%);
            opacity: 1;
        }
        to {
            transform: translateX(0px);
            opacity: 1;
        }
    }

    @keyframes fadeUp {
        from {
            transform: translateY(100%);
            opacity: 1;
        }
        to {
            transform: translateY(0px);
            opacity: 1;
        }
    }
    }

    .w3a-modal.w3a-modal--light:nth-child(1) > div:nth-child(1){
            position: unset!important;
            /* position: absolute!important;
            right: 0!important;
            top: 10%!important;

            left: 0!important; */
            /* width: min(90vw, 375px)!important; */
            width: 100%!important;
            transition: opacity 400ms ease-in 0s!important;
            border: 1px solid rgb(24, 24, 24)!important;
            border-radius: 10px!important;
            overflow: hidden!important;
            margin: auto!important;
            transform: unset!important;
    }

    #w3a-modal .w3a-group:not(.w3a-group--hidden):not(:last-child), #w3a-modal .w3a-group:not(.w3a-group--social-hidden):not(:last-child), #w3a-modal .w3a-group:not(.w3a-group--email-hidden):not(:last-child), #w3a-modal .w3a-group:not(.w3a-group--ext-wallet-hidden):not(:last-child) {
        border-bottom: 0.5px solid #b7b8bd;
        padding-bottom: 24px;
    }

    #w3a-modal p, #w3a-modal form, #w3a-modal button {
        margin: 0;
        padding: 0;
    }

    #w3a-modal.w3a-modal--light .w3a-text-field {
        background: #ffffff;
        border: 1px solid #ffffff;
        box-shadow: inset 2px 2px 10px rgba(0, 0, 0, 0.1);
        color: #b7b8bd;
        border-radius: 8px;
        padding: 0 10px;
    height: 34px;
    }

    #w3a-modal .w3a-text-field {
        background: #393938;
        border: 1px solid #27282d;
        box-sizing: border-box;
        box-shadow: inset 2px 2px 10px rgba(0, 0, 0, 0.4);
        border-radius: 24px;
        padding: 0 28px;
        height: 48px;
        width: 100%;
        font-size: 16px;
        color: #5c6c7f;
        margin-bottom: 16px;
    }

    #w3a-modal.w3a-modal--light button.w3a-button  {
        background-color: #ffffff;
        border: 1px solid #f3f3f4;
        box-shadow: none;
        color: #595857;
        display: -webkit-box;
        display: -webkit-flex;
        display: -ms-flexbox;
        display: flex;
        -webkit-align-items: center;
        -webkit-box-align: center;
        -ms-flex-align: center;
        align-items: center;
        -webkit-box-pack: center;
        -webkit-justify-content: center;
        -ms-flex-pack: center;
        justify-content: center;
        width: 100%;
        height: 40px;
        border-radius: 8px;
        border: 1px solid var(--border2);
        outline: none;
        font-size: 1rem;
        font-family: 'Roboto',sans-serif;
        font-weight: 300;
        -webkit-letter-spacing: 0.3;
        -moz-letter-spacing: 0.3;
        -ms-letter-spacing: 0.3;
        letter-spacing: 0.3;
        cursor: pointer;
        opacity: 1;
        font-family: Inter,sans-serif;
        @media screen and (max-width: 442px) {
            font-size: 11px;
        }
    }

    #w3a-modal.w3a-modal--light button.w3a-button:nth-child(2) {
        background: linear-gradient(87.2deg,#00B2FF 2.69%,#003655 98.02%);
        color: white;
        display: -webkit-box;
        display: -webkit-flex;
        display: -ms-flexbox;
        display: flex;
        -webkit-align-items: center;
        -webkit-box-align: center;
        -ms-flex-align: center;
        align-items: center;
        -webkit-box-pack: center;
        -webkit-justify-content: center;
        -ms-flex-pack: center;
        justify-content: center;
        width: 100%;
        height: 40px;
        border-radius: 8px;
        border: 1px solid var(--border2);
        outline: none;
        background: linear-gradient(87.2deg,#00B2FF 2.69%,#003655 98.02%);
        font-size: 1rem;
        font-family: 'Roboto',sans-serif;
        font-weight: 300;
        -webkit-letter-spacing: 0.3;
        -moz-letter-spacing: 0.3;
        -ms-letter-spacing: 0.3;
        letter-spacing: 0.3;
        cursor: pointer;
        opacity: 1;
        color: var(--text1);
        font-family: Inter,sans-serif;
        @media screen and (max-width: 442px) {
            font-size: 11px;
        }
    }

    #w3a-modal button.w3a-button {
        background-color: #2f3136;
        border: 1px solid #404145;
        box-sizing: border-box;
        box-shadow: 2px 2px 12px rgba(3, 100, 255, 0.05);
        border-radius: 24px;
        height: 48px;
        width: 100%;
        padding: 8px;
        display: flex;
        align-items: center;
        justify-content: center;
        font-family: var(--text-body);
        font-style: normal;
        font-weight: 400;
        font-size: 16px;
        color: var(--text-color2);
        cursor: pointer;
    }

    #w3a-modal div.w3a-group__title {
        font-weight: 400;
        font-size: 14px;
        line-height: 1.5em;
        margin-bottom: 8px;
        text-transform: uppercase;
        color: white;
    }

    #w3a-modal .w3a-group {
        margin-bottom: 24px;
    }

    #w3a-modal button.w3a-button.w3ajs-external-toggle__button {
        margin-bottom: 12px;
    }

    #w3a-modal .w3a-modal__footer {
        display: none!important;
        /* padding: 16px 34px;
        background: white; */
    }
    
    #w3a-modal .w3a-footer {
        display: flex;
        justify-content: space-between;
        align-items: center;
        font-size: 10px;
        line-height: 150%;
        color: #5c6c7f;
        display: none;
    }

    #w3a-modal .w3a-footer__links a {
        color: #a2a5b5;
        text-decoration: none;
    }

    
    .w3a-parent-container #w3a-modal .w3a-modal__inner {
        /* min-height: unset!important; */
        max-width: 350px !important;
        min-height: 300px!important;

    }


    .w3a-modal__inner.w3a-modal__inner--active {
            position: absolute!important;

            top: 20px!important;
            /* width: 90%!important; */
            
            transition: opacity 400ms ease-in 0s!important;
            border-radius: 10px!important;
            overflow: hidden!important;
            /* margin: auto!important; */
            transform: unset!important;

            background: linear-gradient(180deg,#002033 0%,rgba(0,38,60,0.8) 100%) !important;
            color: #595857;
            border: 1px solid #003b5c!important;

    }

    .w3a-parent-container #w3a-modal .w3a-button--login {
        align-items: center;
        display: inline-flex;
        height: 2.75rem;
        justify-content: center;
        gap: 10px;
    }
    .w3a-parent-container img, .w3a-parent-container video {
        width: 22px;
    }
    .w3a-parent-container .dark #w3a-modal .w3a-modal__loader {
        background: linear-gradient(180deg,#002033 0%,rgba(0,38,60,0.8) 100%) !important;
    }

`

// export const HiddenWeb3Auth = createGlobalStyle`
//     .w3a-modal__content.w3ajs-content {
//         /* display: none!important;; */
//     }
// `
