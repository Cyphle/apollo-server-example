import express from 'express';
import http from 'http';
import cors from 'cors';
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer';
import { expressMiddleware } from '@apollo/server/express4';
import { readFileSync } from 'fs';
import { ApolloServer } from '@apollo/server';
import { GraphQLResolveInfo } from 'graphql';
import { Book, QueryBookByTitleArgs, Resolvers } from './generated/graphql.js';
import { MoviesAPI } from './remotes/movies-api.js';

const typeDefs = readFileSync('./src/schemas/schema.graphql', { encoding: 'utf-8' });

//
// const typeDefs = `#graphql
//   # Comments in GraphQL strings (such as this one) start with the hash (#) symbol.
//
//   # This "Book" type defines the queryable fields for every book in our data source."
//   type Book {
//     """
//     Description for field
//     Supports **multi-line** description for your [API](http://example.com)!
//     """
//     title: String
//     author: String
//   }
//
//   # The "Query" type is special: it lists all of the available queries that
//   # clients can execute, along with the return type for each. In this
//   # case, the "books" query returns an array of zero or more Books (defined above).
//   type Query {
//     books: [Book]
//   }
// `;

// const resolvers = {
//   Query: {
//     books: () => books,
//   },
// };

export const resolvers: Resolvers = {
  Query: {
    // TypeScript now complains about the below resolver because
    // the data returned by this resolver doesn't match the schema type
    // (i.e., type Query { books: [Book] })
    books: (): Book[] => {
      return books;
    },
    bookByTitle: (parent: Book, args: Partial<QueryBookByTitleArgs>, contextValue, info: GraphQLResolveInfo): Book => {
      return books.find((book) => book.title === args.title);
    }
  },
}

const books = [
  {
    title: 'The Awakening',
    author: 'Kate Chopin',
  },
  {
    title: 'City of Glass',
    author: 'Paul Auster',
  },
];

// The ApolloServer constructor requires two parameters: your schema
// definition and your set of resolvers.
// const server = new ApolloServer({
//   typeDefs,
//   resolvers,
// });
//
// Passing an ApolloServer instance to the `startStandaloneServer` function:
//  1. creates an Express app
//  2. installs your ApolloServer instance as middleware
//  3. prepares your app to handle incoming requests
// const { url } = await startStandaloneServer(server, {
//   listen: { port: 4000 },
// });
//
// console.log(`🚀  Server ready at: ${url}`);

interface MyContext {
  token?: string;
  dataSources: {
    moviesApi: MoviesAPI
  }
}

const app = express();
const httpServer = http.createServer(app);
const server = new ApolloServer<MyContext>({
  typeDefs,
  resolvers,
  plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
  status400ForVariableCoercionErrors: true
});

async function startServer() {
  return await server.start();
}

(function main() {
  startServer()
      .then(() => {
        app.use(
            '/graphql',
            cors<cors.CorsRequest>(),
            express.json(),
            expressMiddleware(server, {
              context: async ({ req }) => {
                const { cache } = server;
                const context: MyContext = {
                  token: req.headers.token as string,
                  dataSources: {
                    moviesApi: new MoviesAPI({ cache })
                  }
                }
                return context
              },
            }),
        );

        httpServer.listen({ port: 4000 }, () => {
          console.log(`🚀 Server ready at http://localhost:4000/graphql`)
        })
      })

})();
