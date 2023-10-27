
import type { CodegenConfig } from '@graphql-codegen/cli';

const config: CodegenConfig = {
  overwrite: true,
  schema: [
    "./src/schemas/schema.graphql",
    "./src/schemas/book.graphql"
    ],
  generates: {
    "src/generated/graphql.ts": {
      plugins: ["typescript", "typescript-resolvers"]
    }
  }
};

export default config;
