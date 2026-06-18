import { supabase } from "../supabaseClient";

export default function TestNotif() {

    const sendTest = async () => {

        const { data: { user } } = await supabase.auth.getUser();

        console.log("USER AUTO =", user);

        const { data, error } = await supabase.from("notifications").insert([{
            user_id: user?.id || null,
            message: "🔥 TEST REALTIME OK"
        }]);

        console.log({ data, error });
    };

    return (
        <button onClick={sendTest}>
            🔔 Test Notification
        </button>
    );
}