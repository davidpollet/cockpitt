import { Bill } from "src/features/income-tracker/Bill"
import { Project } from "src/features/task-tracker/Project"
import { User } from "src/features/user-auth/User"

export const billsApiRoute = "/api/bills/"
export const userApiRoute = "/api/user/"
export const projectsApiRoute = "/api/projects/"

const apiRoutes = [billsApiRoute, userApiRoute, projectsApiRoute] as const
type ApiRoute = typeof apiRoutes[number]

type data<T extends ApiRoute> = T extends typeof billsApiRoute
  ? Bill
  : T extends typeof userApiRoute
  ? User
  : T extends typeof projectsApiRoute
  ? Project
  : never

const API_METHODS = ["GET", "POST", "PATCH", "PUT", "DELETE"] as const
type ApiMethod = typeof API_METHODS[number]

export default class FetchWrapper<T extends ApiRoute> {
  baseURL: T
  constructor(baseURL: T) {
    this.baseURL = baseURL
  }

  _getEndpoint(body: data<T>) {
    switch (this.baseURL) {
      case "/api/bills/":
      case "/api/projects/": {
        return this.baseURL + body.id
      }
      case "/api/user/": {
        const user = body as User
        return this.baseURL + user.email
      }
      default: {
        const n: never = this.baseURL
        throw n
      }
    }
  }

  async put(body: data<T>) {
    return await this._send("PUT", this._getEndpoint(body), body)
  }

  async patch(body: data<T>) {
    return await this._send("PATCH", this._getEndpoint(body), body)
  }

  async delete(body: data<T>) {
    return await this._send("DELETE", this._getEndpoint(body), body)
  }

  async post(body: data<T>) {
    return await fetch(this.baseURL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    })
  }

  async _send(method: ApiMethod, endpoint: string, body: data<T>) {
    return await fetch(endpoint, {
      method,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    })
  }
}

export const projectsApi = new FetchWrapper("/api/projects/")
export const billsApi = new FetchWrapper("/api/bills/")
export const userApi = new FetchWrapper("/api/user/")
