import { supabase } from "../supabaseClient";

export async function logEvent(action, message, user_id = null) {

    try {
        await supabase.from("logs").insert([
            {
                action,
                message,
                user_id,
                created_at: new Date()
            }
        ]);
    } catch (error) {
        console.log("LOG ERROR:", error);
    }
}