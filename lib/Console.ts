import chalk from 'chalk';

class Console {
  private moduleName: string;

  constructor(moduleName: string) {
    this.moduleName = moduleName;
  }

  success(message: string) {
    console.log(`${chalk.bgGreen(`[${this.moduleName}]`)} ${chalk.gray(new Date().toUTCString())} ${message}`);
  }

  warning(message: string) {
    console.log(`${chalk.bgYellow(`[${this.moduleName}]`)} ${chalk.gray(new Date().toUTCString())} ${message}`);
  }

  error(message: string) {
    console.log(`${chalk.bgRed(`[${this.moduleName}]`)} ${chalk.gray(new Date().toUTCString())} ${message}`);
  }
}

export default Console;