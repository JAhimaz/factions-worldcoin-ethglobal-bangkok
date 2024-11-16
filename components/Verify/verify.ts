"use client";
import {
  MiniKit,
  VerificationLevel,
  ISuccessResult,
} from "@worldcoin/minikit-js";

export type VerifyCommandInput = {
  action: string;
  signal?: string;
  verification_level?: VerificationLevel; // Default: Orb
};

type VerifyCommandInputData = {
  action: string;
  signal?: string;
  verification_level: "orb" | "device"; // Orb | Device
};

type HandleVerifyProps = {
  action: string;
  signal?: string;
  verification_level: "orb" | "device";
  onSuccess: (payload: ISuccessResult) => void;
  onFail: (error: any) => void;
};

export const HandleVerify = async ({
  action,
  signal,
  verification_level,
  onSuccess,
  onFail,
}: HandleVerifyProps) => {
  const verifyPayload: VerifyCommandInput = {
    action,
    signal,
    verification_level:
      verification_level === "orb"
        ? VerificationLevel.Orb
        : VerificationLevel.Device,
  };

  if (!MiniKit.isInstalled()) {
    console.warn("Tried to invoke 'verify', but MiniKit is not installed.");
    onFail(new Error("MiniKit is not installed."));
    return;
  }

  try {
    const { finalPayload } = await MiniKit.commandsAsync.verify(verifyPayload);

    if (finalPayload.status === "error") {
      console.error("Command error", finalPayload);
      onFail(finalPayload);
      return;
    }

    const verifyResponse = await fetch(`/api/verify`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        payload: finalPayload as ISuccessResult,
        action: verifyPayload.action,
        signal: verifyPayload.signal,
      }),
    });

    const verifyResponseJson = await verifyResponse.json();

    if (verifyResponseJson.status === 200) {
      console.log("Verification success!", finalPayload);
      onSuccess(finalPayload as ISuccessResult);
    } else {
      console.error("Verification failed", verifyResponseJson);
      onFail(verifyResponseJson);
    }
  } catch (error) {
    console.error("Verification process encountered an error", error);
    onFail(error);
  }
};
