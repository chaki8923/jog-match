import { log } from "console"
import NextAuth from "next-auth"
import GitHub from "next-auth/providers/github"
import Google from "next-auth/providers/google"
 
export const { auth, handlers, signIn, signOut } = NextAuth({
  providers: [GitHub, Google],
  basePath: "/api/auth",
  callbacks: {
    authorized({request, auth}){
        try{
            const {pathname }= request.nextUrl;
            if(pathname === "/protected-page") return !!auth;
            return true
        }catch(err){
            console.log(err);
        }
    },
    jwt({token, trigger, session}){
        if (trigger === 'update') token.name = session.user.name;
        return token;
    }
  }
})