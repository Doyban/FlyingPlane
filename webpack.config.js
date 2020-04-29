const buildConfig = require('./build.config');
const path = require('path');
const fs = require('fs');
const fs_extra = require('fs-extra');
const remove_dir = require('delete');

// Necesary webpack plugins.
const HtmlWebpackPlugin = require('html-webpack-plugin');
const BrowserAsyncPlugin = require('browser-sync-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');

// Phaser webpack config.
const phaserModule = path.join(__dirname, '/node_modules/phaser/');
const phaser = path.join(phaserModule, 'src/phaser.js');

// Take directory and entry file path from build.config.js file.
const game_directory = `${buildConfig.gameDir}`;
const entry_file_path = `${buildConfig.entryFilePath}`;

remove_dir.sync('./dist'); // Delete the dist folder every time we build the pack.

// Copy all the given assets to dist folder.
const copyFilesAndDirectory = (src, dest) => {
    fs.exists(src, (exists) => {
        if (!exists) return;
        console.log(">>>>src---" + src, dest);
        fs_extra.copySync(src, dest);
    });
};

// Array of objects that are copied to dist folder from source folder.
let toCopy = [{
        from: `${game_directory}/assets/audio`,
        to: './dist/assets/audio'
    },
    {
        from: `${game_directory}/assets/images`,
        to: './dist/assets/images'
    },
    {
        from: `${game_directory}/assets/bitmapfonts`,
        to: './dist/assets/bitmapfonts'
    },
    {
        from: `${game_directory}/assets/json`,
        to: './dist/assets/json'
    },
    {
        from: `${game_directory}/assets/spritesheets`,
        to: './dist/assets/spritesheets'
    },
    {
        from: `${game_directory}/assets/xml`,
        to: './dist/assets/xml'
    },
    {
        from: `${game_directory}/js/plugins`,
        to: './dist/plugins'
    },
];

// Copy all the assets from source to dist folder.
for (let i = 0; i < toCopy.length; i++) {
    copyFilesAndDirectory(toCopy[i].from, toCopy[i].to);
}

// Export the webpack configuration.
module.exports = {
    mode: buildConfig.mode, // When it is production by default the uglify plugin activated else it wont.
    // Entry points to the chunk.
    entry: {
        app: [`${game_directory}/${entry_file_path}`],
        vendor: [phaser]
    },
    // Emit the output chunks with respective entry name.
    output: {
        filename: '[name].[hash].js',
        path: path.resolve(__dirname, 'dist'),
    },
    watch: true, // Helps to run browser-sync plugin.
    // Add webpack plugins.
    plugins: [
        new HtmlWebpackPlugin({
            filename: '../dist/index.html',
            template: `./index.html`,
            chunks: ['vendor', 'app'],
            hash: true
        }),
        new BrowserAsyncPlugin({
            host: process.env.IP || 'localhost',
            port: process.env.PORT || 3000,
            server: {
                baseDir: ['./dist']
            },
        })
    ],
    // Modules support.
    module: {
        rules: [{
                test: /\.js$/,
                use: ['babel-loader'],
                include: path.join(__dirname, game_directory)
            },
            {
                test: /\.ts$/,
                use: ['babel-loader', 'awesome-typescript-loader'],
                include: path.join(__dirname)
            },
        ]
    },
    // Need to resolve the module that is being imported in the code.
    resolve: {
        extensions: ['.ts', '.js'],
    },
    // Optimize the code with options that makes code less in size.
    optimization: {
        minimize: true,
        minimizer: [
            new TerserPlugin({
                test: /\.js(\?.*)?$/i,
                terserOptions: {
                    output: {
                        comments: buildConfig.terserOutput.comments,
                        quote_keys: buildConfig.terserOutput.quote_keys,
                        keep_quoted_props: buildConfig.terserOutput.keep_quoted_props,
                    },
                    mangle: {
                        keep_fnames: buildConfig.mangle.keep_fnames,
                        keep_classnames: buildConfig.mangle.keep_classnames,
                        toplevel: buildConfig.mangle.toplevel,
                        safari10: buildConfig.mangle.safari10,
                    },
                    compress: {
                        arguments: buildConfig.compress.arguments,
                        collapse_vars: buildConfig.compress.collapse_vars,
                        conditionals: buildConfig.compress.conditionals,
                        arrows: buildConfig.compress.arrows,
                        unsafe_arrows: buildConfig.compress.unsafe_arrows,
                        loops: buildConfig.compress.loops,
                        toplevel: buildConfig.compress.toplevel,
                        reduce_funcs: buildConfig.compress.reduce_funcs,
                        reduce_vars: buildConfig.compress.reduce_vars,
                        join_vars: buildConfig.compress.join_vars,
                        drop_console: buildConfig.compress.drop_console
                    },
                },
            }),
        ],
    },
};