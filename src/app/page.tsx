'use client';
import { signIn, signOut, useSession } from 'next-auth/react';

export default function Home() {
  const { data: session } = useSession();

  if (session) {
    return (
      <div className="container mt-5">
        <h2>Signed in as {session.user?.name}</h2>
        <img src={session.user?.image ?? ''} width={50} className="rounded-circle my-3" />
        <br />
        <button className="btn btn-danger" onClick={() => signOut()}>
          Sign Out
        </button>
      </div>
    );
  }

  return (
    <div className="container mt-5">
      <h2>DevLog</h2>
      <button className="btn btn-dark mt-3" onClick={() => signIn('github')}>
        Sign in with GitHub
      </button>
    </div>
  );
}