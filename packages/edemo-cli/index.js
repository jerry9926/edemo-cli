#!/usr/bin/env node
const config = require('./package.json');
const program = require('commander');
const download = require('download-git-repo');
const ora = require('ora');
const chalk = require('chalk');
const handlebars = require('handlebars');
const inquirer = require('inquirer');
const fs = require('fs');
const symbols = require('log-symbols');

program.version(config.version, '-v, --version')
  .command('init <name>')
  .action((name) => {
    inquirer.prompt([
      {
        name: 'description',
        message: 'project description'
      },
      {
        name: 'author',
        message: 'author'
      }
    ]).then((answers) => {
      const spinner = ora('Template dowloading...');
      spinner.start();
      download('github:jerry9926/demo-template', name, {clone: false}, (err) => {
        if(err) {
          spinner.fail();
          console.log(symbols.error, chalk.red(err));
        } else {
          const meta = {
            name,
            description: answers.description || 'a tool for creating a demo repo with menu and livereload',
            author: answers.author || ''
          }
          const fileName = `${name}/package.json`;
          const content = fs.readFileSync(fileName).toString();
          const result = handlebars.compile(content)(meta);
          fs.writeFileSync(fileName, result);
          spinner.succeed();
          console.log(symbols.success, chalk.green('Project create success.'));
        }
      })
    })
  });
program.parse(process.argv);
