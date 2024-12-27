import TopSwiper from "./component/swiper/swiper";
import AuthButton from "@/app/component/AuthButton.server";
import { SessionProvider } from "next-auth/react";
import { BASE_PATH, auth } from "@/auth";

export default async function Home() {
    const session = await auth();

    return (
        <>
            <AuthButton />
            <SessionProvider basePath={BASE_PATH} session={session}>
                <TopSwiper />
            </SessionProvider>
        </>
    )
} 