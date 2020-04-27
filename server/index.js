const Glue = require('@hapi/glue');
const consola = require('consola');

if(process.env.NODE_ENV === 'development') {
    require('dotenv').config();
}


exports.init = async function (manifest, options) {
    const server = await Glue.compose(manifest, options);
    await server.start();

    consola.ready({
        message: `Server running at: ${server.info.uri}`,
        badge: true
    });

    return server;
};
