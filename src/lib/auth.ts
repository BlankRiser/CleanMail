import NextAuth, { DefaultSession } from "next-auth";
import type { Provider } from "next-auth/providers";
import Google from "next-auth/providers/google";
import { env } from "../env.mjs";


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
    clientId: env.GOOGLE_CLIENT_ID,
    clientSecret: env.GOOGLE_CLIENT_SECRET,
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
      if (account) {
        // First-time login, save the `access_token`, its expiry and the `refresh_token`
        return {
          ...token,
          ...account,
        }
      } else if (Date.now() < (token.expires_at as number) * 1000) {
        // Subsequent logins, but the `access_token` is still valid
        return token
      } else {
        // Subsequent logins, but the `access_token` has expired, try to refresh it
        if (!token.refresh_token) throw new TypeError("Missing refresh_token")
 
        try {
          // The `token_endpoint` can be found in the provider's documentation. Or if they support OIDC,
          // at their `/.well-known/openid-configuration` endpoint.
          // i.e. https://accounts.google.com/.well-known/openid-configuration
          const response = await fetch("https://oauth2.googleapis.com/token", {
            method: "POST",
            body: new URLSearchParams({
              client_id: env.GOOGLE_CLIENT_ID,
              client_secret: env.GOOGLE_CLIENT_SECRET,
              grant_type: "refresh_token",
              refresh_token: token.refresh_token as string,
            }),
          })
 
          const tokensOrError = await response.json()
 
          if (!response.ok) throw tokensOrError
 
          const newTokens = tokensOrError as {
            access_token: string
            expires_in: number
            refresh_token?: string
          }
 
          token.access_token = newTokens.access_token
          token.expires_at = Math.floor(
            Date.now() / 1000 + newTokens.expires_in
          )
          // Some providers only issue refresh tokens once, so preserve if we did not get a new one
          if (newTokens.refresh_token)
            token.refresh_token = newTokens.refresh_token
          return token
        } catch (error) {
          console.error("Error refreshing access_token", error)
          // If we fail to refresh the token, return an error so we can handle it on the page
          token.error = "RefreshTokenError"
          return token
        }
      }
    },
    session: ({ session, user, token }) => {

      return {
        ...session,
        error: token.error,
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
  secret: env.AUTH_SECRET,
});

declare module "next-auth" {

  interface JWT {
    access_token?: string;
    expires_at: number;
    refresh_token?: string;
    error?: string;
  }
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
       error?: string;
    }
}

