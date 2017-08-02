# knorm-postgres

postgres docker tools for [knorm](https://www.npmjs.com/package/knorm) and its
plugins.

### knorm-postgres start

starts a postgres container. if one doesn't exist, it creates it, downloading
the postgres image if necessary.

#### options:
- `name` *alias: `n`, default: `gan-postgres`*: specifies the name of the
  postgres container.
- `port`:  *alias: `p`, default: `5616`*: specifies the port to bind to

In addition to these options, these environment variables will also be passed to
the container:

- `POSTGRES_USER`: configures the postgres user for the container, defaults to
  `knorm`
- `POSTGRES_PASSWORD`: configures the postgres password for the container,
  defaults to `knorm`
- `POSTGRES_DB`: configures the postgres database name for the container,
  defaults to `knorm`

### knorm-postgres stop

stops a running postgres container.

#### options:
- `name` *alias: `n`, default: `gan-postgres`*: specifies the name of the
  postgres container.

### knorm-postgres remove

removes a running/stopped postgres container.

#### options:
- `name` *alias: `n`, default: `gan-postgres`*: specifies the name of the
  postgres container.
