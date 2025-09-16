import { gql } from "graphql-tag";

export const GET_NEXT_WORDS_FOR_SPEED_TEST_QUERY = gql`
    query getNextWords {
        getNextWords {
            word {
                id
                definition_en
                word_en
                word_pl
                examples
                type
                base_word_en, 
                other_forms, 
                tags
            }
            similarEnWords
            similarPlWords
            wordLearnEntry {
                speedModeCorrectAnswers
                speedModeWrongAnswers
            }
        }
    }
`;