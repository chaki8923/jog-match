import Form from "./profileForm";
import {auth} from "@/auth";
import AuthButton from "@/app/component/AuthButton.server";


export default async function profile() {
    const session = await auth();
    
    return (
    <>
    <AuthButton></AuthButton>
    <Form session={session} ></Form>
    </>
)

}