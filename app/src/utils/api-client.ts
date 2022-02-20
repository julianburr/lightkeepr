import deepmerge from "deepmerge";

function create(baseUrl?: string) {
  let _baseUrl = baseUrl;
  let _token: string | undefined;
  let _options: any = {};

  const _headers: any = {
    Accept: "application/json",
    "Content-Type": "application/json",
  };

  function _getOptions(options: any = {}) {
    const x = deepmerge.all([_options, { headers: _headers }, options]);
    console.log({ x });
    return x;
  }

  function setToken(token: string) {
    _token = token;
  }

  function setBaseUrl(baseUrl: string) {
    _baseUrl = baseUrl;
  }

  function setHeader(key: string, value: any) {
    _headers[key] = value;
  }

  function setOptions(options: any) {
    _options = options;
  }

  async function get(path: string, args: any = {}, options: any = {}) {
    const baseUrl = _baseUrl || window?.location?.origin;
    const url = new URL(path.startsWith("http") ? path : `${baseUrl}${path}`);
    url.search = new URLSearchParams(args).toString();

    const response = await fetch(url.toString(), _getOptions(options));
    if (response.status === 204) {
      return { response };
    }

    const data = await response.json();
    if (response.status >= 400) {
      throw new Error(data.message);
    }

    return { response, data };
  }

  async function post(path: string, args: any = {}, options: any = {}) {
    const baseUrl = _baseUrl || window?.location?.origin;
    const url = path.startsWith("http") ? path : `${baseUrl}${path}`;

    const opts = _getOptions({
      method: "POST",
      body: JSON.stringify(args),
      headers: {
        Authorization: _token ? `Bearer ${_token}` : undefined,
      },
      ...options,
    });
    const response = await fetch(url, opts);
    if (response.status === 204) {
      return { response };
    }

    const data = await response.json();
    if (response.status >= 400) {
      throw new Error(data.message);
    }
    return { response, data };
  }

  async function patch(path: string, args: any = {}, options: any = {}) {
    return post(path, args, { method: "PATCH", ...options });
  }

  async function _delete(path: string, args: any = {}, options: any = {}) {
    return post(path, args, { method: "DELETE", ...options });
  }

  return {
    setBaseUrl,
    setToken,
    setHeader,
    setOptions,
    get,
    post,
    patch,
    delete: _delete,
  };
}

const api = create();

export { api, create };
