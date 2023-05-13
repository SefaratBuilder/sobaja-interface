import { ApolloClient, InMemoryCache, gql, useQuery } from '@apollo/client';
import { LAUNCHPAD_SUBGRAPH_URL } from 'constants/index';
import { LaunchpadInfo, LaunchpadInfoX } from 'interfaces';
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
        return {
            ...launchpadData,
            data: {
                launchpads,
            }
        }
    }, [launchpadData])
}

