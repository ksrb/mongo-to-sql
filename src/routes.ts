import { Route } from "./types";

const routes = {
  baseRoute: "/students",

  get mongoRoute() {
    return `${this.baseRoute}/mongo`;
  },
  get mongoUploadAll(): Route {
    return {
      description: "Uploads all students to MongoDB",
      path: `${this.mongoRoute}/uploadAll`,
    };
  },
  get mongoDeleteAll(): Route {
    return {
      description: "Deletes all students from MongoDB",
      path: `${this.mongoRoute}/deleteAll`,
    };
  },
  get mongoGetAll(): Route {
    return {
      description: "Gets all students from MongoDB",
      path: `${this.mongoRoute}/getAll`,
    };
  },
  get postgresRoute() {
    return `${this.baseRoute}/postgres`;
  },
  get postgresDuplicateAllFromMongo() {
    return {
      description:
        "Gets all students from MongoDB and duplicates them into Postgres",
      path: `${this.postgresRoute}/duplicateAllFromMongo`,
    };
  },
  get postgresDeleteAll(): Route {
    return {
      description: "Deletes all students from Postgres",
      path: `${this.postgresRoute}/deleteAll`,
    };
  },
  get postgresGetAll() {
    return {
      description: "Get all students from Postgres",
      path: `${this.postgresRoute}/getAll`,
    };
  },

  get run() {
    return {
      description:
        "Resets databases and uploads students to MongoDB and duplicates them from MongoDB to Postgres",
      path: "/run",
    };
  },
};

export default routes;
