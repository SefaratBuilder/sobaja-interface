import React, { useState, useMemo, useRef, useEffect } from 'react'
import styled from 'styled-components'
import imgDownArrowWhite from 'assets/icons/chevron-white.svg'
import { useOnClickOutside } from 'hooks/useOnClickOutSide'
import { useActiveWeb3React } from 'hooks'
import detectEthereumProvider from '@metamask/detect-provider'
import imgCircleWhite from '../../assets/icons/circleWhite.png'
import imgCircleGreen from '../../assets/icons/circleGreen.png'
import { InfoNetwork, ListNetwork } from 'constants/networks/index'
import { OpacityModal } from 'components/Web3Status'
import { changeNetwork } from 'utils/network'

const NetworkSelector = () => {
    const [networkModal, setNetworkModal] = useState(false)
    const { chainId, connector } = useActiveWeb3React()
    const networkRef = useRef<any>()
    useOnClickOutside(networkRef, () => {
        setNetworkModal(false)
    })

    const showNameNetworkCurrent = (chainId: any) => {
        if (chainId && !InfoNetwork[chainId]) {
            return (
                <>
                    <div>
                        <TextUnknownNetwork>Unknown network</TextUnknownNetwork>
                    </div>
                    <DownArrow src={imgDownArrowWhite} alt="arrow-down" />
                </>
            )
        }
        return (
            <>
                <div>
                    <img
                        src={InfoNetwork[chainId]?.logo}
                        alt={InfoNetwork[chainId]?.name}
                    />
                    <p>{InfoNetwork[chainId]?.name}</p>
                </div>
                <DownArrow src={imgDownArrowWhite} alt="arrow-down" />
            </>
        )
    }

    return (
        <NetworkSelectorWrapper>
            <NetworkButton
                onClick={() => {
                    setNetworkModal((i) => !i)
                    // setNetworkModalMobile(true)
                }}
            >
                {showNameNetworkCurrent(chainId)}
            </NetworkButton>
            <DropDownMainNet networkModal={networkModal} ref={networkRef}>
                <ul>
                    {ListNetwork.map((item, index) => {
                        return (
                            <li
                                key={index}
                                onClick={async () =>
                                    await connector.activate(
                                        item.switchNetwork[0],
                                    )
                                }
                            >
                                <span>
                                    {item.logo && (
                                        <img
                                            src={item.logo}
                                            alt=""
                                            className="network-logo"
                                        />
                                    )}
                                    <TextNetwork>{item.name}</TextNetwork>
                                </span>
                                <img
                                    src={
                                        item.chainId === chainId
                                            ? imgCircleGreen
                                            : imgCircleWhite
                                    }
                                    alt=""
                                />
                            </li>
                        )
                    })}
                </ul>
            </DropDownMainNet>
            {networkModal ? <OpacityModal></OpacityModal> : ''}
        </NetworkSelectorWrapper>
    )
}

const TextUnknownNetwork = styled.span`
    font-size: 13px;
`

const TextNetwork = styled.span`
    font-size: 14px;
`
const DownArrow = styled.img`
    height: 12px;
    width: 12px;
`

const NetworkSelectorWrapper = styled.div`
    position: relative;
    /* img:nth-child(3) {
        width: 12px;
    } */
    display: flex;
    justify-content: flex-end;

    @media screen and (max-width: 1100px) {
        position: fixed;
        bottom: 0;
        left: 0;
        width: 100%;
        background: var(--bg3);
        backdrop-filter: blur(3px);
        padding: 8px;
        z-index: 999999;
    }
`

const NetworkButton = styled.div`
    display: flex;
    /* justify-content: flex-end; */

    justify-content: space-between;
    align-items: center;
    gap: 10px;
    background: var(--bg2);
    padding: 0 10px;
    border: 1px solid #003b5c;
    background: linear-gradient(90deg, #002033 0%, rgba(0, 38, 60, 0.39) 100%);
    border-radius: 6px;
    justify-content: space-between;
    cursor: pointer;
    align-items: center;
    height: 40px;
    padding: 0px 8px;
    /* @media screen and (max-width: 576px) {
        display: none;
    } */
    > div {
        display: flex;
        gap: 5px;
        align-items: center;
        > img {
            width: 30px;
            height: 27px;
            border-radius: 50%;
        }
    }
`
const DropDownMainNet = styled.div<{ networkModal: boolean }>`
    display: ${({ networkModal }) => (networkModal ? 'block' : 'none')};
    /* z-index: ${({ networkModal }) => (networkModal ? '2' : '0')}; */
    z-index: 3;
    height: fit-content;
    border: 1px solid #ffffff;
    width: 160px;
    backdrop-filter: blur(10px);
    position: absolute;
    background: linear-gradient(180deg, #002033 0%, rgba(0, 38, 60, 0.8) 100%);
    border-radius: 6px;
    top: 50px;
    right: 0;
    cursor: pointer;
    @media screen and (max-width: 1100px) {
        bottom: 54px;
        top: unset;
        right: 10px;
    }
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
