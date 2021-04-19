import express from "express";
import { MongoClient } from "mongodb";
import morgan from "morgan";
import fetch from "node-fetch";
import { Client } from "pg";
import {
  MONGO_INITDB_ROOT_PASSWORD,
  MONGO_INITDB_ROOT_USERNAME,
  port,
  POSTGRES_DB,
  POSTGRES_PASSWORD,
  POSTGRES_USER,
  url,
} from "./config";
import mongoHandlers from "./mongo";
import page from "./page";
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

    // Mongo routes
    app.get(
      routes.mongoUploadAll.path,
      withMongoCollection(mongoHandlers.uploadAll)
    );
    app.get(
      routes.mongoDeleteAll.path,
      withMongoCollection(mongoHandlers.deleteAll)
    );
    app.get(routes.mongoGetAll.path, withMongoCollection(mongoHandlers.getAll));

    // Postgres routes
    app.get(
      routes.postgresDuplicateAllFromMongo.path,
      withClients(postgresHandlers.duplicateAllFromMongo)
    );
    app.get(
      routes.postgresDeleteAll.path,
      withClients(postgresHandlers.deleteAll)
    );
    app.get(routes.postgresGetAll.path, withClients(postgresHandlers.getAll));

    // Other routes
    app.get(routes.run.path, async (req, res) => {
      try {
        await fetch(`${url}${routes.mongoDeleteAll.path}`);
        await fetch(`${url}${routes.mongoUploadAll.path}`);
        await fetch(`${url}${routes.postgresDeleteAll.path}`);
        await fetch(`${url}${routes.postgresDuplicateAllFromMongo.path}`);
        const results = await fetch(`${url}${routes.postgresGetAll.path}`);
        res.status(200).send(await results.json());
      } catch (e) {
        res
          .status(500)
          .json({ message: `Fail: request failed with error ${e}` });
      }
    });
    app.get("/", async (req, res) => {
      res.send(page);
    });
    app.listen(port, () => console.log(`listening on ${url}`));
  } catch (e) {
    console.dir(e);
  }
})();
