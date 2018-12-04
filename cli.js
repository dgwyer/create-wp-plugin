#!/usr/bin/env node
const argv = require("yargs").argv;

console.log("Welcome to create-wp-plugin\n");

if (argv.ships > 3 && argv.distance < 53.5) {
  console.log("Plunder more riffiwobbles!");
} else {
  console.log("Retreat from the xupptumblers!");
}
