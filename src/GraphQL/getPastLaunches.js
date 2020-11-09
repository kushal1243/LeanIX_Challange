import gql from 'graphql-tag';

export const GET_PAST_LAUNCHES = gql`
    query launchesPast($limit: Int!) {
        launchesPast(limit: $limit) {
            id
            mission_name
            links {
                video_link
              }
            details
            launch_date_local
            launch_site {
                site_name
            }
            rocket {
                rocket_name
            }
            ships {
                name
                home_port
                image
            }
        }
    }
`;