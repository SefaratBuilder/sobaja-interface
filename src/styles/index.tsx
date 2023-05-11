import { createGlobalStyle } from 'styled-components'

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
        button {
            background: white;
            width: 25px;
            height: 25px;
            top: 10px;
            right: 10px;
            display: flex;
            align-items: center;
            justify-content: center;
            outline: none;
            border: none;
            svg {
                width: 100%;
                height: 100%;
            }
        }
    }

    .w3a-header__logo {
        width: 40px;
        height: 40px;
    }

    .w3a-header {
        display: flex;
        height: 80px;
        align-items: center;
        gap: 10px;
        padding: 0 20px;
        background: white;
        color: #595857;
    }

    .w3a-header__title { 
        text-align: center;
        font-size: 25px;
        color: #5c6c7f;
    }

    .w3a-header__subtitle {
        font-size: 12px;
    }

    .w3a-modal__content {
        padding: 30px 34px;
        background: #f9f9fb;
        color: #595857;
    }

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

    #w3a-modal.w3a-modal--light button.w3a-button {
        background-color: #d6f8ff;
        border: 1px solid #f3f3f4;
        box-shadow: none;
        color: #595857;
    }

    #w3a-modal.w3a-modal--light button.w3a-button:nth-child(2) {
        background-color: #f25f07;
        color: white;
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
    }

    #w3a-modal .w3a-group {
        margin-bottom: 24px;
    }

    #w3a-modal button.w3a-button.w3ajs-external-toggle__button {
        margin-bottom: 12px;
    }

    #w3a-modal .w3a-modal__footer {
        padding: 16px 34px;
        background: white;
    }
    
    #w3a-modal .w3a-footer {
        display: flex;
        justify-content: space-between;
        align-items: center;
        font-size: 10px;
        line-height: 150%;
        color: #5c6c7f;
    }

    #w3a-modal .w3a-footer__links a {
        color: #a2a5b5;
        text-decoration: none;
    }
`
