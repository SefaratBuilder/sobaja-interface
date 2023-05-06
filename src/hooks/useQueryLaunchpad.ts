import { ApolloClient, InMemoryCache, gql, useQuery } from '@apollo/client';
import { LAUNCHPAD_SUBGRAPH_URL } from 'constants/index';

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

    return launchpadData
}

