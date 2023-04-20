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

    .i {
        font-style: italic;
    }
`
