export function getSafeCallbackUrl(
  callbackUrl: string | undefined
): string {
  if (
    !callbackUrl ||
    !callbackUrl.startsWith("/") ||
    callbackUrl.startsWith("//")
  ) {
    return "/users/profile";
  }

  return callbackUrl;
}