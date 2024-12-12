import { UserService } from "../../model/service/UserService";

export const handler = async function (event: any) {
  const userService = new UserService();
  const recordsArray = Array.isArray(event.Records) ? event.Records : [event.Records];
  for (let i = 0; i < recordsArray.length; ++i) {
    const { body } = recordsArray[i];
    await userService.jobHandler(JSON.parse(body));
  }
  return null;
};
