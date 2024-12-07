import { AuthToken } from "tweeter-shared";

export interface AuthDAO {
  getAuthToken(token: string): Promise<AuthToken | null>;
  putAuthToken(authToken: AuthToken, alias: string): Promise<AuthToken | null>;
  deleteAuthToken(token: string): Promise<void>;
  getAuthTokenAlias(token: string): Promise<string>;
}
