"use client";
import { useSession, signIn, signOut } from "next-auth/react";
import { useEffect, useState } from "react";
import NavBar from "./components/nav-bar";

export default function Home() {
 const { data: session } = useSession();
 const [repos, setRepos] = useState([]);
  console.log("Repos:", repos);

  useEffect(() => {
    if (session?.accessToken) {
      fetch("https://api.github.com/user/repos", {
        headers: {
          Authorization: `Bearer ${session.accessToken}`,
        },
      })
        .then((res) => res.json())
        .then((data) => setRepos(data));
    }
  }, [session]);



  return (
    <>
    <NavBar />
    <div className=" min-h-screen ">
      {/* <LoginBtn /> */}
      <div className="text-center mb-12 animate-in fade-in slide-in-from-top duration-700">
          <h1 className="text-5xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-primary via-foreground to-primary bg-clip-text text-transparent">
            AI Project Analyzer
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Analyze code quality, structure, and documentation with detailed insights and actionable suggestions
          </p>
        </div>
    </div>
    </>
  );
}
