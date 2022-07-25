import express from 'express';
import { ApolloServer } from 'apollo-server-express';

import messagesRoute from './routes/messages.js';
import usersRoute from './routes/users.js';
import schema from './schema/index.js';
import resolvers from './resolvers/index.js';
import { readDB } from './dbController.js';

// const app = express();
// app.use(express.urlencoded({ extended: true }));
// app.use(express.json());

// app.use(cors({ origin: 'http://localhost:3000', credentials: true }));

// const routes = [...messagesRoute, ...usersRoute];
// routes.forEach(({ method, route, handler }) => {
//   app[method](route, handler);
// });

/**
REST API는 각 라우팅 경로에 따라 맞는 동작과 자원들을 응답한다면,
Graph QL은 오로지 한 경로를 통해 소통하고, 라우팅 역할은 resolver가 맡아서 하게 된다.
*/

const server = new ApolloServer({
  typeDefs: schema,
  resolvers,
  context: {
    db: {
      messages: readDB('messages'),
      users: readDB('users'),
    },
  },
});

const app = express();
await server.start();
server.applyMiddleware({
  app,
  path: '/graphql',
  cors: {
    origin: ['http://localhost:3000', 'https://studio.apollographql.com'],
    credentials: true,
  },
});

await app.listen({ port: 8000 });
console.log('server listening on 8000...');
