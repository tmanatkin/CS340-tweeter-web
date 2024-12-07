import { UserDAO } from "../dao/UserDAO";
import { AuthDAO } from "../dao/AuthDAO";
import { DynamoDBUserDAO } from "../dao/dynamodb/DynamoDBUserDAO";
import { DynamoDBAuthDAO } from "../dao/dynamodb/DynamoDBAuthDAO";
import { ProfileImageDAO } from "../dao/ProfileImageDAO";
import { S3ProfileImageDAO } from "../dao/dynamodb/S3ProfileImageDAO";
import { FollowDAO } from "../dao/FollowDAO";
import { DynamoDBFollowDAO } from "../dao/dynamodb/DynamoDBFollowDAO";
import { FeedDAO } from "../dao/FeedDAO";
import { DynamoDBFeedDAO } from "../dao/dynamodb/DynamoDBFeedDAO";
import { StoryDAO } from "../dao/StoryDAO";
import { DynamoDBStoryDAO } from "../dao/dynamodb/DynamoDBStoryDAO";

export class DAOFactory {
  private static instance: DAOFactory;

  public static getInstance(): DAOFactory {
    if (!DAOFactory.instance) {
      DAOFactory.instance = new DAOFactory();
    }
    return DAOFactory.instance;
  }

  public createUserDAO(): UserDAO {
    return new DynamoDBUserDAO();
  }

  public createAuthDAO(): AuthDAO {
    return new DynamoDBAuthDAO();
  }

  public createProfileImageDAO(): ProfileImageDAO {
    return new S3ProfileImageDAO();
  }

  public createFollowDAO(): FollowDAO {
    return new DynamoDBFollowDAO();
  }

  public createFeedDAO(): FeedDAO {
    return new DynamoDBFeedDAO();
  }

  public createStoryDAO(): StoryDAO {
    return new DynamoDBStoryDAO();
  }
}
