function buildSuccessPayload(req, { data, message, code, meta } = {}) {
  const payload = {
    ok: true,
    reqId: req.id,
  };

  if (data !== undefined) {
    payload.data = data;
  }

  if (message) {
    payload.message = message;
  }

  if (code) {
    payload.code = code;
  }

  if (meta) {
    payload.meta = meta;
  }

  return payload;
}

function sendSuccess(res, options = {}) {
  const { statusCode = 200 } = options;
  return res.status(statusCode).json(buildSuccessPayload(res.req, options));
}

module.exports = {
  buildSuccessPayload,
  sendSuccess,
};
