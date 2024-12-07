export interface ProfileImageDAO {
  putImage(filename: string, imageStringBase64Encoded: string): Promise<string>;
}
