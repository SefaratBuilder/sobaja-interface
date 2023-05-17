import { ApolloClient, InMemoryCache, gql, useQuery } from '@apollo/client';
import { useEffect, useMemo, useState } from 'react';
// import { InMemoryCache } from '@apollo/client/cache/index'
export interface Data {
    network: string,
    name: string,
    tvl: string,
    tvlValue: number,
    volume: string,
    volumeValue: number,
    apr: string,
    aprValue: number,
    fee: string,
    addresses: string[],
    symbols: string[],
    reserve0: string,
    reserve1: string,
}

const APIURL = 'https://api.thegraph.com/subgraphs/name/anvospace/s-subajaswap'

// Initialize the Apollo Client
const client = new ApolloClient({
    uri: APIURL,
    cache: new InMemoryCache(),
});

const getTotalPair = gql`
    query GetPairs {
        pairs {
        id
    }
    }
`;

const getTransactions = gql`
    query GetTransactions {
        transactions {
            swaps {
            amount0In
            amount0Out
            amount1In
            amount1Out
            pair {
                token0 {
                symbol
                id
                }
                token1 {
                symbol
                id
                }
                createdAtTimestamp
            }
            from
            }
            mints {
            amount0
            amount1
            pair {
                id
                token0 {
                symbol
                id
                }
                token1 {
                symbol
                id
                }
                createdAtTimestamp
            }
            }
        }
    }
`;

// consider to use trackedReserveETH instead of reserveUSD
const GetTVL = gql`
    query GetTopPairs($orderDirection: OrderDirection, $skip: Int) {
        pairs(first: 10, skip: $skip, orderBy: reserveUSD, orderDirection: $orderDirection) {
            id
            reserveUSD
            reserve0
            reserve1
            token0 {
                symbol
                id
            }
            token1 {
                symbol
                id
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

export const useQueryPool = (skipValue: number) => {
    const [poolData, setPoolData] = useState<Data[]>()

    async function fetchTVL(ascOrDesc: String, skip: Number) {
        try {
            // Fetch the top 10 pairs
            const pairsResponse = await client.query({
                query: GetTVL,
                variables: {
                    orderDirection: ascOrDesc,
                    skip: skip
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

        return isNaN(apr) ? 0 : apr;
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
        fee: string,
        addresses: string[],
        symbols: string[],
        reserve0: string,
        reserve1: string,
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
            fee,
            addresses,
            symbols,
            reserve0,
            reserve1

        }
    }
    const fetchData = async (skip: number) => {
        let tempRowsData: any[] = [];
        let dailyTVL = await fetchTVL('desc', skip);

        const promises = dailyTVL.pairs.map(async (pair: { id: string; token0: { symbol: string, id: string }; token1: { symbol: string, id: string }; reserveUSD: string, reserve0: string, reserve1: string }) => {
            const pairId = pair.id;
            const protocol = 'Ethereum';
            const pairSymbol = `${pair.token0.symbol}/${pair.token1.symbol}`;

            // TVL
            const reserveUSDValue = parseFloat(pair.reserveUSD);
            const reserveUSD = formatPriceValue(reserveUSDValue);

            const reserve0 = (pair.reserve0);
            const reserve1 = (pair.reserve1);

            // Daily Volume
            const volumeRespond = await fetch24hVolOfPair(pairId);
            const volumeValue = parseFloat(volumeRespond);
            const volume = volumeRespond == 0 || isNaN(volumeValue) ? '$0' : formatPriceValue(volumeValue);
            const fee = (volumeValue * 0.03) == 0 || isNaN(volumeValue) ? '$0' : formatPriceValue((volumeValue * 0.03));

            // APR = (Annual Reward / Total Value Locked) * 100
            const aprValue = calculateRandomAPR(reserveUSDValue); // Replace with actual data
            const apr = `${aprValue.toFixed(2)}%`; // Replace with actual data
            const addresses = [pair.id, pair.token0.id, pair.token1.id]
            const symbols = ['SBJ-LP', pair.token0.symbol, pair.token1.symbol]
            let data = createData(protocol, pairSymbol, reserveUSD, reserveUSDValue, volume, volumeValue, apr, aprValue, fee, addresses, symbols, reserve0, reserve1);
            tempRowsData.push(data);
        });

        // Wait for all promises to resolve
        await Promise.all(promises);
        tempRowsData = sortData(tempRowsData, 'tvlValue', 'desc');
        setPoolData(tempRowsData);
    }

    useEffect(() => {
        fetchData(skipValue);
    }, [skipValue])

    return poolData || []
}

export const useGetTotalPools = (): number => {
    const query = useQuery(getTotalPair, {
        client
    })

    return useMemo(() => {
        const d = query.data?.pairs?.length
        return d || 0
    }, [query])
}

export interface ISwap {
    amount0In: string,
    amount0Out: string,
    amount1In: string,
    amount1Out: string,
    pair: {
        token0: {
            symbol: string,
            id: string
        },
        token1: {
            symbol: string,
            id: string
        },
        createdAtTimestamp: string
        from: string
        id: string
    },
    type?: string,
    date?: string
}

export interface IMint {
    amount0: string,
    amount1: string,
    pair: {
        id: string,
        token0: {
            symbol: string,
            id: string,
        },
        token1: {
            symbol: string,
            id: string,
        },
        createdAtTimestamp: string,
    },
    type?: string,
    date?: string

}

export interface IDataTransaction {
    swaps: Array<ISwap>
    mints: Array<IMint>
}

const handleDate = (now: number, txTime: number) => {
    const ts = (now - txTime)
    if (ts >= 60 * 60 * 24) {
        return `${Math.round(ts / (60 * 60 * 24))} days ago`
    } else if (ts > 60 * 60) {
        return `${Math.round(ts / (60 * 60))} hours ago`
    } else if (ts > 60) {
        return `${Math.round(ts / 60)} minutes ago`
    }

    return 'Recently'
}

const handleTransaction = (data: Array<IDataTransaction>) => {
    const result: Array<ISwap | IMint> = []
    const currentTimestamp = new Date().getTime() / 1000

    data?.map(d => {
        if (d.swaps?.[0]) {
            result.push({ ...d.swaps?.[0], type: 'Swap', date: handleDate(currentTimestamp, Number(d.swaps?.[0]?.pair?.createdAtTimestamp)) })
        }
        if (d.mints?.[0]) {
            result.push({ ...d.mints?.[0], type: 'Add', date: handleDate(currentTimestamp, Number(d.mints?.[0]?.pair?.createdAtTimestamp)) })
        }
    })

    return result
}

export const useGetPoolsTransactions = (): Array<ISwap | IMint> => {
    const query = useQuery(getTransactions, {
        client
    })

    return useMemo(() => {
        const d: Array<IDataTransaction> = query.data?.transactions

        return handleTransaction(d)
    }, [query])
}
