interface FacebookDialogOptions {
  method: string;
  message: string;
}

interface FacebookConnectPlugin {
  showDialog(
    options: FacebookDialogOptions,
    onSuccess: () => void,
    onError: () => void
  ): void;
}

/**
 * Game requests (apprequests) have no maintained Capacitor plugin.
 * cordova-plugin-facebook-connect stays on Capacitor's Cordova bridge for this one call.
 */
function getFacebookConnect(): FacebookConnectPlugin | null {
  const candidate = (window as any).facebookConnectPlugin as FacebookConnectPlugin | undefined;
  if (!candidate || typeof candidate.showDialog !== "function") {
    return null;
  }
  return candidate;
}

export function showFacebookAppRequest(
  message: string,
  onSuccess: () => void,
  onError: () => void
): void {
  const facebook = getFacebookConnect();
  if (!facebook) {
    onError();
    return;
  }

  try {
    facebook.showDialog(
      {
        method: "apprequests",
        message: message,
      },
      onSuccess,
      onError
    );
  } catch (error) {
    onError();
  }
}
