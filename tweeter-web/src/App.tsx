import "./App.css";
import { BrowserRouter, Navigate, Route, Routes, useLocation } from "react-router-dom";
import Login from "./components/authentication/login/Login";
import Register from "./components/authentication/register/Register";
import MainLayout from "./components/mainLayout/MainLayout";
import Toaster from "./components/toaster/Toaster";
import useUserInfo from "./components/userInfo/UserInfoHook";
import { FolloweePresenter } from "./presenters/FolloweePresenter";
import { FollowerPresenter } from "./presenters/FollowerPresenter";
import { FeedPresenter } from "./presenters/FeedPresenter";
import { StoryPresenter } from "./presenters/StoryPresenter";
import { RegisterView, RegisterPresenter } from "./presenters/RegisterPresenter";
import { LoginPresenter, LoginView } from "./presenters/LoginPresenter";
import PagedItemScroller from "./components/mainLayout/PagedItemScroller";
import { Status, User } from "tweeter-shared";
import { PagedItemView } from "./presenters/PagedItemPresenter";
import UserItem from "./components/userItem/UserItem";
import StatusItem from "./components/statusItem/StatusItem";

const App = () => {
  const { currentUser, authToken } = useUserInfo();

  const isAuthenticated = (): boolean => {
    return !!currentUser && !!authToken;
  };

  return (
    <div>
      <Toaster position="top-right" />
      <BrowserRouter>
        {isAuthenticated() ? <AuthenticatedRoutes /> : <UnauthenticatedRoutes />}
      </BrowserRouter>
    </div>
  );
};

const AuthenticatedRoutes = () => {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route index element={<Navigate to="/feed" />} />
        <Route
          path="feed"
          element={
            <PagedItemScroller
              key={"feed"}
              presenterGenerator={(view: PagedItemView<Status>) => new FeedPresenter(view)}
              itemComponentGenerator={(item: Status) => <StatusItem value={item} />}
            />
          }
        />
        <Route
          path="story"
          element={
            <PagedItemScroller
              key={"story"}
              presenterGenerator={(view: PagedItemView<Status>) => new StoryPresenter(view)}
              itemComponentGenerator={(item: Status) => <StatusItem value={item} />}
            />
          }
        />
        <Route
          path="followees"
          element={
            <PagedItemScroller
              key={"followees"}
              presenterGenerator={(view: PagedItemView<User>) => new FolloweePresenter(view)}
              itemComponentGenerator={(item: User) => <UserItem value={item} />}
            />
          }
        />
        <Route
          path="followers"
          element={
            <PagedItemScroller
              presenterGenerator={(view: PagedItemView<User>) => new FollowerPresenter(view)}
              itemComponentGenerator={(item: User) => <UserItem value={item} />}
            />
          }
        />
        <Route path="logout" element={<Navigate to="/login" />} />
        <Route path="*" element={<Navigate to="/feed" />} />
      </Route>
    </Routes>
  );
};

const UnauthenticatedRoutes = () => {
  const location = useLocation();

  return (
    <Routes>
      <Route
        path="/login"
        element={<Login presenterGenerator={(view: LoginView) => new LoginPresenter(view)} />}
      />
      <Route
        path="/register"
        element={
          <Register presenterGenerator={(view: RegisterView) => new RegisterPresenter(view)} />
        }
      />
      <Route
        path="*"
        element={
          <Login
            originalUrl={location.pathname}
            presenterGenerator={(view: LoginView) => new LoginPresenter(view)}
          />
        }
      />
    </Routes>
  );
};

export default App;
