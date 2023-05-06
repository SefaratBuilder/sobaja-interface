import React, { useRef, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import { Autoplay, Pagination, Navigation } from "swiper";
import styled from "styled-components";
import Img1 from 'assets/nfts/nft1.png'
import Img2 from 'assets/nfts/nft2.png'
import Img3 from 'assets/nfts/nft3.png'
import Img4 from 'assets/nfts/nft4.png'
import Img5 from 'assets/nfts/nft5.png'
import CircleIcon from 'assets/nfts/end.svg'
import ArrowPrev from 'assets/nfts/arrow-prev.png'
import ArrowNext from 'assets/nfts/arrow-next.png'

export default function Carousel() {
    const ItemSlider = [
        {
            img: Img1,
            title: "Soba man",
            button:
            {
                img: CircleIcon,
                text: "Ends in",
                time: "06:05:59"
            },
            description1: "Soba",
            description2: "Sobaja Curated",

        },
        {
            img: Img2,
            title: "Black Valley",
            button:
            {
                img: CircleIcon,
                text: "Ends in",
                time: "20:35:59"
            },
            description1: "WGRT_",
            description2: "Dark Stories",

        },
        {
            img: Img3,
            title: "ANDREA CRESPI for The NFT Magazine #03 ISSUE 2K23 | CRYPTOART MONOGRAPH",
            button:
            {
                img: CircleIcon,
                text: "Ends in",
                time: "25:35:59"
            },
            description1: "Andrea Crespi, The NFT Magazine",
            description2: "The NFT Magazine",

        },
        {
            img: Img4,
            title: "ANA•MOR•PHIC",
            button:
            {
                img: CircleIcon,
                text: "Ends in",
                time: "25:35:59"
            },
            description1: "steve tanchel",
            description2: "USURPA",

        },
        {
            img: Img5,
            title: "YUGEN 2",
            button:
            {
                img: CircleIcon,
                text: "Ends in",
                time: "20:35:59"
            },
            description1: "Martha Fiennes",
            description2: "MORROW collective",

        },
        {
            img: Img1,
            title: "Soba man",
            button:
            {
                img: CircleIcon,
                text: "Ends in",
                time: "06:05:59"
            },
            description1: "Soba",
            description2: "Sobaja Curated",

        },
        {
            img: Img2,
            title: "Black Valley",
            button:
            {
                img: CircleIcon,
                text: "Ends in",
                time: "20:35:59"
            },
            description1: "WGRT_",
            description2: "Dark Stories",

        },
        {
            img: Img3,
            title: "ANDREA CRESPI for The NFT Magazine #03 ISSUE 2K23 | CRYPTOART MONOGRAPH",
            button:
            {
                img: CircleIcon,
                text: "Ends in",
                time: "25:35:59"
            },
            description1: "Andrea Crespi, The NFT Magazine",
            description2: "The NFT Magazine",

        },
        {
            img: Img4,
            title: "ANA•MOR•PHIC",
            button:
            {
                img: CircleIcon,
                text: "Ends in",
                time: "25:35:59"
            },
            description1: "steve tanchel",
            description2: "USURPA",

        },
        {
            img: Img5,
            title: "YUGEN 2",
            button:
            {
                img: CircleIcon,
                text: "Ends in",
                time: "20:35:59"
            },
            description1: "Martha Fiennes",
            description2: "MORROW collective",

        },
    ]
    return (
        <WrapCarousel>
            <Swiper
                navigation={true}
                loop={true}
                autoplay={{
                    delay: 3000,
                    disableOnInteraction: false,
                }}
                breakpoints={{
                    480: {
                        slidesPerView: 2,
                        spaceBetween: 15,
                    },
                    768: {
                        slidesPerView: 3,
                        spaceBetween: 15,
                    },
                    1024: {
                        slidesPerView: 4,
                        spaceBetween: 20,
                    },
                    1200: {
                        slidesPerView: 5,
                        spaceBetween: 20,
                    },
                }}
                modules={[Autoplay, Pagination, Navigation]}
                className="mySwiper"
            >
                {
                    ItemSlider.map((item, index) => {
                        return <SwiperSlide key={index}><img src={item.img} alt="" className="image" />
                            <Button>
                                <Icon>
                                    <img src={item.button.img} alt="" className="icon" /></Icon>
                                <Text>{item.button.text}</Text>
                                <Time>{item.button.time}</Time>
                            </Button>
                            <Title>
                                {item.title}
                            </Title>
                            <Description>
                                {item.description1}
                                <br />
                                {item.description2}
                            </Description>
                        </SwiperSlide>
                    })
                }
            </Swiper>
        </WrapCarousel>
    );
}

const WrapCarousel = styled.div`
    position:relative;
    margin-bottom:1rem;
     .swiper-button-prev{
        background-image: url(${ArrowPrev});
        position:absolute;
        background-repeat: no-repeat;
        background-size:contain;
        right:0;
        height: 35px;
        width: 35px;
        top: 40%;
        z-index: 2;
        transform:translateY(-50%);
        cursor:pointer;
        left:0%;

    }
    .swiper-button-next{
        background-image: url(${ArrowNext});
        position:absolute;
        background-repeat: no-repeat;
        background-size:contain;
        right:0;
        height: 35px;
        width: 35px;
        top: 40%;
        z-index: 2;
        transform:translateY(-50%);
        cursor:pointer;
    } 
    .mySwiper{
        padding: 20px;
        z-index: 0;
    }
    .image{
        width: 100%;
        border-radius: 12px;
    }
    @media screen and (max-width:992px){
        .mySwiper{
            padding: 15px;
        }
    }
    @media screen and (max-width:479px){
        .swiper-slide{
            padding: 15px;
        }
    }
`;
const Button = styled.div`
    display: flex;
    gap: 5px;
    background: linear-gradient(87.2deg, #00B2FF 2.69%, #003655 98.02%);
    border-radius: 869.67px;
    max-width: fit-content;
    padding: 4px 10px;
    margin: 10px 0;
`;
const Icon = styled.div`
    max-width: 20px;
`;
const Text = styled.div`
    font-weight: 700;
    font-size: 12px;
    line-height: 16px;
    margin-top: 2px;
    @media screen and (max-width: 767px){
        font-size: 9px;
        line-height: 14px;
    }
    @media screen and (min-width: 768px) and (max-width: 991px){
        font-size: 10px;
        line-height: 15px;
    }
`;
const Time = styled.div`
    font-weight: 400;
    font-size: 10px;
    line-height: 16px;
    margin-top: 2px;
    @media screen and (max-width: 767px){
        font-size: 8px;
        line-height: 12px;
        margin-top: 4px;
    }
    @media screen and (min-width: 768px) and (max-width: 991px){
        font-size: 9px;
        line-height: 14px;
        margin-top: 3px;
    }
`;
const Title = styled.div`
    font-weight: 700;
    font-size: 16px;
    line-height: 17px;
    display: flex;
    align-items: center;
    color: #FFFFFF;
    @media screen and (max-width: 767px){
        font-size: 12px;
        line-height: 16px;
    }
    @media screen and (min-width: 768px) and (max-width: 991px){
        font-size: 14px;
        line-height: 19px;
    }
`;
const Description = styled.div`
    font-weight: 400;
    font-size: 14px;
    line-height: 18px;
    display: flex;
    align-items: center;
    color: #4D4F4F;
    @media screen and (max-width: 767px){
        font-size: 10px;
        line-height: 14px;
    }
    @media screen and (min-width: 768px) and (max-width: 991px){
        font-size: 12px;
        line-height: 16px;
    }
`;
