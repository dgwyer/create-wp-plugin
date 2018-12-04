#!/usr/bin/env node
const inquirer = require("inquirer");
//const argv = require("yargs").argv;
const values = require("./input-data");
const chalk = require("chalk");
const chalkPipe = require("chalk-pipe");
var figlet = require("figlet");
const isSemver = require("is-semver");
const logSymbols = require("log-symbols");

console.clear();

console.log(
  figlet.textSync("create-wp-plugin", {
    //font: "Ghost",
    horizontalLayout: "default",
    verticalLayout: "default"
  })
);
console.log("\nCreated by David Gwyer");
console.log("Twitter: https://twitter.com/dgwyer");
console.log("GitHub: https://github.com/dgwyer/wp-block\n");
console.log("-----\n");

// if (argv.ships > 3 && argv.distance < 53.5) {
//   console.log("Plunder more riffiwobbles!");
// } else {
//   console.log("Retreat from the xupptumblers!");

const plugin_defaults = {
  name: "New WP Plugin",
  author: "David Gwyer",
  version: "0.0.1"
};

const questions = [
  {
    type: "input",
    name: "plugin_name",
    message: "Plugin Name:",
    default: function() {
      return plugin_defaults.name;
    },
    filter: function(input) {
      return input.trim();
    },
    validate: function(input) {
      if (input.trim()) {
        console.log(logSymbols.success);
        return true;
      } else {
        console.log(chalk.red("(required)"));
        return false;
      }
    }
  },
  {
    type: "input",
    name: "plugin_author",
    message: "Plugin Author:",
    filter: function(input) {
      return input.trim();
    }
  },
  {
    type: "input",
    name: "plugin_version",
    message: "Plugin Version:",
    default: function() {
      return "0.0.1";
    },
    filter: function(input) {
      return input.trim();
    },
    validate: function(input) {
      if (isSemver(input)) {
        console.log(chalk.green("(required)"));
        return true;
      } else {
        console.log(chalk.red("(required)"));
        return false;
      }
    }
  },
  {
    type: "input",
    name: "plugin_text_domain",
    message: "Text Domain:",
    default: function() {
      return "wordpress";
    },
    filter: function(input) {
      return input.trim();
    }
  }
  // {
  //   type: "list",
  //   name: "servedIn",
  //   message: "How do you prefer your coffee to be served in",
  //   choices: values.servedIn
  // },
  // {
  //   type: "confirm",
  //   name: "stirrer",
  //   message: "Do you prefer your coffee with a stirrer?",
  //   default: true
  // },
  // {
  //   type: "input",
  //   name: "last_name",
  //   message: "What's your last name",
  //   default: function() {
  //     return "Doe";
  //   }
  // },
  // {
  //   type: "input",
  //   name: "fav_color",
  //   message: "What's your favorite color",
  //   transformer: function(color, answers, flags) {
  //     const text = chalkPipe(color)(color);
  //     if (flags.isFinal) {
  //       return text;
  //     }
  //     return text;
  //   }
  // }
];

inquirer.prompt(questions).then(function(answers) {
  console.log(answers);

  // dir as option to specify folder name that's different from plugin name >>> --dir="wpgoplugins"
});

// To Do
//
// 1. Check if plugin folder already exists? Or warn when plugin is running and exit.
// 2. Whitelist characters for certain fields such as plugin name (look up allowed characters).
// 3. Implement global config object but where to store this when calling npx?
