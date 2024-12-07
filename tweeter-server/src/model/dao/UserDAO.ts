import { User } from "tweeter-shared";

export interface UserDAO {
  getUser(alias: string): Promise<User | null>;
  getUserPasswordHash(alias: string): Promise<string | null>;
  putUser(
    firstName: string,
    lastName: string,
    alias: string,
    passwordHash: string,
    imageURL: string
  ): Promise<User | null>;
}
