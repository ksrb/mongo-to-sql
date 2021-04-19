export const {
  env: {
    MONGO_INITDB_ROOT_USERNAME,
    MONGO_INITDB_ROOT_PASSWORD,

    ME_CONFIG_MONGODB_ADMINUSERNAME,
    ME_CONFIG_MONGODB_ADMINPASSWORD,

    POSTGRES_USER,
    POSTGRES_PASSWORD,
    POSTGRES_DB,

    PGADMIN_DEFAULT_EMAIL,
    PGADMIN_DEFAULT_PASSWORD,
  },
} = process;

export const port = 3001;
export const hostName = "localhost";
export const protocol = "http";
export const url = `${protocol}://${hostName}:${port}`;
