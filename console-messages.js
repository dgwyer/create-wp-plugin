var figlet = require("figlet");

exports.initial = function() {
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
  console.log("GitHub: https://github.com/dgwyer/create-wp-plugin\n");
  console.log("---\n");
};
