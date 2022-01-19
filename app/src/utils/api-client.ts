import deepmerge from "deepmerge";

function create(baseUrl?: string) {
  let _baseUrl = baseUrl;
  let _defaultOptions = {
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
  };

  function _getOptions(options: any) {
    return deepmerge(_defaultOptions, options);
  }

  function setBaseUrl(baseUrl: string) {
    _baseUrl = baseUrl;
  }

  async function get(path: string, args: any = {}, options: any = {}) {
    const baseUrl = _baseUrl || window?.location?.origin;
    const url = new URL(path.startsWith("http") ? path : `${baseUrl}${path}`);
    url.search = new URLSearchParams(args).toString();
    const response = await fetch(url.toString(), _getOptions(options));
    const data = await response.json();
    return { response, data };
  }

  async function post(path: string, args: any = {}, options: any = {}) {
    const url = path.startsWith("http") ? path : `${_baseUrl}${path}`;
    const response = await fetch(
      url,
      _getOptions({ method: "POST", body: JSON.stringify(args), ...options })
    );
    const data = await response.json();
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
    get,
    post,
    patch,
    delete: _delete,
  };
}

const api = create();

export { api, create };
