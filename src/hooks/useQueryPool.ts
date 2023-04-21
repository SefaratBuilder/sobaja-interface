import { ApolloClient, InMemoryCache, gql } from '@apollo/client';
import { useEffect, useMemo, useState } from 'react';

export interface Data {
    network: string,
    name: string,
    tvl: string,
    tvlValue: number,
    volume: string,
    volumeValue: number,
    apr: string,
    aprValue: number,
    fee: string
}

export const useQueryPool = () => {
    const [poolData, setPoolData] = useState<Data[]>()
    const APIURL = 'https://api.thegraph.com/subgraphs/name/uniswap/uniswap-v2'

    // Initialize the Apollo Client
    const client = new ApolloClient({
        uri: APIURL,
        cache: new InMemoryCache(),
    });

    // consider to use trackedReserveETH instead of reserveUSD
    const GetTVL = gql`
    query GetTopPairs($orderDirection: OrderDirection) {
        pairs(first: 100, orderBy: reserveUSD, orderDirection: $orderDirection) {
            id
            reserveUSD
            token0 {
                symbol
            }
            token1 {
                symbol
            }
        }
    }
`;

    const GetDailyVolOfPair = gql`
    query GetDailyVolume($pairAddress: ID!) {
        pairDayDatas(first: 2, orderBy: date, orderDirection: desc, where: { pairAddress: $pairAddress }) {
            dailyVolumeUSD
        }
    }
`;

    async function fetchTVL(ascOrDesc: String) {
        try {
            // Fetch the top 10 pairs
            const pairsResponse = await client.query({
                query: GetTVL,
                variables: {
                    orderDirection: ascOrDesc,
                },
            });

            const pairsData = pairsResponse.data;

            return pairsData;
        } catch (error) {
            console.error("Error fetching pair data:", error);
        }
    }

    async function fetch24hVolOfPair(pairAddress: String) {
        try {
            // Fetch pair volume
            const volResponse = await client.query({
                query: GetDailyVolOfPair,
                variables: {
                    pairAddress: pairAddress,
                },
            });
            const volData = volResponse.data.pairDayDatas[1].dailyVolumeUSD;
            return volData;
        } catch (error) {
            // console.error("Error fetching volume data:", error);
        }
    }

    function formatPriceValue(value: number): string {
        // Ensure the input value is a number
        const numValue = parseFloat(value as any);
        if (value >= 1_000_000_000) {
            return `$${(value / 1_000_000_000).toFixed(2)}b`;
        } else if (value >= 1_000_000) {
            return `$${(value / 1_000_000).toFixed(2)}m`;
        } else if (value >= 1_000) {
            return `$${(value / 1_000).toFixed(2)}k`;
        } else {
            return `$${numValue.toFixed(0)}`;
        }
    }

    function sortData(data: any[], field: string | number, order = 'asc') {
        return data.sort((a, b) => {
            const valueA = parseFloat(a[field]);
            const valueB = parseFloat(b[field]);
            return order === 'asc' ? valueA - valueB : valueB - valueA;
        });
    }

    function calculateRandomAPR(tvl: number): number {
        const minAnnualReward = 0; // Set the minimum annual reward
        const maxAnnualReward = tvl * 2; // Set the maximum annual reward to twice the TVL for this example

        // Generate a random annual reward between the min and max values
        const annualReward = Math.random() * (maxAnnualReward - minAnnualReward) + minAnnualReward;

        // Calculate APR based on the formula: (Annual Reward / Total Value Locked) * 100
        const apr = (annualReward / tvl) * 100;

        return apr;
    }

    function createData(
        network: string,
        name: string,
        tvl: string,
        tvlValue: number,
        volume: string,
        volumeValue: number,
        apr: string,
        aprValue: number,
        fee: string
    ): Data {
        return {
            network,
            name,
            tvl,
            tvlValue,
            volume,
            volumeValue,
            apr,
            aprValue,
            fee
        }
    }
    async function fetchData() {
        let tempRowsData: any[] = [];
        let dailyTVL = await fetchTVL('desc');

        const promises = dailyTVL.pairs.map(async (pair: { id: string; token0: { symbol: any }; token1: { symbol: any }; reserveUSD: string }) => {
            const pairId = pair.id;
            const protocol = 'Ethereum';
            const pairSymbol = `${pair.token0.symbol}/${pair.token1.symbol}`;

            // TVL
            const reserveUSDValue = parseFloat(pair.reserveUSD);
            const reserveUSD = formatPriceValue(reserveUSDValue);

            // Daily Volume
            const volumeRespond = await fetch24hVolOfPair(pairId);
            const volumeValue = parseFloat(volumeRespond);
            const volume = volumeRespond == 0 || isNaN(volumeValue) ? '$0' : formatPriceValue(volumeValue);
            const fee = (volumeValue * 0.03) == 0 || isNaN(volumeValue) ? '$0' : formatPriceValue((volumeValue * 0.03));

            // APR = (Annual Reward / Total Value Locked) * 100
            const aprValue = calculateRandomAPR(reserveUSDValue); // Replace with actual data
            const apr = `${aprValue.toFixed(2)}%`; // Replace with actual data

            let data = createData(protocol, pairSymbol, reserveUSD, reserveUSDValue, volume, volumeValue, apr, aprValue, fee);
            tempRowsData.push(data);
        });

        // Wait for all promises to resolve
        await Promise.all(promises);
        tempRowsData = sortData(tempRowsData, 'tvlValue', 'desc');
        setPoolData(tempRowsData);
    }


    useEffect(() => {
        fetchData();
    }, [])

    return poolData || []
}

