const fastifyWebsocket = require('@fastify/websocket');
const { validate } = require("./utils");
const dataSchema = require('./validationSchema/data.json')
const db = require('./db');


exports.routes = async (fastify, options) => {

    //websocket
    const subscriptions = {};
    fastify.register(fastifyWebsocket);
    fastify.get('/ws/:user_id', { websocket: true }, (connection, req) => {
        const { user_id } = req.params;
        if (!subscriptions[user_id]) {
            subscriptions[user_id] = new Set();
        }
        subscriptions[user_id].add(connection.socket);
        connection.socket.on('message', message => {
            console.log(message);
        });
        connection.socket.on('close', () => {
            subscriptions[user_id].delete(connection.socket);
        });
    });

    // swagger

    await fastify.register(require('@fastify/swagger'), {
        routePrefix: '/documentation',
        swagger: {
          info: {
            title: 'Processed Agent Data API',
            description: 'API documentation for Processed Agent Data',
            version: '1.0.0'
          },
          externalDocs: {
            url: 'https://swagger.io',
            description: 'Find more info here'
          },
          host: 'localhost',
          schemes: ['http'],
          consumes: ['application/json'],
          produces: ['application/json']
        },
        exposeRoute: true
      });

     await fastify.register(require('@fastify/swagger-ui'), {
        routePrefix: '/documentation',
        uiConfig: {
          docExpansion: 'full',
          deepLinking: false
        },
        uiHooks: {
          onRequest: function (request, reply, next) { next() },
          preHandler: function (request, reply, next) { next() }
        },
        staticCSP: true,
        transformStaticCSP: (header) => header,
        transformSpecification: (swaggerObject, request, reply) => { return swaggerObject },
        transformSpecificationClone: true
      })



    // routes  
    fastify.post('/processed_agent_data',
    {
        schema: {
          description: 'Creates a new processed agent data entry',
          tags: ['processed_agent_data'],
          summary: 'Create new data entry',
          body: {
            type: 'object',
            properties: {
              road_state: { type: 'integer' },
              user_id: { type: 'integer' },
              x: { type: 'integer' },
              y: { type: 'integer' },
              z: { type: 'integer' },
              latitude: { type: 'number' },
              longitude: { type: 'number' },
            },
            required: ['road_state', 'user_id', 'x', 'y', 'z', 'latitude', 'longitude']
          },
          response: {
            200: {
              description: 'Successful response',
              type: 'object',
              properties: {
                success: { type: 'boolean' }
              }
            }
          }
        }
    },
        async (req, rep) => {
            const data = req.body;
            validate(data, dataSchema);
            const dataWithTime = {...data, timestamp: new Date}
            try {
                await db.none(
                        'INSERT INTO processed_agent_data(road_state, user_id, x, y, z, latitude, longitude, timestamp) VALUES(${road_state}, ${user_id}, ${x}, ${y}, ${z}, ${latitude}, ${longitude}, ${timestamp})',
                        dataWithTime
                )

                if (subscriptions[dataWithTime.user_id]) {
                    subscriptions[dataWithTime.user_id].forEach(socket => {
                        socket.send(JSON.stringify(dataWithTime)); 
                    });
                }
                rep.send({ success: true });
            } catch (err) {
                fastify.log.error(err);
                rep.status(500).send({ error: 'Failed to insert data' });
            }
        }
    );

    fastify.get('/processed_agent_data',
    {
        schema: {
          description: 'Get all processed agent data entries',
          tags: ['processed_agent_data'],
          summary: 'Gets all data',
          response: {
            200: {
              description: 'Successful response',
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  id: { type: 'integer' },
                  road_state: { type: 'integer' },
                  user_id: { type: 'integer' },
                  x: { type: 'integer' },
                  y: { type: 'integer' },
                  z: { type: 'integer' },
                  latitude: { type: 'number' },
                  longitude: { type: 'number' },
                  timestamp: { type: 'string', format: 'date-time' }
                }
              }
            }
          }
        }
    },
        async (req, rep) => {
            try {
                const data = await db.any('SELECT * FROM processed_agent_data');
                rep.send(data);
            } catch (err) {
                fastify.log.error(err);
                rep.status(500).send({ error: 'Failed to fetch data' });
            }
        }
    );

    fastify.get('/processed_agent_data/:id', 
    {
        schema: {
          description: 'Get one processed agent data entrie by id',
          tags: ['processed_agent_data'],
          summary: 'Gets one entrie by id',
          response: {
            200: {
              description: 'Successful response',
                type: 'object',
                properties: {
                  id: { type: 'integer' },
                  road_state: { type: 'integer' },
                  user_id: { type: 'integer' },
                  x: { type: 'integer' },
                  y: { type: 'integer' },
                  z: { type: 'integer' },
                  latitude: { type: 'number' },
                  longitude: { type: 'number' },
                  timestamp: { type: 'string', format: 'date-time' }
                }
            }
          }
        }
    },
        async (req, rep) => {
            try {
                const { id } = req.params;
                const data = await db.oneOrNone('SELECT * FROM processed_agent_data WHERE id = $1', id);
                if (data) {
                    rep.send(data);
                } else {
                    rep.status(404).send({ error: 'Data not found' });
                }
            } catch (err) {
                fastify.log.error(err);
                rep.status(500).send({ error: 'Failed to fetch data' });
            }
        }
    );

    fastify.put('/processed_agent_data/:id', 
    {
        schema: {
          description: 'Update processed agent data entry by id',
          tags: ['processed_agent_data'],
          summary: 'Update data entry',
          body: {
            type: 'object',
            properties: {
              road_state: { type: 'integer' },
              user_id: { type: 'integer' },
              x: { type: 'integer' },
              y: { type: 'integer' },
              z: { type: 'integer' },
              latitude: { type: 'number' },
              longitude: { type: 'number' },
            },
            required: ['road_state', 'user_id', 'x', 'y', 'z', 'latitude', 'longitude']
          },
          response: {
            200: {
              description: 'Successful response',
              type: 'object',
              properties: {
                success: { type: 'boolean' }
              }
            }
          }
        }
    },
        async (req, rep) => {
            try {
                const { id } = req.params;
                validate(req.body, dataSchema)
                const { road_state, user_id, x, y, z, latitude, longitude } = req.body;
                const result = await db.result(
                    'UPDATE processed_agent_data SET road_state = $1, user_id = $2, x = $3, y = $4, z = $5, latitude = $6, longitude = $7 WHERE id = $8',
                    [road_state, user_id, x, y, z, latitude, longitude, id]
                );
                if (result.rowCount > 0) {
                    rep.send({ success: true });
                } else {
                    rep.status(404).send({ error: 'Data not found' });
                }
            } catch (err) {
                fastify.log.error(err);
                rep.status(500).send({ error: 'Failed to update data' });
            }
        }
    );

    fastify.delete('/processed_agent_data/:id', 
    {
        schema: {
          description: 'Delete one processed agent data entrie by id',
          tags: ['processed_agent_data'],
          summary: 'Delete all data',
          response: {
            200: {
                description: 'Successful response',
                type: 'object',
                properties: {
                  success: { type: 'boolean' }
                }
            }
          }
        }
    },
        async (req, rep) => {
            try {
                const { id } = req.params;
                const result = await db.result('DELETE FROM processed_agent_data WHERE id = $1', id);
                if (result.rowCount > 0) {
                    rep.send({ success: true });
                } else {
                    rep.status(404).send({ error: 'Data not found' });
                }
            } catch (err) {
                fastify.log.error(err);
                rep.status(500).send({ error: 'Failed to delete data' });
            }
        }
    );
}