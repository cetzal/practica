const mix = require('laravel-mix');
const fs = require('fs');
const path = require('path');

// Definimos la ruta de entrada y salida para los archivos JavaScript
const jsInputPath = 'resources/js';
const jsOutputPath = 'public/js';


// Función recursiva para leer los archivos JavaScript dentro del directorio y sus subdirectorios
function readJsFiles(dir) {
    const files = fs.readdirSync(dir);
    console.log('files', files);
    files.forEach(file => {
        const filePath = path.join(dir, file);
        const stat = fs.statSync(filePath);
        
        console.log('filePath', filePath);
        console.log('stat', stat);
        console.log('file', file);

        if (stat.isDirectory()) {
            // Si es un directorio, llamamos recursivamente a la función para explorar sus archivos
            readJsFiles(filePath);
        } else if (path.extname(file) === '.js' && file != 'bootstrap.js') {
            // Si es un archivo JavaScript, lo compilamos
            mix.js(filePath, path.join(jsOutputPath, path.relative(jsInputPath, dir)));
        }
    });
}

// Llamamos a la función con el directorio inicial
readJsFiles(jsInputPath);

/*
 |--------------------------------------------------------------------------
 | Mix Asset Management
 |--------------------------------------------------------------------------
 |
 | Mix provides a clean, fluent API for defining some Webpack build steps
 | for your Laravel application. By default, we are compiling the Sass
 | file for the application as well as bundling up all the JS files.
 |
 */

// mix.js('resources/js/app.js', 'public/js')
//     .js('resources/js/modules/*.js', 'public/js/app.js')
//     .js('resources/js/modules/*/*.js', 'public/js/app.js')
//     .sass('resources/sass/app.scss', 'public/css')
//     .sourceMaps();
