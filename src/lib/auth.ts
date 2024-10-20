import NextAuth, { DefaultSession } from "next-auth";
import type { Provider } from "next-auth/providers";
import Google from "next-auth/providers/google";


const scopes = [
    "https://www.googleapis.com/auth/userinfo.email",
    "https://www.googleapis.com/auth/userinfo.profile",
    "https://www.googleapis.com/auth/drive",
    "https://www.googleapis.com/auth/drive.file",
    "https://www.googleapis.com/auth/spreadsheets",
    
    //scope to read, send, delete, and manage your email
    "https://www.googleapis.com/auth/gmail.addons.current.message.action",
    "https://www.googleapis.com/auth/gmail.addons.current.message.metadata",
    "https://www.googleapis.com/auth/gmail.addons.current.message.readonly",
    "https://www.googleapis.com/auth/gmail.addons.current.message.action",
    "https://www.googleapis.com/auth/gmail.addons.current.message.metadata",
    "https://www.googleapis.com/auth/gmail.addons.current.message.readonly",
    "https://www.googleapis.com/auth/gmail.addons.current.action.compose",

    "https://mail.google.com/",
  ]

const providers: Provider[] = [
  Google({
    clientId: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    authorization: {
        params: {
            
            prompt: "consent",
            scope: scopes.join(" "),
        }
    }
  }),
];

export const providerMap = providers
  .map((provider) => {
    if (typeof provider === "function") {
      const providerData = provider();
      return { id: providerData.id, name: providerData.name };
    } else {
      return { id: provider.id, name: provider.name };
    }
  })
  .filter((provider) => provider.id !== "credentials");

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: providers,
  pages: {
    signIn: "/",
    error: "/",
  },
  callbacks: {
    jwt: async ({ token, account }) => {  
      return {
        ...token,
        ...account,
      };
    },
    session: ({ session, user, token }) => {
      return {
        ...session,
        user:{
            ...session.user,
            ...user,
            token
        },
      };
    },
    authorized: async ({ auth }) => {
      if (auth) {
        return true;
      }
      return false;
    }
  },
  secret: process.env.AUTH_SECRET,
});

declare module "next-auth" {
    interface Session extends DefaultSession {
      user: {
        name: string;
        email: string;
        image: string;
        token: {
          name: string;
          email: string;
          picture: string;
          sub: string;
          access_token: string;
          expires_in: number;
          scope: string;
          token_type: string;
          id_token: string;
          expires_at: number;
          provider: string;
          type: string;
          providerAccountId: string;
        };
      }
       & DefaultSession["user"];
    }
  }