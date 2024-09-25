import { useContext } from "react";
import { UserInfoContext } from "../userInfo/UserInfoProvider";
// import { User, AuthToken } from "tweeter-shared";

// interface UserInfo {
//   currentUser: User | null;
//   displayedUser: User | null;
//   authToken: AuthToken | null;
//   updateUserInfo: (currentUser: User, displayedUser: User | null, authToken: AuthToken, remember: boolean) => void;
//   clearUserInfo: () => void;
//   setDisplayedUser: (user: User) => void;
// }

// const useUserInfo = (): UserInfo => {
//   const { currentUser, displayedUser, authToken, updateUserInfo, clearUserInfo, setDisplayedUser } = useContext(UserInfoContext);

//   return {
//     currentUser,
//     displayedUser,
//     authToken,
//     updateUserInfo,
//     clearUserInfo,
//     setDisplayedUser
//   };
// };

const useUserInfo = () => useContext(UserInfoContext);

export default useUserInfo;
