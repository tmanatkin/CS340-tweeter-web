import { User, AuthToken } from "tweeter-shared";

export interface View {
  displayErrorMessage: (message: string) => void;
}

export interface MessageView extends View {
  displayInfoMessage: (message: string, duration: number) => void;
  clearLastInfoMessage: () => void;
}

export interface AuthTokenView extends View {
  authToken: AuthToken | null;
}

export interface CurrentUserView extends View {
  currentUser: User | null;
}

export interface SetIsLoadingView extends View {
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
}

export class Presenter<V extends View> {
  private _view: V;

  protected constructor(view: V) {
    this._view = view;
  }

  protected get view(): V {
    return this._view;
  }

  public async doFailureReportingOperation(
    operation: () => Promise<void>,
    operationDescription: string,
    finallyOperation?: () => void
  ) {
    try {
      await operation();
    } catch (error) {
      this.view.displayErrorMessage(
        `Failed to ${operationDescription} because of exception: ${error}`
      );
    } finally {
      if (finallyOperation) {
        finallyOperation();
      }
    }
  }
}
