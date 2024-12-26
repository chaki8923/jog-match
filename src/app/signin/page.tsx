import { auth, signIn , signOut} from '@/auth';


export default async function SigninButton() {
    const session = await auth();
    return (
        <div>
            <form action={async () => {
                "use server";
                await signIn('google', {redirectTo: "/tracking"});
            }}>
                <button>サインイン</button>
            </form>
            <form action={async () => {
                "use server";
                await signOut();
            }}>
                <button>サインアウト</button>
            </form>
            <pre>
                {JSON.stringify(session, null, 2)}
            </pre>
        </div>
    )
} 