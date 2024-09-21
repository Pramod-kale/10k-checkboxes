import { createClient } from "@supabase/supabase-js"

const supabaseURL = "";
const supabaseKey = "";
export const supabase = createClient(supabaseURL, supabaseKey);


const fetchInitialState = async () => {

}