import chalk from "chalk";

export const info = (...args: unknown[]) => {
    console.log(chalk.blueBright("[INFO] "), ...args);
}

export const warn = (...args: unknown[]) => {
    console.log(chalk.yellowBright("[WARN] "), ...args);
}

export const success = (...args: unknown[]) => {
    console.log(chalk.greenBright("[SUCCESS] "), ...args);
}

export const error = (...args: unknown[]) => {
    console.log(chalk.redBright("[ERROR] "), ...args);
}

export const boldPrefix = (prefix: string, ...args: unknown[]) => {
    console.log(chalk.bold(prefix), ...args);
}