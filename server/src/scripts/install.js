require('shelljs/global')

// var settings = cat('./config/settings.js')

// echo('no newline at end');

// console.log(settings.toString())

sed('-i', 'PROGRAM_VERSION', 'v0.1.3', './config/settings.js');