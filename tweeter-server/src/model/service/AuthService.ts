import { AuthDAO } from "../dao/AuthDAO";
import { DAOFactory } from "../factory/DAOFactory";

export class AuthService {
  protected authDAO: AuthDAO;

  constructor() {
    const daoFactory = DAOFactory.getInstance();
    this.authDAO = daoFactory.createAuthDAO();
  }

  async validateToken(token: string): Promise<void> {
    const storedAuthToken = await this.authDAO.getAuthToken(token);
    const validTokenDuration = 60 * 60 * 1000; // 1 hour in milliseconds (60 minutes * 60 seconds * 1000 milliseconds)
    if (!storedAuthToken || Date.now() >= storedAuthToken.timestamp + validTokenDuration) {
      throw new Error("Invalid authentication token");
    }
  }

  async getCurrentUserAlias(token: string): Promise<string> {
    const alias = await this.authDAO.getAuthTokenAlias(token);
    return alias;
  }

  async tweeterHandle(alias: string): Promise<string> {
    return `@${alias}`;
  }
}
