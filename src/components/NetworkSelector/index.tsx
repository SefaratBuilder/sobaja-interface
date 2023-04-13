import React, { useState, useMemo, useRef, useEffect } from 'react'
import styled from 'styled-components'
import PrimaryButton from 'components/Buttons/PrimaryButton'
import LogoETH from 'assets/token-logos/eth.svg'
import LogoBNB from 'assets/token-logos/bnb.svg'
import LogoERA from 'assets/token-logos/era.svg'
import imgDownArrowWhite from 'assets/icons/chevron-white.svg'
import { useOnClickOutside } from 'hooks/useOnClickOutSide'
import { useActiveWeb3React } from 'hooks'

import imgCircleWhite from '../../assets/icons/circleWhite.png'
import imgCircleGreen from '../../assets/icons/circleGreen.png'

const NetworkSelector = () => {
    const [networkModal, setNetworkModal] = useState(false)
    const [networkModalMobile, setNetworkModalMobile] = useState(false)
    const [activeDot, setActiveDot] = useState(0)
    const ref = useRef<any>()
    // const { address, network, wallet } = useActiveWeb3React()
    const listNetwork = [
        { name: 'Ethereum', logo: LogoETH, className: 'button-eth', url: '' },
        { name: 'BNB Chain', logo: LogoBNB, className: 'button-bnb', url: '' },
        { name: 'Mainnet', logo: LogoERA, className: 'button-era', url: '' },
        { name: 'Testnet', logo: LogoERA, className: 'button-era', url: '' },
    ]

    // const nameNetwork = useMemo(() => {
    // 	if (!network?.chainId) return "Mainnet";
    // 	let name;
    // 	switch (Number(network?.chainId)) {
    // 		case 1:
    // 			name = "Mainnet";
    // 			break;
    // 		case 2:
    // 			name = "Testnet";
    // 			break;

    // 		default:
    // 			name = "Devnet";
    // 			break;
    // 	}
    // 	return name;
    // }, [network]);

    const networkRef = useRef<any>()
    useOnClickOutside(networkRef, () => {
        setNetworkModal(false)
    })
    const networkMobileRef = useRef<any>()
    useOnClickOutside(networkMobileRef, () => {
        setNetworkModalMobile(false)
    })

    const handleSetNetwork = (idx: number) => {
        setActiveDot(0)
    }

    return (
        <NetworkSelectorWrapper>
            <NetworkButton
                onClick={() => {
                    setNetworkModal((i) => !i)
                    setNetworkModalMobile(true)
                }}
            >
                <img src={LogoETH} alt="logo-eth" />
                <p>Ethereum</p>
                <img src={imgDownArrowWhite} alt="arrow-down" />
            </NetworkButton>
            <DropDownMainNet networkModal={networkModal}>
                <ul>
                    {listNetwork.map((item, index) => {
                        return (
                            <a
                                key={index}
                                className={item.className}
                                target="_blank"
                                href={item.url && item.url}
                                onClick={() => handleSetNetwork(index)}
                                rel="noreferrer"
                            >
                                <li>
                                    <span>
                                        {item.logo && (
                                            <img
                                                src={item.logo}
                                                alt=""
                                                className="network-logo"
                                            />
                                        )}
                                        <span>{item.name}</span>
                                    </span>
                                    <img
                                        src={
                                            activeDot === index
                                                ? imgCircleGreen
                                                : imgCircleWhite
                                        }
                                        alt=""
                                    />
                                </li>
                            </a>
                        )
                    })}
                </ul>
            </DropDownMainNet>
        </NetworkSelectorWrapper>
    )
}

const NetworkSelectorWrapper = styled.div`
    position: relative;
    display: flex;
    justify-content: flex-end;
`

const NetworkButton = styled.div`
    height: 40px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 10px;
    background: var(--bg2);
    z-index: 1;
    padding: 0 10px;
    border: 1px solid #003b5c;
    border-radius: 6px;
    cursor: pointer;

    img {
        width: 27px;
    }

    img:nth-child(3) {
        width: 12px;
    }
`
const DropDownMainNet = styled.div<{ networkModal: boolean }>`
    display: ${({ networkModal }) => (networkModal ? 'block' : 'none')};
    z-index: ${({ networkModal }) => (networkModal ? '2' : '0')};
    height: fit-content;
    border: 1px solid #ffffff;
    width: 160px;
    backdrop-filter: blur(10px);
    position: absolute;
    background: #fff;
    border-radius: 8px;
    background: var(--bg5);
    top: 50px;
    right: 0;
    cursor: pointer;

    ul {
        padding: 10px;
        display: flex;
        flex-direction: column;
        gap: 8px;
        .button-sui {
            cursor: no-drop;
            opacity: 0.8;
        }
    }
    a {
        text-decoration: none;
        color: #fff;
        :hover {
            opacity: 0.8;
        }
    }
    li {
        display: flex;
        justify-content: space-between;
        align-items: center;
        span {
            display: flex;
            justify-content: space-between;
            align-items: center;
            gap: 5px;
            img {
                height: 24px;
                width: 36px;
            }
        }
        span:nth-child(3) {
            width: 40px;
        }
        img {
            height: 12px;
            width: 12px;
        }
    }
`
export default NetworkSelector
