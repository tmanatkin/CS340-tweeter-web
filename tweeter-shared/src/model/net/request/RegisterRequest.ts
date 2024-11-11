export interface RegisterRequest {
  readonly firstName: string;
  readonly lastName: string;
  readonly alias: string;
  readonly password: string;
  readonly userImageBytes: Uint8Array;
  readonly imageFileExtension: string;
}
