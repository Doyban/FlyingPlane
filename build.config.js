module.exports = {
    mode: 'production', // Set to 'development' when developing or to 'production' when deploying.
    gameDir: `./src`,
    entryFilePath: 'scripts/Index.ts', // Dont start with "/" as it's given in webpack config.
    // Output settings.
    terserOutput: {
        comments: false,
        quote_keys: false,
        keep_quoted_props: false,
    },
    // Mangle (mix, rename etc.) settings.
    mangle: {
        keep_fnames: false,
        keep_classnames: false,
        toplevel: true,
        safari10: true,
    },
    // Compress settings.
    compress: {
        arguments: false,
        collapse_vars: true,
        conditionals: false,
        arrows: false,
        unsafe_arrows: false,
        loops: true,
        toplevel: true,
        reduce_funcs: true,
        reduce_vars: true,
        join_vars: true,
        drop_console: true
    }
};