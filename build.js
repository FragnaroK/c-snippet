// build.js - build script
// usage: node build.js

const chalk = require('chalk');
const packageObj = require('./package.json');

async function build() {
  // Build typescript project using tsc, chalk and ora (spinner)

  const { exec } = require('child_process');
  const chalk = require('chalk');
  const ora = require('ora');

  const spinner = ora('Building project...').start();

  exec('npx tsc', (err, stdout, stderr) => {
    if (err) {
      spinner.fail(chalk.red('Failed to build project'));
      console.log(chalk.red(err));
      return;
    }

    spinner.succeed(chalk.green('Project built successfully'));
    console.log(chalk.green(stdout), '\n\n');
  });
}

async function main() {
  // clear console
  if (process.platform === 'win32') {
    process.stdout.write('\x1Bc');
  } else {
    process.stdout.write('\x1B[2J\x1B[3J\x1B[H');
  }
  
  console.log(chalk.blue(`Build script started -> ${packageObj.name} v${packageObj.version}`), '\n');
  setTimeout(async () => {
    await build();
  }, 1000);
}

main();
