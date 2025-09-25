import { gql } from "graphql-tag";

gql`
    query wordOfTheDay {
        wordOfTheDay {
            word_en,
            word_pl,
            type,
            definition_en,
            examples
        }
    }
`;
