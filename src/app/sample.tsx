import {signIn} from "@/auth"

export default function Sample() {

    return (
        <form action={async () => {
            'use server'
            await signIn('google', {redirectTo: "/tracking"})
        }}>
            <button>サインイン</button>
        </form>
    )
}