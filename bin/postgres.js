#!/usr/bin/env node
const { exec } = require('shelljs');
const config = require('../config');

const findContainer = name =>
  new Promise(function(resolve, reject) {
    exec(
      `docker ps -a --filter name=${name} --format "{{.ID}} {{.Status}}"`,
      { silent: true },
      (code, stdout, stderr) => {
        if (code !== 0) {
          return reject(new Error(`Could not find container: ${stderr}`));
        }

        const output = stdout.trim();
        if (!output) {
          return resolve();
        }

        const idAndStatus = output.split(' ');
        resolve({
          id: idAndStatus[0],
          status: idAndStatus[1]
        });
      }
    );
  });

const stopContainer = container =>
  new Promise(function(resolve, reject) {
    const { id, status } = container;

    if (status.startsWith('Exited')) {
      return resolve(container);
    }

    exec(`docker stop ${id}`, { silent: true }, (code, stdout, stderr) => {
      if (code !== 0) {
        return reject(new Error(`Could not stop container ${id}: ${stderr}`));
      }

      container.status = 'Exited';
      return resolve(container);
    });
  });

const removeContainer = container =>
  new Promise(function(resolve, reject) {
    const { id, status } = container;

    if (status === 'Removed') {
      return resolve(container);
    }

    exec(`docker rm -f ${id}`, { silent: true }, (code, stdout, stderr) => {
      if (code !== 0) {
        return reject(new Error(`Could not remove container ${id}: ${stderr}`));
      }

      container.status = 'Removed';
      return resolve(container);
    });
  });

const startContainer = container =>
  new Promise(function(resolve, reject) {
    const { id, status } = container;

    if (status.startsWith('Up')) {
      return resolve(container);
    }

    exec(`docker start ${id}`, { silent: true }, (code, stdout, stderr) => {
      if (code !== 0) {
        return reject(new Error(`Could not start container ${id}: ${stderr}`));
      }

      container.status = 'Up';
      resolve(container);
    });
  });

const createContainer = (name, port) =>
  new Promise(function(resolve, reject) {
    const env = `-e POSTGRES_USER=${config.user} -e POSTGRES_DB=${config.database} -e POSTGRES_PASSWORD=${config.password}`;
    name = `--name ${name}`;
    port = `-p ${port}:5432`;

    exec(
      `docker run -d ${name} ${port} ${env} postgres`,
      { silent: true },
      (code, stdout, stderr) => {
        if (code !== 0) {
          return reject(
            new Error(`Could not create container ${name}: ${stderr}`)
          );
        }

        resolve({
          id: stdout.trim(),
          status: 'Up'
        });
      }
    );
  });

/* eslint-disable no-console */

require('yargs')
  .usage('$0 <cmd> [args]')
  .command(
    'start',
    `Start the postgres container. The env variables POSTGRES_DB,
        POSTGRES_USER and POSTGRES_PASSWORD can be configured as normal
        environment variables.`,
    {
      name: {
        alias: 'n',
        default: 'knorm-postgres',
        describe: 'The name of the postgres container'
      },
      port: {
        alias: 'p',
        default: 5616,
        describe: 'The port number to bind to on your machine'
      }
    },
    argv => {
      const port = argv.port;
      const name = argv.name;

      findContainer(name)
        .then(container => {
          if (!container) {
            console.log('creating new postgres container');
            return createContainer(name, port);
          }
          if (container.status.startsWith('Up')) {
            return container;
          }
          console.log('starting postgres container', container);
          return startContainer(container);
        })
        .then(container => {
          console.log('postgres container running', container);
          process.exit(0);
        })
        .catch(error => {
          console.log(error);
          process.exit(1);
        });
    }
  )
  .command(
    'stop',
    'Stop the postgres container',
    {
      name: {
        alias: 'n',
        default: 'knorm-postgres',
        describe: 'The name of the postgres container'
      }
    },
    argv => {
      const name = argv.name;

      findContainer(name)
        .then(container => {
          if (!container) {
            console.log('no postgres container found');
          }
          if (container.status.startsWith('Exited')) {
            return container;
          }
          console.log('stopping postgres container', container);
          return stopContainer(container);
        })
        .then(container => {
          if (container) {
            console.log('postgres container stopped', container);
          }
          process.exit(0);
        })
        .catch(error => {
          console.log(error);
          process.exit(1);
        });
    }
  )
  .command(
    'remove',
    'Remove the postgres container',
    {
      name: {
        alias: 'n',
        default: 'knorm-postgres',
        describe: 'The name of the postgres container'
      }
    },
    argv => {
      const name = argv.name;

      findContainer(name)
        .then(container => {
          if (!container) {
            console.log('no postgres container found');
            return;
          }
          if (container.status.startsWith('Removed')) {
            return container;
          }
          console.log('removing postgres container', container);
          return removeContainer(container);
        })
        .then(container => {
          if (container) {
            console.log('postgres container removed', container);
          }
          process.exit(0);
        })
        .catch(error => {
          console.log(error);
          process.exit(1);
        });
    }
  )
  .demandCommand()
  .help().argv;
