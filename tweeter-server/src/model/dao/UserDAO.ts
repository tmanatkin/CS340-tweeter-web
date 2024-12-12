import { User } from "tweeter-shared";

export interface UserDAO {
  getUser(alias: string): Promise<User | null>;
  getUserPasswordHash(alias: string): Promise<string | null>;
  getUserFollowCounts(
    alias: string
  ): Promise<{ followeeCount: number; followerCount: number } | null>;
  putUser(
    firstName: string,
    lastName: string,
    alias: string,
    passwordHash: string,
    imageURL: string
  ): Promise<User | null>;
  adjustFolloweeCount(alias: string, delta: number): Promise<void>;
  adjustFollowerCount(alias: string, delta: number): Promise<void>;
}
