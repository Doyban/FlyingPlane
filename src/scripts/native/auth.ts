import { SignInWithApple } from "@capacitor-community/apple-sign-in";
import { getAuth, getRedirectResult, OAuthProvider, signInWithCredential, signInWithRedirect } from "firebase/auth";
import { isIosApp, isNativeApp } from "./platform";

const APPLE_CLIENT_ID = "com.doyban.flyingplane";
const APPLE_REDIRECT_URI = "https://tappyplane-b349f.firebaseapp.com/__/auth/callback";

function randomNonce(): string {
  const bytes = new Uint8Array(16);
  const cryptoObject = window.crypto;
  if (cryptoObject && typeof cryptoObject.getRandomValues === "function") {
    cryptoObject.getRandomValues(bytes);
  } else {
    for (let i = 0; i < bytes.length; i++) {
      bytes[i] = Math.floor(Math.random() * 256);
    }
  }

  let hex = "";
  for (let i = 0; i < bytes.length; i++) {
    const part = bytes[i].toString(16);
    hex += part.length === 1 ? "0" + part : part;
  }
  return hex;
}

function sha256Hex(value: string): Promise<string> {
  const cryptoObject = window.crypto;
  if (!cryptoObject || !cryptoObject.subtle || typeof TextEncoder === "undefined") {
    return Promise.resolve(value);
  }

  const encoded = new TextEncoder().encode(value);
  return cryptoObject.subtle.digest("SHA-256", encoded).then(function (digest) {
    const view = new Uint8Array(digest);
    let hex = "";
    for (let i = 0; i < view.length; i++) {
      const part = view[i].toString(16);
      hex += part.length === 1 ? "0" + part : part;
    }
    return hex;
  });
}

function appleProvider(): OAuthProvider {
  return new OAuthProvider("apple.com");
}

/**
 * Finish a Firebase redirect if the page was reloaded by Apple sign-in.
 * Does nothing when there is no pending redirect, so startup stays quiet.
 */
export function completePendingAppleRedirect(): void {
  let auth: ReturnType<typeof getAuth>;
  try {
    auth = getAuth();
  } catch (error) {
    return;
  }

  getRedirectResult(auth).then(function (result) {
    if (result && result.user) {
      alert("Authentication successful.");
    }
  }).catch(function (error) {
    console.log(error);
  });
}

/**
 * iOS uses the native Sign in with Apple sheet, then the existing Firebase web app.
 * Android and the browser keep Firebase redirect sign-in. There is no google-services
 * file in the repo, so the native Firebase Auth plugin is not used.
 */
export function signInWithApple(): Promise<void> {
  const auth = getAuth();

  if (isNativeApp() && isIosApp()) {
    const rawNonce = randomNonce();
    return sha256Hex(rawNonce).then(function (hashedNonce) {
      return SignInWithApple.authorize({
        clientId: APPLE_CLIENT_ID,
        redirectURI: APPLE_REDIRECT_URI,
        scopes: "email name",
        state: rawNonce,
        nonce: hashedNonce,
      });
    }).then(function (result) {
      const credential = appleProvider().credential({
        idToken: result.response.identityToken,
        rawNonce: rawNonce,
      });
      return signInWithCredential(auth, credential);
    }).then(function () {
      return undefined;
    });
  }

  return signInWithRedirect(auth, appleProvider()).then(function () {
    return getRedirectResult(auth);
  }).then(function () {
    return undefined;
  });
}
