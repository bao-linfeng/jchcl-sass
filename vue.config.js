const path = require('path')

function resolve(dir){
    return path.join(__dirname,dir)
}

module.exports = {
    // publicPath:'/manage/',
    productionSourceMap: process.env.NODE_ENV === 'production' ? false : true,
    chainWebpack:config => {
        config.module
        .rule('svg')
        .exclude.add(resolve('src/icons'))
        .end();

        config.module
        .rule('icons')
        .test(/\.svg$/)
        .include.add(resolve('src/icons'))
        .end()
        .use('svg-sprite-loader')
        .loader('svg-sprite-loader')
        .options({symbolId: 'icon-[name]'});
    }
}