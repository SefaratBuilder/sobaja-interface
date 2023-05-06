import { ApolloClient, InMemoryCache, gql, useQuery } from '@apollo/client';
import { LAUNCHPAD_SUBGRAPH_URL } from 'constants/index';

const GetTopLaunchpad = gql`
    query GetTopLaunchpad {
        launchpadCreateds {
            address
            id
            launchpadTemplate
            owner
        }
    }
`;

// const client = new ApolloClient({
//     uri: LAUNCHPAD_SUBGRAPH_URL[80001],
//     cache: new InMemoryCache(),
// })

export const useQueryLaunchpad = () => {
    // const launchpadData = useQuery(GetTopLaunchpad, {
    //     client
    // })

    // return launchpadData
    return
}

