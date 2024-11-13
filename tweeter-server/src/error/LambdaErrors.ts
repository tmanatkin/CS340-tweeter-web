export function validateRequest(request: Record<string, any>, params: string[]): void {
  // valid request object
  if (!request || typeof request !== "object") {
    throw new Error("[Bad Request] Invalid request object.");
  }

  // required parameters
  const missingParams = params.filter((param) => !(param in request));
  if (missingParams.length > 0) {
    throw new Error(`[Bad Request] Missing required parameters: ${missingParams.join(", ")}`);
  }
}
