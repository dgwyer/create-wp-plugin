#!/usr/bin/env node
const inquirer = require("inquirer");
const argv = require("yargs").argv;
const values = require("./input-data");
const chalk = require("chalk");
const chalkPipe = require("chalk-pipe");
const isSemver = require("is-semver");
const logSymbols = require("log-symbols");
const messages = require("./console-messages");
const titleize = require("titleize");

// Show console welcome message
messages.initial();

//console.log(argv);

process.on("exit", code => {
  if (code === 1) {
    console.log(
      chalk.red(
        `Error: Plugin name missing. Please enter a valid plugin name (e.g. create-wp-plugin my-plugin)`
      )
    );
  } else {
    console.log(
      chalk.green(
        `\nThank you for using create-wp-plugin!\n\nUntil next time...\n`
      )
    );
  }
});

// exit if no plugin name specified
if (argv._.length == 0) {
  process.exit(1);
}

// if no plugin name specified
if (argv.hasOwnProperty("dir") && (argv.dir === "" || argv.dir.length === 0)) {
  //console.log("dir empty?");
  argv.dir = argv._[0];
} else if (argv.hasOwnProperty("dir")) {
  //console.log("we got one!");
  if (argv.dir === true) {
    // this will be true if --dir set on it's own so just use plugin name in this case
    argv.dir = argv._[0];
  }
} else {
  //console.log("no dir? using plugin name as folder");
  argv.dir = argv._[0];
}

// remove '-' and '_' chars
argv.plugin_nice_name = argv._[0].replace(/[_-]/g, " ");

// trim and remove multiple spaces
argv.plugin_nice_name = argv.plugin_nice_name.replace(/ +(?= )/g, "").trim();

argv.plugin_nice_name = titleize(argv.plugin_nice_name);

console.log(chalk.green(`Creating Plugin >> '${argv.plugin_nice_name}'\n`));

const plugin_defaults = {
  name: "New WP Plugin",
  author: "David Gwyer",
  version: "0.0.1"
};

const questions = [
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
        return true;
      } else {
        console.log(
          chalk.red(" error: must be valid semver number (e.g. 0.0.1)")
        );
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
];

inquirer.prompt(questions).then(function(answers) {
  //console.log(answers);

  // dir as option to specify folder name that's different from plugin name >>> --dir="wpgoplugins"

  console.log(chalk.green("\nCreating plugin..."));
});

// To Do
//
// 1. Check if plugin folder already exists? Or warn when plugin is running and exit.
// 2. Whitelist characters for certain fields such as plugin name (look up allowed characters).
// 3. Implement global config object but where to store this when calling npx?
// 4. Make sure dir is string and doesn't include any slash characters.
// 5. When finished creating plugin:
//    a. cd into folder.
//    b. optionally start watching files.
//    c. optionally start web server and open browser (set flag to pick admin or front end). Might need to look into express to figure this out.
// 6. Spin up new GitHub repo too?
