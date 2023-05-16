import { ApolloClient, InMemoryCache, gql, useQuery } from '@apollo/client';
import { LAUNCHPAD_SUBGRAPH_URL } from 'constants/index';
import { LaunchpadCommitment, LaunchpadInfo, LaunchpadInfoX } from 'interfaces';
import { useMemo } from 'react';

const GetTopLaunchpad = gql`
query GetTopLaunchpad {
    launchpads {
        claims {
        address
        amount
        token
        }
        endTime
        finalized
        hardcap
        id
        launchpadOwner
        individualCap
        overflow
        price
        result
        softcap
        startTime
        totalCommitment
        totalTokenSale
        paymentCurrency
        launchpadToken
    }
}
`;

const client = new ApolloClient({
    uri: LAUNCHPAD_SUBGRAPH_URL[80001],
    cache: new InMemoryCache(),
})

export const useQueryLaunchpad = () => {

    const launchpadData = useQuery(GetTopLaunchpad, {
        client
    })

    return useMemo(() => {
        const launchpads: LaunchpadInfoX[] = launchpadData?.data?.launchpads?.map((item: LaunchpadInfo) => {
            return {
                ...item,

            }
        })
        const sortLaunchpad = launchpads?.sort((a, b) => Number(b.startTime) - Number(a.startTime))
        console.log("🤦‍♂️ ⟹ returnuseMemo ⟹ sortLaunchpad:", sortLaunchpad)
        return {
            ...launchpadData,
            data: {
                launchpads: sortLaunchpad,
            }
        }
    }, [launchpadData])
}

const GetCommitByAddress = gql`
    query GetCommitByAddress($id: String!, $address: String!) {
    launchpads(where: {id: $id}) {
        commits(where: {address: $address}) {
        commitment
        }
    }
}
`;

export const useQueryCommitUser = (id: string | undefined, address: string | undefined | null): { totalCommitment: string | undefined } => {
    if (!id || !address) return { totalCommitment: undefined }

    const launchpadData = useQuery(GetCommitByAddress, {
        client,
        variables: { id, address }
    })

    return useMemo(() => {
        const launchpads: [{ commits: Array<LaunchpadCommitment> }] = launchpadData?.data?.launchpads?.map((item: LaunchpadCommitment) => {
            return {
                ...item,

            }
        })
        const totalCommitment = launchpads?.[0]?.commits?.length > 0 ? launchpads?.[0]?.commits?.map(i => i?.commitment)?.reduce((a, b) => (Number(a) + Number(b))?.toString()) : '0'
        return {
            // ...launchpadData,
            // data: {
            //     launchpads,
            // },
            totalCommitment
        }
    }, [launchpadData])
}
