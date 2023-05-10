const express = require('express');
const app = express();
const twofactor = require('node-2fa');


app.get('/generate-secret', async (req, res) => {
  const { nameapp, accountname } = req.query;
  try {
    console.log(`Verifying token for secret ${nameapp} and token ${accountname}`);
    const result = twofactor.generateSecret({ name: nameapp, account: accountname});
    console.log(result);
    if (result !== null) {
      res.status(200).json({ 
        success: true,
        data: result,
        message: 'Success Build Secreet'
      });
    } else {
      res.status(401).json({ 
        success: false,
        message: 'Failed Build Secreet'
     });   
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ 
      success: false,
      delta: null,
      message: 'Error occurred while Build Secreet'
    });
  }
});



app.get('/generate-token', async (req, res) => {
  const { secret } = req.query;
  try {
    console.log(`Generating token for secret ${secret}`);
    const token = twofactor.generateToken(secret).token;
    if (token) {
      res.status(200).json({ 
        success: true,
        token,
        message: 'Token generated successfully',

    });
    } else {
      res.status(500).json({ 
        success: false,
        message: 'Token generation failed'
     });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ 
        success: false,
        message: 'Token generation failed'
     });
  }
});

app.get('/verify-token', async (req, res) => {
  const { secret, token } = req.query;
  try {
    console.log(`Verifying token for secret ${secret} and token ${token}`);
    const result = twofactor.verifyToken(secret, token);
    console.log(result);
    if (result !== null && result.delta === 0) {
      res.status(200).json({ 
        success: true,
        delta: result.delta,
        message: 'Token is valid'
      });
    } else {
      res.status(401).json({ 
        success: false,
        delta: result?.delta,
        message: 'Token is not valid'
     });   
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ 
      success: false,
      delta: null,
      message: 'Error occurred while verifying the token'
    });
  }
});



app.listen(3000, () => {
  console.log('Server running on port 3000');
});