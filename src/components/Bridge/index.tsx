import React, { useState } from 'react'
import { Columns, Row } from 'components/Layouts'
import styled from 'styled-components'
import BridgeIcon from 'assets/icons/bridge.svg'
import { Switch } from '@mui/material'
import { styled as styledUI } from '@mui/material/styles'
import Chevron from 'assets/icons/chevron-white.svg'
import ETH from 'assets/token-logos/eth.svg'
import Swap from 'assets/icons/swap-icon-2.svg'
import Era from 'assets/brand/era.svg'
import Orbiter from 'assets/brand/orbiter.svg'
import Celer from 'assets/brand/celer.svg'
import Multichain from 'assets/brand/multichain.svg'
import EraBg from 'assets/brand/era-bg.png'
import OrbiterBg from 'assets/brand/orbiter-bg.png'
import CelerBg from 'assets/brand/celer-bg.png'
import MultichainBg from 'assets/brand/multichain-bg.png'
import ArrowLink from 'assets/icons/arrow-link.svg'

const BridgeUrls = [
    {
        to: 'https://portal.zksync.io/bridge',
        logo: Era,
        name: 'zkSync Era',
        bg: EraBg,
    },
    {
        to: 'https://www.orbiter.finance/?source=Ethereum&dest=zkSync%20Era',
        logo: Orbiter,
        name: 'Orbiter Finance',
        bg: OrbiterBg,
    },
    {
        to: 'https://cbridge.celer.network/',
        logo: Celer,
        name: 'Celer Network',
        bg: CelerBg,
    },
    {
        to: 'https://app.multichain.org/#/router',
        logo: Multichain,
        name: 'Multichain',
        bg: MultichainBg,
    },
]

const Bridge = () => {
    const [isOpen, setIsOpen] = useState(false)

    return (
        <BridgeWrapper gap="10px">
            <Row jus="space-between" al="center">
                <Row gap="10px" al="center">
                    <img
                        className="bridge-icon"
                        src={BridgeIcon}
                        alt="bridge"
                    />
                    <div className="b">Bridge</div>
                </Row>
                <Row al="center">
                    <AntSwitch
                        onClick={() => setIsOpen(!isOpen)}
                        checked={isOpen}
                    />
                </Row>
            </Row>
            {isOpen && (
                <BridgeContent gap="10px">
                    <Row jus="space-between" al="center" gap="10px">
                        <SelectButton>
                            <Row gap="5px" al="center">
                                <img
                                    className="token"
                                    src={ETH}
                                    alt="network icon"
                                />
                                <span>Ethereum</span>
                            </Row>
                            <img
                                className="chevron"
                                src={Chevron}
                                alt="chevron"
                            />
                        </SelectButton>
                        <SwapIcon src={Swap} alt="swap bridge icon" />
                        <SelectButton>
                            <Row gap="5px" al="center">
                                <img
                                    className="token2"
                                    src={Era}
                                    alt="network icon"
                                />
                                <span>Mainnet</span>
                            </Row>
                            <img
                                className="chevron"
                                src={Chevron}
                                alt="chevron"
                            />
                        </SelectButton>
                    </Row>
                    <Row gap="10px" wrap="wrap">
                        {BridgeUrls.map((item, index) => {
                            return (
                                <BridgeItem bg={item.bg} key={index}>
                                    <img
                                        className="logo"
                                        src={item.logo}
                                        alt=""
                                    />
                                    <span>{item.name}</span>
                                    <Link href={item.to} target="_blank">
                                        Bridge
                                        <img
                                            className="arrow"
                                            src={ArrowLink}
                                            alt="arrow-link"
                                        />
                                    </Link>
                                </BridgeItem>
                            )
                        })}
                    </Row>
                </BridgeContent>
            )}
        </BridgeWrapper>
    )
}

const BridgeItem = styled.div<{ bg: string }>`
    // max-width: 110px;
    max-height: 110px;
    max-width: 23%;
    width: 100%;
    border-radius: 6px;
    padding: 5px;
    background: url(${({ bg }) => bg});
    display: grid;
    grid-template-rows: 1fr 2fr 25px;
    align-items: center;
    font-size: 14px;
    text-align: center;

    .logo {
        max-width: 80px;
        max-height: 30px;
        margin: 0 auto;
    }
    .arrow {
        width: 10px;
        margin-left: 5px;
    }

    @media (max-width: 576px) {
        max-width: 80px;
        max-height: 80px;
        font-size: 8px;

        .logo {
            max-width: 50px;
            max-height: 20px;
        }
        .arrow {
            width: 8px;
            margin-left: 4px;
        }
    }

    @media (max-width: 420px) {
        max-width: 60px;
        max-height: 60px;
        font-size: 8px;
        grid-template-rows: 1fr 2fr 15px;
        .logo {
            max-width: 30px;
            max-height: 10px;
        }
        .arrow {
            width: 6px;
            margin-left: 2px;
        }
    }
    @media (max-width: 767px) {
        max-width: 47%;
        border-radius: 4px;
    }
`

const SwapIcon = styled.img`
    width: 30px;
    height: 30px;
    @media (max-width: 420px) {
        width: 20px;
        height: 20px;
    }
`

const SelectButton = styled(Row)`
    max-width: 170px;
    width: 100%;
    align-items: center;
    justify-content: space-between;
    border-radius: 10px;
    background: #ffffff1c;
    border: 1.5px solid var(--border1);
    padding: 5px 10px;

    .token {
        height: 25px;
        border-radius: 50%;
    }

    .token2 {
        height: 10px;
    }

    .chevron {
        width: 15px;
    }

    @media (max-width: 576px) {
        font-size: 10px;
        padding: 2px 6px;
        .token {
            width: 20px;
        }
        .chevron {
            width: 10px;
        }
    }
`

const Link = styled.a`
    width: 100%;
    text-align: center;
    border-radius: 6px;
    background: #ffffff1c;
    border: 1px solid var(--border1);
    padding: 3px 6px;

    :hover {
        text-decoration: none;
    }
`

const BridgeContent = styled(Columns)``

const BridgeWrapper = styled(Columns)`
    width: 100%;
    background: var(--bg1);
    padding: 10px;
    border-radius: 8px;
    .bridge-icon {
        width: 35px;
    }
`

const AntSwitch = styledUI(Switch)(({ theme }) => ({
    width: 50,
    height: 25,
    padding: 0,
    border: '.3px solid white',
    borderRadius: 32 / 2,
    display: 'flex',
    '&:active': {
        '& .MuiSwitch-thumb': {
            width: 30,
        },
        '& .MuiSwitch-switchBase.Mui-checked': {
            transform: 'translateX(9px)',
        },
    },
    '& .MuiSwitch-switchBase': {
        padding: 2,
        '&.Mui-checked': {
            transform: 'translateX(25px)',
            color: '#fff',
            '& + .MuiSwitch-track': {
                opacity: 1,
                backgroundColor: '#00B2FF',
            },
        },
    },
    '& .MuiSwitch-thumb': {
        boxShadow: '0 2px 4px 0 rgb(0 35 11 / 20%)',
        width: 20,
        height: 20,
        borderRadius: 12.5,
        transition: theme.transitions.create(['width'], {
            duration: 200,
        }),
    },
    '& .MuiSwitch-track': {
        borderRadius: 32 / 2,
        opacity: 1,
        backgroundColor:
            theme.palette.mode === 'dark'
                ? 'rgba(255,255,255,.35)'
                : 'rgba(0,0,0,.25)',
        boxSizing: 'border-box',
    },
}))

export default Bridge
