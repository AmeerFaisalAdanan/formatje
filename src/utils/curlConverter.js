/**
 * TypeScript-like interfaces (JSDoc for runtime validation)
 * @typedef {Object} RequestData
 * @property {string} url - The request URL
 * @property {string} [method] - HTTP method (defaults to GET)
 * @property {Object} [headers] - Request headers object
 * @property {Object|string} [body] - Request body
 */

/**
 * Escapes shell special characters in a string
 * @param {string} str - The string to escape
 * @returns {string} The escaped string
 */
const escapeShellArg = (str) => {
  if (typeof str !== 'string') {
    str = String(str);
  }
  // Replace single quotes with '\'' and wrap in single quotes
  return "'" + str.replace(/'/g, "'\"'\"'") + "'";
};

/**
 * Validates the input JSON structure
 * @param {any} data - The data to validate
 * @throws {Error} If validation fails
 */
const validateRequestData = (data) => {
  if (!data || typeof data !== 'object') {
    throw new Error('Input must be a valid JSON object');
  }
  
  if (!data.url || typeof data.url !== 'string') {
    throw new Error('URL is required and must be a string');
  }
  
  if (data.method && typeof data.method !== 'string') {
    throw new Error('Method must be a string');
  }
  
  if (data.headers && (typeof data.headers !== 'object' || Array.isArray(data.headers))) {
    throw new Error('Headers must be an object (not array)');
  }
};

/**
 * Converts headers object to cURL -H flags
 * @param {Object} headers - Headers object
 * @returns {string} cURL header flags
 */
const buildHeaderFlags = (headers) => {
  if (!headers || typeof headers !== 'object' || Array.isArray(headers)) {
    return '';
  }
  
  return Object.entries(headers)
    .filter(([key, value]) => key && value !== undefined && value !== null)
    .map(([key, value]) => ` -H ${escapeShellArg(`${key}: ${String(value)}`)}`)
    .join('');
};

/**
 * Converts body to cURL -d flag
 * @param {Object|string} body - Request body
 * @returns {string} cURL data flag
 */
const buildBodyFlag = (body) => {
  if (!body) return '';
  
  const bodyString = typeof body === 'string' ? body : JSON.stringify(body);
  return ` -d ${escapeShellArg(bodyString)}`;
};

/**
 * Masks sensitive values in a string (like tokens)
 * @param {string} value - The value to potentially mask
 * @param {string} key - The header key to check if masking is needed
 * @returns {string} The masked or original value
 */
const maskSensitiveValue = (value, key) => {
  const sensitiveKeys = ['authorization', 'auth', 'token', 'api-key', 'x-api-key', 'bearer'];
  const keyLower = key.toLowerCase();
  
  if (sensitiveKeys.some(sensitiveKey => keyLower.includes(sensitiveKey))) {
    const valueStr = String(value);
    if (valueStr.length > 20) {
      // Show first 10 and last 4 characters, mask the middle
      return valueStr.substring(0, 10) + '••••••••••••••••' + valueStr.substring(valueStr.length - 4);
    } else if (valueStr.length > 8) {
      // For shorter values, show first 4 and last 2
      return valueStr.substring(0, 4) + '••••••' + valueStr.substring(valueStr.length - 2);
    }
  }
  return value;
};

/**
 * Converts a JSON request object to a cURL command
 * @param {string} jsonString - JSON string containing request details
 * @param {Object} options - cURL options to include
 * @returns {string} Formatted cURL command
 * @throws {Error} If parsing or validation fails
 */
export const convertJsonToCurl = (jsonString, options = {}) => {
  if (!jsonString.trim()) {
    throw new Error('Please provide a JSON object with request details');
  }
  
  let requestData;
  try {
    requestData = JSON.parse(jsonString);
  } catch (e) {
    throw new Error(`Invalid JSON: ${e.message}`);
  }
  
  validateRequestData(requestData);
  
  const { url, method = 'GET', headers, body } = requestData;
  
  // Build both full and masked cURL command parts
  const fullParts = ['curl'];
  const maskedParts = ['curl'];
  
  // Add cURL options first
  if (options.verbose) {
    fullParts.push('-v');
    maskedParts.push('-v');
  }
  if (options.insecure) {
    fullParts.push('-k');
    maskedParts.push('-k');
  }
  if (options.includeHeaders) {
    fullParts.push('-i');
    maskedParts.push('-i');
  }
  if (options.silent) {
    fullParts.push('-s');
    maskedParts.push('-s');
  }
  if (options.followRedirects) {
    fullParts.push('-L');
    maskedParts.push('-L');
  }
  
  // Add method if not GET
  if (method.toUpperCase() !== 'GET') {
    const methodFlag = `-X ${method.toUpperCase()}`;
    fullParts.push(methodFlag);
    maskedParts.push(methodFlag);
  }
  
  // Add headers
  if (headers && typeof headers === 'object' && !Array.isArray(headers)) {
    Object.entries(headers)
      .filter(([key, value]) => key && value !== undefined && value !== null)
      .forEach(([key, value]) => {
        const fullHeader = `-H ${escapeShellArg(`${key}: ${String(value)}`)}`;
        const maskedValue = maskSensitiveValue(value, key);
        const maskedHeader = `-H ${escapeShellArg(`${key}: ${String(maskedValue)}`)}`;
        
        fullParts.push(fullHeader);
        maskedParts.push(maskedHeader);
      });
  }
  
  // Add body
  if (body) {
    const bodyString = typeof body === 'string' ? body : JSON.stringify(body);
    const bodyFlag = `-d ${escapeShellArg(bodyString)}`;
    fullParts.push(bodyFlag);
    maskedParts.push(bodyFlag);
  }
  
  // Add URL
  const urlArg = escapeShellArg(url);
  fullParts.push(urlArg);
  maskedParts.push(urlArg);
  
  // Join with backslashes and line breaks for readability
  const joinString = ' \\\n  ';
  
  return {
    full: fullParts.join(joinString),
    masked: maskedParts.join(joinString)
  };
};

/**
 * Example JSON schemas for user reference
 */
export const exampleJsonSchemas = {
  basic: {
    url: "https://api.example.com/users",
    method: "GET"
  },
  withHeaders: {
    url: "https://api.example.com/profile",
    method: "GET",
    headers: {
      "Authorization": "Bearer your-token-here",
      "Content-Type": "application/json"
    }
  },
  withBody: {
    url: "https://api.example.com/users",
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": "Bearer token123"
    },
    body: {
      name: "John Doe",
      email: "john@example.com"
    }
  },
  complex: {
    url: "https://api.example.com/data",
    method: "PATCH",
    headers: {
      "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9",
      "Content-Type": "application/json",
      "X-API-Version": "v2",
      "User-Agent": "MyApp/1.0"
    },
    body: {
      operation: "update",
      data: {
        fields: ["name", "email"],
        values: {
          name: "Jane O'Connor",
          email: "jane+test@example.com"
        }
      },
      options: {
        validate: true,
        notify: false
      }
    }
  }
};