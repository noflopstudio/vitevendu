import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";

export default function useLiveNotifications(userId = null) {

    const [notifications, setNotifications] = useState([]);

    useEffect(() => {

        const channel = supabase
            .channel("notifications-realtime")
            .on(
                "postgres_changes",
                {
                    event: "INSERT",
                    schema: "public",
                    table: "notifications",
                    filter: userId ? `user_id=eq.${userId}` : undefined
                },
                (payload) => {

                    setNotifications(prev => [
                        payload.new,
                        ...prev
                    ]);

                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };

    }, [userId]);

    return notifications;
}