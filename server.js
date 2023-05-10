const fastify = require('fastify')();
const twofactor = require('node-2fa');


fastify.get('/generate-secret', async (request, reply) => {
  const { nameapp, accountname } = request.query;
  try {
    fastify.log.info(`Verifying token for secret ${nameapp} and token ${accountname}`);
    const result = twofactor.generateSecret({ name: nameapp, account: accountname});
    console.log(result);
    if (result !== null) {
      reply.status(200);
      return { 
        success: true,
        data: result,
        message: 'Success Build Secreet'
      };
    } else {
      reply.status(401);
      return { 
        success: false,
        message: 'Failed Build Secreet'
     };   
    }
  } catch (err) {
    fastify.log.error(err);
    reply.status(500);
    return { 
      success: false,
      delta: null,
      message: 'Error occurred while Build Secreet'
    };
  }
});



fastify.get('/generate-token', async (request, reply) => {
  const { secret } = request.query;
  try {
    fastify.log.info(`Generating token for secret ${secret}`);
    const token = twofactor.generateToken(secret).token;
    if (token) {
      reply.status(200);
      return { 
        success: true,
        token,
        message: 'Token generated successfully',

    };
    } else {
      reply.status(500);
      return { 
        success: false,
        message: 'Token generation failed'
     };
    }
  } catch (err) {
    fastify.log.error(err);
    reply.status(500);
    return { 
        success: false,
        message: 'Token generation failed'
     };
  }
});

fastify.get('/verify-token', async (request, reply) => {
  const { secret, token } = request.query;
  try {
    fastify.log.info(`Verifying token for secret ${secret} and token ${token}`);
    const result = twofactor.verifyToken(secret, token);
    console.log(result);
    if (result !== null && result.delta === 0) {
      reply.status(200);
      return { 
        success: true,
        delta: result.delta,
        message: 'Token is valid'
      };
    } else {
      reply.status(401);
      return { 
        success: false,
        delta: result?.delta,
        message: 'Token is not valid'
     };   
    }
  } catch (err) {
    fastify.log.error(err);
    reply.status(500);
    return { 
      success: false,
      delta: null,
      message: 'Error occurred while verifying the token'
    };
  }
});



fastify.listen(3000, err => {
  if (err) {
    console.error(err);
    process.exit(1);
  }
  console.log('Server running on port 3000');
});
