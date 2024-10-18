import { ChangeEvent } from "react";
import { Buffer } from "buffer";
import { AuthenticationPresenter, AuthenticationView } from "./AuthenticationPresenter";

export interface RegisterView extends AuthenticationView {
  firstName: string;
  lastName: string;
  imageBytes: Uint8Array;
  imageUrl: string;
  imageFileExtension: string;
  setImageBytes: React.Dispatch<React.SetStateAction<Uint8Array>>;
  setImageUrl: React.Dispatch<React.SetStateAction<string>>;
  setImageFileExtension: React.Dispatch<React.SetStateAction<string>>;
}

export class RegisterPresenter extends AuthenticationPresenter {
  public get view() {
    return super.view as RegisterView;
  }

  public async doRegister() {
    this.doFailureReportingOperation(
      async () => {
        this.authenticateOperation(async () => {
          return this.userService.register(
            this.view.firstName,
            this.view.lastName,
            this.view.alias,
            this.view.password,
            this.view.imageBytes,
            this.view.imageFileExtension
          );
        });

        this.view.navigate("/");
      },
      "register user",
      async () => {
        this.view.setIsLoading(false);
      }
    );
  }

  public handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    this.handleImageFile(file);
  };

  public handleImageFile = (file: File | undefined) => {
    if (file) {
      this.view.setImageUrl(URL.createObjectURL(file));

      const reader = new FileReader();
      reader.onload = (event: ProgressEvent<FileReader>) => {
        const imageStringBase64 = event.target?.result as string;

        // Remove unnecessary file metadata from the start of the string.
        const imageStringBase64BufferContents = imageStringBase64.split("base64,")[1];

        const bytes: Uint8Array = Buffer.from(imageStringBase64BufferContents, "base64");

        this.view.setImageBytes(bytes);
      };
      reader.readAsDataURL(file);

      // Set image file extension (and move to a separate method)
      const fileExtension = this.getFileExtension(file);
      if (fileExtension) {
        this.view.setImageFileExtension(fileExtension);
      }
    } else {
      this.view.setImageUrl("");
      this.view.setImageBytes(new Uint8Array());
    }
  };

  public getFileExtension = (file: File): string | undefined => {
    return file.name.split(".").pop();
  };
}
