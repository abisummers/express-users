const bcrypt = require("bcrypt");
const chalk = require("chalk");

//ENCRYPT passwords
//using for a sign up and seed file for creating users
//bcrypt.hash();
const encryptedFox = bcrypt.hashSync("Fox", 10);
console.log(chalk.red(encryptedFox));

const encryptedEmpty = bcrypt.hashSync("", 10);
console.log(chalk.green(encryptedEmpty));

//used for logging in
//bcrypt.compare();
console.log(bcrypt.compareSync("Fox", encryptedFox));
console.log(bcrypt.compareSync("fox", encryptedFox));
