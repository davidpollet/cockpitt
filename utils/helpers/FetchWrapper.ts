export default class FetchWrapper {
  baseURL: string
  constructor(baseURL: string) {
    this.baseURL = baseURL
  }

  async get(endpoint: string) {
    const response = await fetch(this.baseURL + endpoint)
    return response.ok ? response.json() : null
  }

  async put(endpoint: string, body: any) {
    return await this._send("put", endpoint, body)
  }

  async patch(endpoint: string, body: any) {
    return await this._send("PATCH", endpoint, body)
  }

  async post(endpoint: string, body: any) {
    return await this._send("post", endpoint, body)
  }

  async delete(endpoint: string, body: any) {
    return await this._send("delete", endpoint, body)
  }

  async _send(method: string, endpoint: string, body: any) {
    return await fetch(this.baseURL + endpoint, {
      method,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    })
  }
}
