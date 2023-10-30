// For clarity in this example we included our typeDefs and resolvers above our test,
// but in a real world situation you'd be importing these in from different files
import { ApolloServer } from '@apollo/server';
import { describe, expect, it } from '@jest/globals';

const typeDefs = `#graphql
  type Query {
    hello(name: String): String!
  }
`;

const resolvers = {
  Query: {
    hello: (_, { name }) => `Hello ${name}!`,
  },
};

it('returns hello with the provided name', async () => {
  const testServer = new ApolloServer({
    typeDefs,
    resolvers,
  });

  const response = await testServer.executeOperation({
    query: 'query SayHelloWorld($name: String) { hello(name: $name) }',
    variables: { name: 'world' },
  });

  // Note the use of Node's assert rather than Jest's expect; if using
  // TypeScript, `assert`` will appropriately narrow the type of `body`
  // and `expect` will not.

  expect(response.body.kind).toEqual('single');
  expect(response.body['singleResult'].errors).toBeUndefined();
  expect(response.body['singleResult'].data?.hello).toBe('Hello world!');
});