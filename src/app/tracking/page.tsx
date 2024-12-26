import TrackerMap from "../component/TrackerMapComponent";
import {auth} from "@/auth";
import AuthButton from "@/app/component/AuthButton.server";


export default async function tracker() {
    const session = await auth();
    console.log("session", session);
    
    return (
    <>
    <AuthButton></AuthButton>
    <TrackerMap session={session} ></TrackerMap>
    </>
)

}