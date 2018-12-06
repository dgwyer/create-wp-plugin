console.log("ERERERE");

exports.header_tmpl = function(meta) {
  return `<?php
/*
Plugin Name:  ${meta.display_name}
Plugin URI:   ${meta.plugin_uri}
Description:  ${meta.description}
Version:      ${meta.version}
Author:       ${meta.author}
Author URI:   ${meta.author_uri}
License:      ${meta.license}
License URI:  ${meta.license_uri}
Text Domain:  ${meta.text_domain}
Domain Path:  ${meta.domain_path}
*/`;
};
