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
    --font-size-sub:14px;
    --color-background:rgb(0, 64, 120);
    --color-text: rgb(18, 101, 171);
    --color-border-button: linear-gradient(44.7deg, #00FF00 14.53%, #00F322 20.2%, #00D378 33.65%, #00A5F7 51.36%, #171AFE 80.39%, #1B00FF 85.35%);
    --color-text-input:rgb(142,150,172);
    --primary-bg: linear-gradient(87.2deg, #00B2FF 2.69%, #003655 98.02%);
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
