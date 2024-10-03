
import { createClient, RealtimePostgresChangesPayload } from "@supabase/supabase-js"
import { useCallback, useEffect, useState, } from 'react';

const supabaseURL = import.meta.env.VITE_SUPABASE_URL
const supabaseKey = import.meta.env.VITE_SUPABASE_ANONKEY;
export const supabase = createClient(supabaseURL, supabaseKey);

const generateSessionId = () => {
    return '_' + Math.random().toString(36).slice(2, 10);
};
export const sessionId = sessionStorage.getItem('sessionId') || generateSessionId();

export const useSubscribePlayerChannel = (countUpdateCB: (count: number) => void) => {

    const updateOnlineUserCount = useCallback(async (eventType: "register" | "unregister") => {
        const { data, error } = await supabase
            .from("player_status")
            .select("total_online_players")
            .single<{ total_online_players: number }>();

        if (error) {
            return;
        }

        const { total_online_players } = data || { total_online_players: 0 };
        if (typeof total_online_players === "number") {
            const payload = {
                total_online_players: total_online_players
            }
            if (eventType === "register") {
                payload.total_online_players = total_online_players + 1
            } else if (total_online_players > 0) {
                payload.total_online_players = total_online_players - 1
            } else {
                return;
            }
            const { data, error } = await supabase
                .from("player_status")
                .update({
                    id: "1",
                    ...payload
                })
                .eq("id", "1")
                .select()
                .single()

            if (error) {
                return;
            }
            countUpdateCB(data?.total_online_players)
        }
    }, [countUpdateCB])

    const totalOnlinePlayers = useCallback(() => {
        return supabase
            .channel("player_status")
            .on("postgres_changes", { event: "*", schema: "public", table: "player_status" }, (payload: RealtimePostgresChangesPayload<{ total_online_players: number }>) => {
                if ('total_online_players' in payload.new) {
                    countUpdateCB(payload.new.total_online_players)
                }
            })
            .subscribe()
    }, [countUpdateCB])

    const onlineCountSub = useCallback(() => {
        const onlineSub = supabase.channel("total_online", {
            config: {
                presence: {
                    key: sessionId,
                },
            }
        })

        onlineSub.on("presence", { event: "sync" }, () => {
            const state = onlineSub.presenceState()
            console.log('after syncing', state)
        })

        onlineSub.on("presence", { event: "join" }, payload => {
            console.log("after joining register here", payload)
            updateOnlineUserCount("register")
        })

        onlineSub.on("presence", { event: "leave" }, payload => {
            console.log("after leaving unregister here", payload)
            updateOnlineUserCount("unregister")
        })

        return onlineSub.subscribe(status => {
            console.log(status)
            if (status === "CLOSED") {
                // updateOnlineUserCount("unregister")
            }
        })
    }, [updateOnlineUserCount])
    useEffect(() => {

        const playerCountSub = onlineCountSub()
        const totalPlayerChannel = totalOnlinePlayers()

        const handleBeforeUnload = () => {
            playerCountSub.unsubscribe()
        }
        window.addEventListener("beforeunload", handleBeforeUnload)
        window.addEventListener("offline", handleBeforeUnload)

        return () => {
            supabase.removeChannel(playerCountSub)
            supabase.removeChannel(totalPlayerChannel)
            window.removeEventListener("beforeunload", handleBeforeUnload)
            window.removeEventListener("offline", handleBeforeUnload)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])
}

export const useCheckboxesUpdate = (checkboxUpdate: (checkboxesSet: Set<number>) => void): [
    (updatedData: Set<number>) => Promise<unknown[] | undefined>,
    "loading" | "connected" | "connectionError"
] => {
    const [connectionStatus, setConnectionStatus] = useState<"loading" | "connected" | "connectionError">("loading")
    const realtimeCheckBoxChannel = useCallback(() => {
        setConnectionStatus("loading")
        const checkBoxChannel = supabase
            .channel("checkboxe_update")
            .on(
                "postgres_changes",
                { event: "*", schema: "public", table: "checkboxes" },
                (payload: RealtimePostgresChangesPayload<{ checked_boxes: number[] }>) => {
                    if ('checked_boxes' in payload.new) {
                        const checkSet = new Set(payload.new?.checked_boxes)
                        checkboxUpdate(checkSet)
                    }
                })
            .subscribe(status => {
                if (status === "SUBSCRIBED") {
                    setConnectionStatus("connected")
                } else if (status === "CHANNEL_ERROR") {
                    setConnectionStatus("connectionError")
                }
            })
        return checkBoxChannel;
    }, [checkboxUpdate])

    const getInitialCheckboxData = async () => {
        const { data, error } = await supabase
            .from("checkboxes")
            .select("checked_boxes")
            .single()
        checkboxUpdate(new Set(data?.checked_boxes))

        if (error) {
            return
            // do nothing
        }
        return data?.checked_boxes
    }

    const updateCheckbox = async (updatedData: Set<number>) => {
        const payload = Array.from(updatedData)

        const { data, error } = await supabase
            .from("checkboxes")
            .update({ id: 1, checked_boxes: payload })
            .eq("id", 1)
            .select()
        if (error) {
            return
        }
        return data

    }

    useEffect(() => {
        getInitialCheckboxData()
        const checkboxChannel = realtimeCheckBoxChannel()
        return () => {
            supabase.removeChannel(checkboxChannel)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    return [updateCheckbox, connectionStatus]
}