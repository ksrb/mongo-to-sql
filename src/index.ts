import express, { RequestHandler } from "express";
import { MongoClient } from "mongodb";
import morgan from "morgan";
import { Client } from "pg";
import {
  MONGO_INITDB_ROOT_PASSWORD,
  MONGO_INITDB_ROOT_USERNAME,
  POSTGRES_DB,
  POSTGRES_PASSWORD,
  POSTGRES_USER,
} from "./config";
import mongoHandlers from "./mongo";
import postgresHandlers from "./postgres";
import routes from "./routes";
import students from "./students";
import { Student, WithCollectionAndClient, WithMongoCollection } from "./types";

const app = express();
app.use(morgan("tiny"));

const mongoClient = new MongoClient(
  `mongodb://${MONGO_INITDB_ROOT_USERNAME}:${MONGO_INITDB_ROOT_PASSWORD}@127.0.0.1/?poolSize=20&writeConcern=majority`,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }
);

const postgresClient = new Client({
  user: POSTGRES_USER,
  host: "localhost",
  database: POSTGRES_DB,
  password: POSTGRES_PASSWORD,
  port: 5432,
});

(async () => {
  try {
    await mongoClient.connect();
    const collection = mongoClient.db("school").collection<Student>("students");
    await postgresClient.connect();

    const withMongoCollection: WithMongoCollection<typeof collection> = (fn) =>
      fn(collection);

    const withClients: WithCollectionAndClient<typeof collection> = (fn) =>
      fn(collection, postgresClient);

    const mongoUploadAll = withMongoCollection(mongoHandlers.uploadAll);
    app.get(routes.mongoUploadAll, mongoUploadAll);

    const mongoDeleteAll = withMongoCollection(mongoHandlers.deleteAll);
    app.get(routes.mongoDeleteAll, mongoDeleteAll);

    const mongoGetAll = withMongoCollection(mongoHandlers.getAll);
    app.get(routes.mongoGetAll, mongoGetAll);

    const postgresDuplicateAllFromMongo = withClients(
      postgresHandlers.duplicateAllFromMongo
    );
    app.get(
      routes.postgresDuplicateAllFromMongo,
      postgresDuplicateAllFromMongo
    );

    const postgresDeleteAll = withClients(postgresHandlers.deleteAll);
    app.get(routes.postgresDeleteAll, postgresDeleteAll);

    const postgresGetAll = withClients(postgresHandlers.getAll);
    app.get(routes.postgresGetAll, postgresGetAll);

    const port = 3001;
    app.listen(port, () =>
      console.log(`listening on http://localhost:${port}`)
    );
  } catch (e) {
    console.dir(e);
  }
})();
