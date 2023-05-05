import styled from "styled-components";
import BackgroundIntro from 'assets/nfts/bg-intro-nfts.png'
const Intro = () => {
    return (
        <Screen>
            <Content>
                <Title>Your Collection is Waiting</Title>
                <Description>Sobaja is the premier NFT marketplace for beginners, experts, and everyone in-between - without the hassle of gas fees and failed transactions.</Description>
                <Button>
                    <TextButton>Coming soon</TextButton>
                </Button>
            </Content>
        </Screen>
    );
};
const Screen = styled.div`
    background: url(${BackgroundIntro});
    background-size: cover;
    background-repeat: no-repeat;
    background-position: center;
`;
const Content = styled.div`
    padding: 4rem 20px;
`;
const Title = styled.div`
    display: flex;
    justify-content: center;
    text-align: center;
    font-family: 'Inter';
    font-style: normal;
    font-weight: 700;
    font-size: 68px;
    line-height: 78px;
    -webkit-text-stroke: 1px #00E0FF;
	-webkit-text-fill-color: transparent;
    margin-bottom: 1rem;
    @media screen and (max-width: 767px){
        font-size: 32px;
        line-height: 40px;
    }
    @media screen and (min-width: 768px) and (max-width: 991px){
        font-size: 40px;
        line-height: 50px;
    }
`;
const Description = styled.div`
    display: flex;
    width: 70%;
    margin: auto;
    justify-content: center;
    text-align: center;
    font-family: 'Inter';
    font-style: normal;
    font-weight: 400;
    font-size: 25px;
    line-height: 30px;
    color: #FFFFFF;
    @media screen and (max-width: 767px){
        width: 100%;
        font-size: 14px;
        line-height: 19px;
    }
    @media screen and (min-width: 768px) and (max-width: 991px){
        width: 100%;
        font-size: 18px;
        line-height: 26px;
    }
`;
const Button = styled.div`
    display: flex;
    justify-content: center;
    margin: auto;
    max-width: 226px;
    background: linear-gradient(87.2deg, #00B2FF 2.69%, #003655 98.02%);
    box-shadow: 0px 4px 15px rgba(0, 0, 0, 0.07);
    border-radius: 10px;
    margin-top: 1rem;
    @media screen and (max-width: 767px){
        max-width: 180px;
    }
    @media screen and (min-width: 768px) and (max-width: 991px){
        max-width: 200px;
    }
`;
const TextButton = styled.div`
    font-family: 'Inter';
    font-style: normal;
    font-weight: 700;
    padding: 10px 40px;
    font-size: 16px;
    line-height: 24px;
    display: flex;
    align-items: center;
    color: #E2EBF0;
    @media screen and (max-width: 767px){
        font-size: 12px;
        line-height: 16px;
        padding: 10px 20px;
    }
    @media screen and (min-width: 768px) and (max-width: 991px){
        font-size: 14px;
        line-height: 19px;
    }
`;
export default Intro;