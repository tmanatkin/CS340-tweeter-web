import {
  UserNavigationHookPresenter,
  UserNavigationHookView
} from "../../presenters/UserNavigationHookPresenter";
import { useState } from "react";
import useToastListener from "../toaster/ToastListenerHook";
import useUserInfo from "../userInfo/UserInfoHook";

interface Props {
  presenterGenerator: (view: UserNavigationHookView) => UserNavigationHookPresenter;
}

const useUserNavigation = (props: Props) => {
  const { displayErrorMessage } = useToastListener();
  const { setDisplayedUser, currentUser, authToken } = useUserInfo();

  const listener: UserNavigationHookView = {
    displayErrorMessage: displayErrorMessage,
    setDisplayedUser: setDisplayedUser
  };

  const [presenter] = useState(props.presenterGenerator(listener));

  const navigateToUser = async (event: React.MouseEvent) => {
    event.preventDefault();
    presenter.navigateToUser(event, authToken!, currentUser!);
  };

  return { navigateToUser };
};

export default useUserNavigation;
