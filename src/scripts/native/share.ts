import { Share } from "@capacitor/share";
import { hasPlugin } from "./platform";

export interface FlyingPlaneShareOptions {
  message: string;
  subject: string;
  url: string;
}

/**
 * cordova-plugin-x-socialsharing replacement.
 * The old calls also passed www/assets/images/logo.png, which is not in this repo.
 * Share the message, subject, and url. A missing plugin calls onError instead of throwing.
 */
export function shareWithOptions(
  options: FlyingPlaneShareOptions,
  onSuccess: () => void,
  onError: () => void
): void {
  if (!hasPlugin("Share")) {
    onError();
    return;
  }

  Share.share({
    title: options.subject,
    text: options.message,
    url: options.url,
    dialogTitle: options.subject,
  }).then(function () {
    onSuccess();
  }).catch(function () {
    onError();
  });
}
