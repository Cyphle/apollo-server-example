import { ApolloServer } from '@apollo/server';
import { describe, expect, it, beforeAll, afterAll } from '@jest/globals';
import request from 'supertest';

describe('integraion test', () => {
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
});

// e2e test
// describe('e2e demo', () => {
//   const queryData = {
//     query: `query sayHello($name: String) {
//     hello(name: $name)
//   }`,
//     variables: { name: 'world' },
//   };
//
//   let server, url;
//
//   // before the tests we spin up a new Apollo Server
//   beforeAll(async () => {
//     // Note we must wrap our object destructuring in parentheses because we already declared these variables
//     // We pass in the port as 0 to let the server pick its own ephemeral port for testing
//     ({ server, url } = await createApolloServer({ port: 0 }));
//   });
//
//   // after the tests we'll stop the server
//   afterAll(async () => {
//     await server?.stop();
//   });
//
//   it('says hello', async () => {
//     // send our request to the url of the test server
//     const response = await request(url).post('/').send(queryData);
//     expect(response.errors).toBeUndefined();
//     expect(response.body.data?.hello).toBe('Hello world!');
//   });
// });