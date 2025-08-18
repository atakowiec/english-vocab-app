import { gql } from "graphql-tag";

export const REFRESH_TOKEN_MUTATION = gql`
    mutation RefreshToken($refreshToken: String!) {
        refreshToken(refreshToken: $refreshToken) {
            accessToken
            refreshToken
            user {
                id
                name
                email
            }
        }
    }
`;

export const REGISTER_MUTATION = gql`
    mutation Register($email: String!, $name: String!, $password: String!) {
        register(input: { email: $email, name: $name, password: $password })
    }
`

export const LOGIN_MUTATION = gql`
    mutation Login($email: String!, $password: String!) {
        login(input: {email: $email, password: $password}) {
            user {
                email
                name
                id
            }
            accessToken
            refreshToken
        }
    }
`