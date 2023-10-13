import chalk from "chalk";
export const info = (...args) => {
    console.log(chalk.blueBright("[INFO] "), ...args);
};
export const warn = (...args) => {
    console.log(chalk.yellowBright("[WARN] "), ...args);
};
export const success = (...args) => {
    console.log(chalk.greenBright("[SUCCESS] "), ...args);
};
export const error = (...args) => {
    console.log(chalk.redBright("[ERROR] "), ...args);
};
export const boldPrefix = (prefix, ...args) => {
    console.log(chalk.bold(prefix), ...args);
};
//# sourceMappingURL=TextDisplay.js.map