const routes = {
  baseRoute: "/students",

  get mongoRoute() {
    return `${this.baseRoute}/mongo`;
  },
  get mongoUploadAll() {
    return `${this.mongoRoute}/uploadAll`;
  },
  get mongoDeleteAll() {
    return `${this.mongoRoute}/deleteAll`;
  },
  get mongoGetAll() {
    return `${this.mongoRoute}/getAll`;
  },

  get postgresRoute() {
    return `${this.baseRoute}/postgres`;
  },
  get postgresDuplicateAllFromMongo() {
    return `${this.postgresRoute}/duplicateAllFromMongo`;
  },
  get postgresDeleteAll() {
    return `${this.postgresRoute}/deleteAll`;
  },
  get postgresGetAll() {
    return `${this.postgresRoute}/getAll`;
  },
};

export default routes;
