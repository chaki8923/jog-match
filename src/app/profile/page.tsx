import ProfileForm from "./profileForm";
import {auth} from "@/auth";
import AuthButton from "@/app/component/AuthButton.server";

export default async function profile() {
    const session = await auth();    
  
    if (!session) {
      return (
        <>
          <AuthButton />
          <p>ログインしてください。</p>
        </>
      );
    }
  
    return (
      <>
        <AuthButton />
        <ProfileForm session={session} />
      </>
    );
  }
  