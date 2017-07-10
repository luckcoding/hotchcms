const redisClient = require('./redis.lib.js');

const TOKEN_EXPIRATION = 60;
const TOKEN_EXPIRATION_SEC = TOKEN_EXPIRATION * 60;


var getToken = function(headers) {
  if (headers && headers.authorization) {
    var authorization = headers.authorization;
    var part = authorization.split(' ');

    if (part.length == 2) {
      var token = part[1];

      return part[1];
    }
    else {
      return null;
    }
  }
  else {
    return null;
  }
};

exports.verifyToken = async function (ctx, next) {
  const token = getToken(ctx.header);
  redisClient.get(token, function (err, result) {
    if (err) {
      ctx.throw(500, err);
    } else {
      console.log(result);
    }
  });
};