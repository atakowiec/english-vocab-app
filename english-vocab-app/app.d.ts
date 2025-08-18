import  {GraphQLFormattedError as BaseGraphQLFormattedError} from "graphql";

declare module "*.png"

type GraphQLFormattedErrorExtensions = {
  code: string;
  errors: { [key: string]: string };
}

type GraphQLFormattedError = BaseGraphQLFormattedError & { extensions?: GraphQLFormattedErrorExtensions }