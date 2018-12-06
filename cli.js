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
const shell = require("shelljs");
const execa = require("execa");
const exists = require("global-module-exists");
const { header_tmpl } = require("./templates/plugin_header");

// some initial defaults
// const plugin_defaults = {
//   name: "New WP Plugin",
//   author: "David Gwyer",
//   version: "0.0.1",
// };

// store plugin meta as it's generated
const plugin_meta = {
  install_parcel: true,
  plugin_uri: "",
  description: "",
  author_uri: "",
  license: "GPL2",
  license_uri: "",
  domain_path: "/languages"
};

// Show console welcome message
messages.initial();

process.on("exit", code => {
  if (code === 1) {
    //console.log(chalk.red(`Error: terminating script`));
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

// handle plugin dir
if (argv.hasOwnProperty("dir") && (argv.dir === "" || argv.dir.length === 0)) {
  //console.log("dir empty?");
  plugin_meta.dir = argv._[0];
} else if (argv.hasOwnProperty("dir")) {
  //console.log("we got one!");
  if (argv.dir === true) {
    // this will be true if --dir set on it's own so just use plugin name in this case
    plugin_meta.dir = argv._[0];
    //plugin_meta.dir = argv._[0];
  } else {
    plugin_meta.dir = argv.dir;
  }
} else {
  //console.log("no dir? using plugin name as folder");
  plugin_meta.dir = argv._[0];
  //plugin_meta.dir = argv._[0];
}

plugin_meta.slug = argv._[0];

// remove '-' and '_' chars
plugin_meta.display_name = argv._[0].replace(/[_-]/g, " ");
//argv.plugin_nice_name = argv._[0].replace(/[_-]/g, " ");

// trim and remove multiple spaces
plugin_meta.display_name = plugin_meta.display_name
  .replace(/ +(?= )/g, "")
  .trim();
//argv.plugin_nice_name = argv.plugin_nice_name.replace(/ +(?= )/g, "").trim();

plugin_meta.display_name = titleize(plugin_meta.display_name);
//argv.plugin_nice_name = titleize(argv.plugin_nice_name);

console.log(chalk.blue(`1) LET'S GATHER SOME PLUGIN DETAILS (1/4)\n`));

console.log(chalk.green(`Plugin Name: ${plugin_meta.display_name}\n`));

// Is Parcel module installed globally?
if (exists("parcel") || exists("parcel-bundler")) {
  plugin_meta.install_parcel = false;
}

const questions = [
  {
    type: "input",
    name: "plugin_description",
    message: "Plugin Description:",
    filter: function(input) {
      return input.trim();
    },
    default: function() {
      return "New WordPress plugin";
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
  },
  {
    type: "list",
    name: "parcel_module",
    message: "Install Parcel",
    choices: ["Globally", "Locally", "Don't install"]
  }
];

// remove last question if Parcel globally installed
if (plugin_meta.install_parcel === false) {
  questions.splice(questions.length - 1);
}

inquirer.prompt(questions).then(function(answers) {
  // populate meta object with entered data
  plugin_meta.version = answers.plugin_version;
  plugin_meta.author = answers.plugin_author;
  plugin_meta.text_domain = answers.plugin_text_domain;
  plugin_meta.description = answers.plugin_description;

  // Is Parcel module installed globally?
  if (exists("parcel") || exists("parcel-bundler")) {
    console.log(
      "\nGlobal Parcel module found. Great! This will save a lot of time. Skipping install...\n"
    );
  }

  console.log(chalk.blue(`2) CREATING PLUGIN FILES (2/4)\n`));

  if (shell.mkdir(plugin_meta.dir).code !== 0) {
    console.log(chalk.red(`Error: Main plugin folder cannot be created`));
    shell.exit(1);
  }

  //  shell.exec(`mkdir ${plugin_meta.dir}`);
  shell.cd(plugin_meta.dir);
  shell.exec("npm init -y"); // create package.json file
  shell.touch("functions.php");

  if (shell.mkdir("languages").code !== 0) {
    console.log(chalk.red(`Error: languages folder cannot be created`));
    shell.exit(1);
  }
  if (shell.mkdir("assets").code !== 0) {
    console.log(chalk.red(`Error: assets folder cannot be created`));
    shell.exit(1);
  }
  if (shell.mkdir("assets/js").code !== 0) {
    console.log(chalk.red(`Error: assets/js folder cannot be created`));
    shell.exit(1);
  }
  if (shell.mkdir("assets/css").code !== 0) {
    console.log(chalk.red(`Error: assets/css folder cannot be created`));
    shell.exit(1);
  }

  // install Parcel
  if (answers.hasOwnProperty("parcel_module")) {
    if (answers.parcel_module === "Globally") {
      console.log(
        "\nInstalling Parcel globally. Please be patient, this could take a couple of minutes.\nTh"
      );
      shell.exec("npm i -g parcel-bundler");
      //execa.shellSync("npm i -g parcel-bundler");
    } else if (answers.parcel_module === "Locally") {
      console.log(
        "\nInstalling Parcel locally. Please be patient, this could take a couple of minutes.\n\nTop tip! If you install Parcel globally (e.g. npm i -g parcel) then create-wp-plugin runs MUCH quicker."
      );
      shell.exec("npm i parcel-bundler");
      //execa.shellSync("npm i parcel-bundler");
    } else {
      // console.log("Unknown value for Parcel");
    }
  }

  console.log(header_tmpl(plugin_meta));

  console.log(answers);
  console.log(argv);
  console.log(plugin_meta);

  // dir as option to specify folder name that's different from plugin name >>> --dir="wpgoplugins"

  console.log(chalk.green("\nCreating plugin..."));

  //shell.exec('npm list -g --depth=0"');

  // if (shell.mkdir(plugin_meta.dir).code !== 0) {
  //   console.log(chalk.red(`Error: Plugin folder cannot be created`));
  //   shell.exit(1);
  // }

  // shell.cd(plugin_meta.dir);
  // shell.touch("functions.php");

  // if (shell.exec("npm init -y").code !== 0) {
  //   shell.echo("Error: Cannot create package.json");
  //   shell.exit(1);
  // }

  // if (shell.exec("npm i parcel-bundler --save-dev").code !== 0) {
  //   shell.echo("Error: Cannot install Parcel");
  //   shell.exit(1);
  // }

  // (async () => {
  //   // Pipe the child process stdout to the current stdout
  //   execa("echo", ["2. unicorns"]).stdout.pipe(process.stdout);
  //   execa("mkdir", ["tezza"]).stdout.pipe(process.stdout);
  //   execa("cd", ["tezza"]).stdout.pipe(process.stdout);
  //   execa("pwd").stdout.pipe(process.stdout);
  //   execa("npm i parcel-bundler").stdout.pipe(process.stdout);
  // })();

  //shell.mkdir("-p", "/plugin_folder");
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
// 7. Add choice of licenses, but for now just add GPLv2+.
// 9. Class or function prefix?
// 10. Naming rules for functions etc. And need the plugin dir validating too. https://github.com/ahmadawais/create-guten-block/issues/18
// 11. Add data to object rather than to argv object?
// 12. https://parceljs.org/getting_started.html
// 13. Add option to install node modules now or later. If later then the plugin creation process will be a lot faster, and so add dependencies to package.json manually and prompt them to run npm i later at the end of the script. (might be a package out there to edit package.json).
// 14. Say in docs that if you have parcel installed globally then this will significantly improve the plugin creation time.
// 15. If a free plugin meant for wp.org then create an optional readme file too.
// 16. Setup some task runner jobs to process pot file etc.
// 17. Could also offer other setup configs that use webpack instead of parcel.
