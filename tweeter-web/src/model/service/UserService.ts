import { User, AuthToken, Status } from "tweeter-shared";
import { ServerFacade } from "../net/ServerFacade";
import { Buffer } from "buffer";

export class UserService {
  private serverFacade: ServerFacade;

  constructor() {
    this.serverFacade = new ServerFacade();
  }

  public async getUser(authToken: AuthToken, alias: string): Promise<User | null> {
    const request = {
      token: authToken.token,
      userAlias: alias
    };
    return this.serverFacade.getUser(request);
  }

  public async register(
    firstName: string,
    lastName: string,
    alias: string,
    password: string,
    userImageBytes: Uint8Array,
    imageFileExtension: string
  ): Promise<[User, AuthToken]> {
    // Not neded now, but will be needed when you make the request to the server in milestone 3
    const imageStringBase64: string = Buffer.from(userImageBytes).toString("base64");
    const request = {
      firstName,
      lastName,
      alias,
      password,
      imageStringBase64: imageStringBase64,
      imageFileExtension
    };
    return this.serverFacade.register(request);
  }

  public async login(alias: string, password: string): Promise<[User, AuthToken]> {
    const request = {
      alias,
      password
    };
    return this.serverFacade.login(request);
  }

  public async logout(authToken: AuthToken): Promise<void> {
    const request = {
      token: authToken.token
    };
    return this.serverFacade.logout(request);
  }

  public async postStatus(authToken: AuthToken, newStatus: Status): Promise<void> {
    const request = {
      token: authToken.token,
      newStatus: newStatus.dto
    };
    return this.serverFacade.postStatus(request);
  }
}
