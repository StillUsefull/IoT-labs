const fastify = require('fastify')(
    {logger: true}
);
//require('dotenv').config()

const port = process.env.PORT || 3000


fastify.register(require('@fastify/cors'), {
    origin: true
})
fastify.register(require('./controller.js').routes);
fastify.listen({
    port: port,
    host: '0.0.0.0'
}, (err, address) => {
    if (err){
        fastify.log.error(err);
        process.exit(1)
    }
    console.log(`Server was started on: ${address}`)
})
