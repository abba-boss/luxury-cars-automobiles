const sanitizeHtml = (input) => {
  if (typeof input !== 'string') return input;
  return input.replace(/<[^>]*>/g, '').trim();
};

const sanitizeObject = (obj) => {
  const sanitized = {};
  for (const [key, value] of Object.entries(obj)) {
    if (typeof value === 'string') {
      sanitized[key] = sanitizeHtml(value);
    } else if (Array.isArray(value)) {
      sanitized[key] = value.map(item => 
        typeof item === 'string' ? sanitizeHtml(item) : item
      );
    } else {
      sanitized[key] = value;
    }
  }
  return sanitized;
};

const sanitizeInput = (req, res, next) => {
  if (req.body) {
    req.body = sanitizeObject(req.body);
  }
  if (req.query) {
    req.query = sanitizeObject(req.query);
  }
  next();
};

module.exports = { sanitizeInput };
