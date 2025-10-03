"use client";
export default function Dashboard({ params }: { params: { username: string } }) {
  return <div>{params.username}'s Dashboard</div>;
}
