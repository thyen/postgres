# @knorm/postgres

[![npm version](https://badge.fury.io/js/%40knorm%2Fpostgres.svg)](https://badge.fury.io/js/%40knorm%2Fpostgres)
[![build status](https://travis-ci.org/knorm/postgres.svg?branch=master)](https://travis-ci.org/knorm/postgres)
[![coverage status](https://coveralls.io/repos/github/knorm/postgres/badge.svg?branch=master)](https://coveralls.io/github/knorm/postgres?branch=master)
[![dependency status](https://david-dm.org/knorm/postgres.svg)](https://david-dm.org/knorm/postgres)
[![Greenkeeper badge](https://badges.greenkeeper.io/knorm/postgres.svg)](https://greenkeeper.io/)

Postgres plugin for [@knorm/knorm](https://www.npmjs.com/package/@knorm/knorm)
that enables running queries agaisnt postgres. Also, it adds postgres-specific
features such as:

* [automatically JSON-stringifying](http://knexjs.org/#Schema-json) all `json`
  and `jsonb` fields before save (insert or update)
* automatically validating all `string` fields with `maxLength: 255`
* `limit`, `offset`, `returning` query options and `ilike` where option,
  via [sql-bricks-postgres](https://github.com/Suor/sql-bricks-postgres)
* updating multiple rows using a single query with `UPDATE FROM`, via
  [sql-bricks-postgres](https://github.com/Suor/sql-bricks-postgres)
* connection pooling, via [pg](https://node-postgres.com/features/pooling)
* transactions

## Installation

```bash
npm install --save @knorm/knorm @knorm/postgres
```

> @knorm/postgres has a peer dependency on [@knorm/knorm](https://www.npmjs.com/package/knorm)

## Usage

```js
const knorm = require('@knorm/knorm');
const knormPostgres = require('@knorm/postgres');

const orm = knorm({
  // knorm options
}).use(
  knormPostgres({
    // knormPostgres options
  })
);
```

## Options

| Option          | Type             | Description                                                                                                                                                                                                                                           |
| --------------- | ---------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `name`          | string           | the name of the plugin, defaults to `'postgres'`                                                                                                                                                                                                      |
| `connection`    | object or string | if set, this option is passed directly to [pg](https://node-postgres.com/features/connecting#programmatic). However, connections can also be configured via [environment variables](https://www.postgresql.org/docs/current/static/libpq-envars.html) |
| `initClient`    | (async) function | a function called when a new client is acquired from the pool. useful for configuring the connection e.g. setting session variables. it's called with the client as the only argument                                                                 |
| `restoreClient` | (async) function | a function called before a client is released back into the pool. useful for restoring a client e.g. unsetting session variables. it's called with the client as the only argument                                                                    |

NOTE that all options are optional.
