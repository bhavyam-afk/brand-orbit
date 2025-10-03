"use client";
export default function Profile({ params }: { params: { username: string } }) {
  return <div>{params.username}'s Profile</div>;
}
