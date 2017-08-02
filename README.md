# knorm-postgres

postgres docker tools for [knorm](https://www.npmjs.com/package/knorm) and its
plugins.

### knorm-postgres start

starts a postgres container. if one doesn't exist, it creates it, downloading
the postgres image if necessary.

#### options:
- `name` *alias: `n`, default: `knorm-postgres`*: specifies the name of the
  postgres container.

Other configurations can be made using environment variables:

- `POSTGRES_PORT`: configures the port number for the container, defaults to
  `5616`
- `POSTGRES_USER`: configures the postgres user for the database, defaults to
  `knorm`
- `POSTGRES_PASSWORD`: configures the postgres password for the database,
  defaults to `knorm`
- `POSTGRES_DB`: configures the postgres database name for the database,
  defaults to `knorm`

### knorm-postgres stop

stops a running postgres container.

#### options:
- `name` *alias: `n`, default: `knorm-postgres`*: specifies the name of the
  postgres container.

### knorm-postgres remove

removes a running/stopped postgres container.

#### options:
- `name` *alias: `n`, default: `knorm-postgres`*: specifies the name of the
  postgres container.
