import { Row } from 'components/Layouts'
import React from 'react'
import styled from 'styled-components'
import Soba from 'assets/token-logos/sbj.svg'
import PrimaryButton from 'components/Buttons/PrimaryButton'

const ListLaunchpad = () => {
    return (
        <Container>
            <Title>
                <p>Launchpad</p>
            </Title>
            <WrapLaunchpad>
                <CardDetails>
                    <div className="thumbnail">
                        <img
                            src="https://www.salomonstore.sk/wp-content/uploads/2023/04/what-is-a-crypto-launchpad.jpg.webp"
                            alt=""
                        />
                    </div>
                    <Details>
                        <WrapHeader>
                            <LogoToken>
                                <img src={Soba} alt="" />
                            </LogoToken>
                            <div>
                                <span>Soba</span>
                                <Badge>On Sale</Badge>
                            </div>
                            <div className="name-token">Sobaja Token</div>
                        </WrapHeader>
                        <WrapDetails>
                            <div>Total Reward: 999</div>
                            <div>Sale Price: 1 Soba - 100 USDC</div>
                            <div>Start Time: 29-04-2023</div>
                            <div>End Time: 30-04-2023</div>
                            <div>Payment Crypto: MATIC</div>
                            <PrimaryButton
                                name="View more"
                                onClick={() => {}}
                            />
                        </WrapDetails>
                    </Details>
                </CardDetails>
            </WrapLaunchpad>
        </Container>
    )
}

const Container = styled.div`
    padding: 30px 2.5rem;
`
const Title = styled.div`
    display: flex;
    justify-content: center;
    padding-bottom: 1.5rem;
    p {
        font-size: 24px;
    }
`
const WrapLaunchpad = styled.div`
    display: flex;
    justify-content: space-between;
    flex-wrap: wrap;
    color: #111;
    gap: 10px;
`
const CardDetails = styled(Row)`
    background: #fff;
    /* height: 308px; */
    /* border: 4px solid #008ffda4; */
    .thumbnail {
        padding: 5px;

        display: flex;
        align-items: center;
    }

    img {
        width: 400px;
        height: 300px;
        object-fit: cover;
    }
`

const Details = styled.div`
    display: flex;
    flex-direction: column;
    gap: 25px;
    padding: 10px 40px;
    min-width: 400px;
    /* max-height: 100px; */

    /* background: #fff; */

    span {
        font-size: 24px;
    }
`

const WrapHeader = styled.div`
    display: flex;
    gap: 10px;
    align-items: center;

    .name-token {
        font-size: 24px;
        opacity: 0.5;
    }
`

const LogoToken = styled.div`
    width: 56px;
    height: 56px;
    border-radius: 50%;
    border: 0.3px solid var(--border1);
    overflow: hidden;
    img {
        width: 100%;
        height: 100%;
    }
`

const Badge = styled.div`
    border: 1px solid #111;
    padding: 5px;
    font-size: 14px;
    color: #737373;
`

const WrapDetails = styled.div`
    display: flex;
    flex-direction: column;
    gap: 15px;
`

export default ListLaunchpad
