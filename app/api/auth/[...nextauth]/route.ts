import NextAuth from "next-auth";
import GithubProvider from "next-auth/providers/github";
import type { NextAuthOptions } from "next-auth";

declare module "next-auth" {
  interface Session {
    accessToken?: string;
    provider?: "github" | "bitbucket";
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    accessToken?: string;
    provider?: "github" | "bitbucket";
  }
}

export const authOptions: NextAuthOptions = {
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_ID!,
      clientSecret: process.env.GITHUB_SECRET!,
      authorization: {
        params: {
          scope: "read:user user:email repo",
        },
      },
    }),

    // 🔵 Bitbucket custom OAuth provider
{
  id: "bitbucket",
  name: "Bitbucket",
  type: "oauth",

  authorization: {
    url: "https://bitbucket.org/site/oauth2/authorize",
    params: { scope: "account email repository" },
  },

token: {
  url: "https://bitbucket.org/site/oauth2/access_token",
  async request(context) {
    const redirectUri =
      process.env.NEXTAUTH_URL + "/api/auth/callback/bitbucket";

    console.log("REDIRECT URI SENT:", redirectUri);

    const tokenUrl =
      typeof context.provider.token === "string"
        ? context.provider.token
        : context.provider.token?.url;

    if (!tokenUrl) throw new Error("Bitbucket token URL missing");

    const res = await fetch(tokenUrl, {
      method: "POST",
      headers: {
        Authorization:
          "Basic " +
          Buffer.from(
            `${context.provider.clientId}:${context.provider.clientSecret}`
          ).toString("base64"),
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        grant_type: "authorization_code",
        code: context.params.code as string,
        redirect_uri: redirectUri,
      }),
    });

    const text = await res.text();
    console.log("BITBUCKET TOKEN STATUS:", res.status);
    console.log("BITBUCKET TOKEN BODY:", text);

    if (!res.ok) throw new Error(text);

    return { tokens: JSON.parse(text) };
  },
},




 userinfo: {
  url: "https://api.bitbucket.org/2.0/user",
  async request({ tokens }) {
    const userRes = await fetch("https://api.bitbucket.org/2.0/user", {
      headers: { Authorization: `Bearer ${tokens.access_token}` },
    });

    const emailRes = await fetch("https://api.bitbucket.org/2.0/user/emails", {
      headers: { Authorization: `Bearer ${tokens.access_token}` },
    });

    const user = await userRes.json();
    const emails = await emailRes.json();
    const primaryEmail = emails.values?.find((e: any) => e.is_primary)?.email;

    return { ...user, email: primaryEmail };
  },
},
profile(profile) {
  return {
    id: profile.uuid,
    name: profile.display_name,
    email: profile.email,
    image: profile.links.avatar.href,
  };
},

  clientId: process.env.AUTH_BITBUCKET_ID!,
  clientSecret: process.env.AUTH_BITBUCKET_SECRET!,
}


  ],

  callbacks: {
    async jwt({ token, account }) {
      if (account) {
        token.accessToken = account.access_token;
        token.provider = account.provider as "github" | "bitbucket";
      }
      return token;
    },

    async session({ session, token }) {
      session.accessToken =
        typeof token.accessToken === "string" ? token.accessToken : undefined;
      session.provider = token.provider as "github" | "bitbucket";
      return session;
    },
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
