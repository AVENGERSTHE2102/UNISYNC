function serializeMeta(meta) {
  if (!meta || typeof meta !== 'object') {
    return '';
  }

  try {
    return ` ${JSON.stringify(meta)}`;
  } catch (error) {
    return ' {"serialization":"failed"}';
  }
}

function log(level, message, meta) {
  if (process.env.NODE_ENV === 'test') {
    return;
  }

  const line = `[${new Date().toISOString()}] ${level.toUpperCase()} ${message}${serializeMeta(meta)}`;
  console[level === 'error' ? 'error' : 'log'](line);
}

module.exports = {
  info(message, meta) {
    log('info', message, meta);
  },
  warn(message, meta) {
    log('warn', message, meta);
  },
  error(message, meta) {
    log('error', message, meta);
  },
};
