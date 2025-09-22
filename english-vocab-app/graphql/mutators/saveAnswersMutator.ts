import { gql } from "graphql-tag";

export const SAVE_ANSWERS_MUTATOR = gql`
    mutation saveAnswers($input: [GivenAnswerInput!]!) {
        saveAnswers(input: $input)
    }
`;