import {
  PGADMIN_DEFAULT_EMAIL,
  PGADMIN_DEFAULT_PASSWORD,
  POSTGRES_PASSWORD,
  POSTGRES_USER,
} from "./config";
import routes from "./routes";
import { Route } from "./types";

const mongoRoutes = [
  routes.mongoDeleteAll,
  routes.mongoUploadAll,
  routes.mongoGetAll,
];

const postgresRoutes = [
  routes.postgresDeleteAll,
  routes.postgresDuplicateAllFromMongo,
  routes.postgresGetAll,
];

function renderButton({ path }: Route) {
  return `<button onClick="handleRequest('${path}')">${path}</button>`;
}

function renderRoute(route: Route) {
  const { description } = route;
  return `<tr>
<td class="table_leftCol">${renderButton(route)}</td>
<td>${description}</td>
</tr>`;
}

const page = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>mongo-to-sql</title>
  <link rel="stylesheet" href="https://cdn.simplecss.org/simple.min.css">
  <style>
    .table_leftCol {
      white-space: nowrap;
    }
  </style>
</head>
<body>
<div><strong>Preface</strong></div>
<p>
Went a bit over the top with this one but wanted a simple way to test the
functionality but a CLI and a simple website seemed like similiar levels of
effort.
</p>

<div><strong>Test endpoint</strong></div>
<table>
${renderRoute(routes.run)}
</table>

<div><strong>Mongo endpoints</strong></div>
<table>
${mongoRoutes.map((route) => renderRoute(route)).join("")}
</table>

<div><strong>Postgres endpoints</strong></div>
<table>
${postgresRoutes.map((route) => renderRoute(route)).join("")}
</table>

<div><strong>Response</strong></div>
<pre id="response">Click something above</pre>

<div><strong>Clients</strong></div>
Verify results using clients
<ul>
 <li><a href="http://localhost:8081">Mongo-express</a></li>
 <li><a href="http://localhost:5050">PgAdmin</a>
  <ul>
    <li>Username: ${PGADMIN_DEFAULT_EMAIL}</li>
    <li>Password: ${PGADMIN_DEFAULT_PASSWORD}</li>
    <li>Connection - Host name: postgres</li>
    <li>Connection - Username: ${POSTGRES_USER}</li>
    <li>Connection - Password: ${POSTGRES_PASSWORD}</li>
  </ul>
 </li>
</ul>

<script>
const responseDiv = document.getElementById("response");

async function handleRequest(route) {
  const result = await (await fetch(route)).json();
  responseDiv.innerText = JSON.stringify(result, null, "  ")
}
</script>
</body>
</html>`;

export default page;
