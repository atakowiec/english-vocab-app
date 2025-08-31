import type { CodegenConfig } from '@graphql-codegen/cli';

const config: CodegenConfig = {
  overwrite: true,
  schema: './src/schema.gql',
  documents: ['../english-vocab-app/**/*.{ts,tsx}'],
  generates: {
    '../english-vocab-app/graphql/gql-generated.ts': {
      plugins: ['typescript', 'typescript-operations', 'typescript-react-apollo'],
      config: {
        withHooks: true,
      },
    },
  },
};

export default config;
