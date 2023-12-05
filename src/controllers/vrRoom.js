const https = require('https');
require("dotenv").config();

function makeModel(requestBody) {
  return new Promise((resolve, reject) => {
    const headers = getAuthenticationHeader(process.env.VRPUBLIC, process.env.VRSECRET);
    const options = {
      hostname: 'api.revery.ai',
      path: "/console/v1/process_new_garment",
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...headers
      },
    };

    const req = https.request(options, (res) => {
      let data = '';

      res.on('data', (chunk) => {
        data += chunk;
      });

      res.on('end', () => {
        resolve(data); // Resolve the promise with the response data
      });
    });

    req.on('error', (error) => {
      reject(error); // Reject the promise with the error
    });

    if (requestBody) {
      req.write(JSON.stringify(requestBody));
    }

    req.end();
  });
}


function getmodels(gender) {
  return new Promise((resolve, reject) => {
    const headers = getAuthenticationHeader(process.env.VRPUBLIC, process.env.VRSECRET);
    const options = {
      hostname: 'api.revery.ai',
      path: `/console/v1/get_model_list?gender=${gender}`,
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...headers
      },
    };

    const req = https.request(options, (res) => {
      let data = '';

      res.on('data', (chunk) => {
        data += chunk;
      });

      res.on('end', () => {
        resolve(data); // Resolve the promise with the response data
      });
    });

    req.on('error', (error) => {
      reject(error); // Reject the promise with the error
    });

      req.write(JSON.stringify({gender:gender}));
    

    req.end();
  });}
const  MakeRequest= (vrprop,image) => {
  console.log(vrprop)
  var requestBody={};
  if(vrprop.vrpos==="bottoms"){
  requestBody = {
    category: vrprop.vrpos,
    bottoms_sub_category:vrprop.vrpossec,
    gender: vrprop.gender,
    garment_img_url: image
  };}
  else{
    requestBody = {
      category: vrprop.vrpos,
      gender: vrprop.gender,
      garment_img_url: image
    };
  }
  return makeModel(requestBody); // Return the promise from makeModel
}


function requesttryon(garments,gender) {
  return new Promise((resolve, reject) => {
    const headers = getAuthenticationHeader(process.env.VRPUBLIC, process.env.VRSECRET);
    const options = {
      hostname: 'api.revery.ai',
      path: "/console/v1/request_tryon",
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...headers
      },
    };

    const req = https.request(options, (res) => {
      let data = '';

      res.on('data', (chunk) => {
        data += chunk;
      });

      res.on('end', () => {
        resolve(data); // Resolve the promise with the response data
      });
    });

    req.on('error', (error) => {
      reject(error); // Reject the promise with the error
    });
    console.log(garments)
    var id="1697455153"
      if(gender==="m")
      id="1675184224"
      req.write(JSON.stringify({garments:garments,
        model_id:id
      }));
    

    req.end();
  });}


const getAuthenticationHeader=(public_key, secret_key)=> {
    var pbkdf2 = require('pbkdf2')
    let time =  parseInt(Date.now()/1000);
    var derivedKey = pbkdf2.pbkdf2Sync(secret_key, time.toString(), 128, 32, 'sha256');
    derivedKey = derivedKey.toString('hex');

    return {
      "public_key": public_key,
      "one_time_code": derivedKey,
      "timestamp": time,
  };
}



module.exports = {
  MakeRequest,getmodels,requesttryon,makeModel
};