"use client";

import React from "react";
import { useSession, signIn } from "next-auth/react";

export default function MetaConnectButton() {
  const { data: session, status } = useSession();

  const handleConnect = () => {
  const clientId = process.env.NEXT_PUBLIC_META_APP_ID;
  const redirectUri = process.env.NEXT_PUBLIC_META_REDIRECT_URI;

  if (!clientId || !redirectUri) {
    console.error("Missing Meta env vars");
    return;
  }

  // If the user is not authenticated, trigger sign-in so we can get `session.user.id`
  if (status !== "authenticated") {
    signIn();
    return;
  }

  // 🔒 ALWAYS send a valid state (now session should be available)
  const statePayload = {
    creatorId: session?.user?.id,
    username: session?.user?.username,
  };
  console.log("Meta OAuth state payload:", statePayload);
  if (!statePayload.creatorId) {
    console.error("Missing creatorId in session — ensure NextAuth session includes user.id via callbacks");
    return;
  }
  const state = encodeURIComponent(JSON.stringify(statePayload));

  const scope = [
  "email",
  "public_profile",
  "pages_show_list",
  "pages_read_engagement",
  "instagram_basic",
  "instagram_manage_insights",
].join(",");

  const authUrl =
    `https://www.facebook.com/v19.0/dialog/oauth` +
    `?client_id=${clientId}` +
    `&redirect_uri=${encodeURIComponent(redirectUri)}` +
    `&scope=${encodeURIComponent(scope)}` +
    `&response_type=code` +
    `&state=${state}`;

  window.location.href = authUrl;
};


  return (
    <button onClick={handleConnect} className="px-4 py-2 bg-blue-600 text-white rounded">
      Connect Instagram
    </button>
  );
}
