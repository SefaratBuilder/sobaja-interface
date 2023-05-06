import styled from "styled-components";
import BridgeIcon from 'assets/icons/bridge.svg'
import Chevron from 'assets/icons/chevron-white.svg'
import ETH from 'assets/token-logos/eth.svg'
import Swap from 'assets/icons/swap-icon-2.svg'
import Era from 'assets/brand/era.svg'
import Orbiter from 'assets/brand/orbiter.svg'
import LayerZero from 'assets/brand/layerzero.svg'
import Symbiosis from 'assets/brand/symbiosis.svg'
import Celer from 'assets/brand/celer.svg'
import Multichain from 'assets/brand/multichain.svg'
import BridgeBg from 'assets/brand/bg-bridge.png'
import ArrowLink from 'assets/icons/arrow-link.svg'
const Bridge = () => {
    const BridgeUrls = [
        {
            to: 'https://portal.zksync.io/bridge',
            logo: Era,
            name: 'zkSync Era',
            
        },
        {
            to: 'https://usdcdemo.layerzero.network/bridge',
            logo: LayerZero,
            name: 'LayerZero Bridge',
            
        },
        {
            to: 'https://www.orbiter.finance/?source=Ethereum&dest=zkSync%20Era',
            logo: Orbiter,
            name: 'Orbiter Finance',
           
        },
        {
            to: 'https://app.multichain.org/#/router',
            logo: Multichain,
            name: 'Multichain',
            
        },
        {
            to: 'https://cbridge.celer.network/',
            logo: Celer,
            name: 'Celer Network',
           
        },
        {
            to: 'https://app.symbiosis.finance/bridge',
            logo: Symbiosis,
            name: 'Symbiosis',
           
        },
        
    ]
	return (
		<Container>
            <ContentTopHolder>
            <ContentTop>
                <Title>
                    <img src={BridgeIcon} alt="bridge-icon" />
                    <span>Bridge</span>
                </Title>
                <ItemHolder>
                <Item>
                    <img src={ETH} alt="eth" />
                    <span>Ethereum</span>
                    <img src={Chevron} alt="arrow" />
                </Item>
                <SwapIcon src={Swap} alt="swap bridge icon" />
                <Item>
                    <img src={Era} alt="eth" />
                    <span>Mainet</span>
                    <img src={Chevron} alt="arrow" />
                </Item>
                </ItemHolder>
            </ContentTop>
            </ContentTopHolder>
            <ContentBotHolder>
            {BridgeUrls.map((item, index) => {
                            return (
                                <BridgeItem key={index}>
                                    <img
                                        className="logo"
                                        src={item.logo}
                                        alt=""
                                    />
                                    <span>{item.name}</span>
                                    <LinkItem href={item.to} target="_blank">
                                        Bridge
                                        <img
                                            className="arrow"
                                            src={ArrowLink}
                                            alt="arrow-link"
                                        />
                                    </LinkItem>
                                </BridgeItem>
                            )
                        })}
            </ContentBotHolder>
		</Container>
	);
};
const Container = styled.div`
`;
const ContentTopHolder= styled.div`
    max-width: 520px;
    margin: auto;
    margin-top: 4rem;
    background: rgba(0, 28, 44, 0.3);
    border: 2px solid #003B5C;
    backdrop-filter: blur(25px);
    border-radius: 12px;
    @media screen and (max-width: 767px){
        margin-top: 0;
    }
    @media screen and (max-width: 560px){
        margin: 0 20px 0 20px;
    }
`;
const ContentTop= styled.div`
    margin: 10px;
    padding: 20px;
    background: var(--bg1);
    border-radius: 10px;
    @media screen and (max-width: 710px){
        padding: 10px;
    }
`;
const Title = styled.div`
    display: flex;
    gap: 10px;
    img{
        max-width: 30px;
    }
    span{
        font-weight: 700;
        font-size: 20px;
    }
`;
const ItemHolder = styled.div`
    display: flex; 
    justify-content: center;
    gap: 20px;
    margin-top: 20px;
    @media screen and (max-width: 710px){
        gap: 10px;
    }
    // @media screen and (max-width: 520px){
    //     flex-direction: column;
    //     align-items: center;
    //     gap: 10px;
    // }
`;
const Item = styled.div`
    display: flex; 
    justify-content: space-between;
    gap: 10px;
    padding: 10px 10px;
    background: rgba(255, 255, 255, 0.1);
    border: 1px solid #C9C9C9;
    border-radius: 10px;
    span{
        margin-right: 40px;
        margin-top: 1px;
    }
    img{
        max-width: 50px;
    }
    @media screen and (max-width: 399px){
        gap: 5px;
        padding: 5px 4px;
        border-radius: 6px;
        span{
            margin-right: 0px;
            font-size: 10px;
            margin-top: 4px;
        }
        img{
            max-width: 35px;
        }
    }
    @media screen and (min-width: 400px) and (max-width: 449px){
        gap: 5px;
        padding: 8px 8px;
        span{
            margin-right: 15px;
            font-size: 10px;
            margin-top: 4px;
        }
    }
    @media screen and (min-width: 450px) and (max-width: 520px){
        gap: 5px;
        span{
            margin-right: 30px;
            font-size: 12px;
            margin-top: 3px;
        }
    }
    
`;
const SwapIcon = styled.img`
    max-width: 30px;
`;

const ContentBotHolder = styled.div`
position: relative;
max-width: 680px;
margin: auto;
display: flex;
flex-wrap: wrap;
background: url(${BridgeBg});
background-repeat: no-repeat;
background-size: cover;
border-radius: 12px;
margin-top: 10px;
padding: 20px 10px;
// z-index: -1;
@media screen and (max-width: 710px){
    margin: 10px 20px 0 20px;
}
}
`;
const BridgeItem = styled.a`
position: relative;
max-height: 110px;
max-width: 30%;
width: 100%;
border-radius: 6px;
padding: 5px;
display: flex;
flex-direction: column;
align-items: center;
font-size: 14px;
text-align: center;
margin: 10px;
z-index: 0;
&::before{
    position: absolute;
    content: '';
    background: linear-gradient(87.2deg, #00B2FF 1.86%, #003655 98.02%);
    width: 100%;
    height: 100%;
    border-radius: 6px;
    margin-top: -7px;
    opacity: 0.8;
    z-index: -1;
  }
.logo {
    max-width: 80px;
    height: 25px;
    margin: 0 auto;
}
.arrow {
    width: 10px;
    margin-left: 5px;
}
span{
    margin: 5px 0px;
    font-size: 16px;
}
&:hover{
    text-decoration: none;
}
@media screen and (max-width: 359px){
    max-width: 41%;
    font-size: 10px;
}
@media screen and (min-width: 360px) and (max-width: 479px){
    max-width: 43%;
    font-size: 10px;
}
@media screen and (min-width: 480px) and (max-width: 767px){
    max-width: 45%;
    font-size: 12px;
}
`;
const LinkItem = styled.a`
background: rgba(217, 217, 217, 0.1);
border: 0.5px solid #F9F9F9;
border-radius: 5px;
width: fit-content;
padding: 4px 10px;
margin: auto;
`;
export default Bridge;