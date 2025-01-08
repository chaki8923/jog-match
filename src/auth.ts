import NextAuth from "next-auth"
// import GitHub from "next-auth/providers/github"
import Google from "next-auth/providers/google"
import { PrismaAdapter } from "@auth/prisma-adapter"
import { prisma } from "@/prisma"

// 認証APIのベースパス
export const BASE_PATH = "https://jog-match.vercel.app/api/auth";
 
export const { auth, handlers, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  providers: [Google({clientId: process.env.GOOGLE_CLIENT_ID ,clientSecret: process.env.GOOGLE_CLIENT_SECRET})],
  basePath: BASE_PATH,
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    authorized({request, auth}){
        try{
            const {pathname }= request.nextUrl;
            console.log(pathname);
            
            if(pathname === "/protected-page") return !!auth;
            return true
        }catch(err){
            alert(err)
        }
    },
    jwt({token, trigger, session}){
        if (trigger === 'update') token.name = session.user.name;
        return token;
    }
  }
})