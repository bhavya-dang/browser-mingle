import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { corsHeaders } from "../_shared/cors.ts"

Deno.serve(async (req: Request) => {
  // This is needed if you're planning to invoke your function from a browser.
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  // create supabase client
  const authHeader = req.headers.get('Authorization')!
  const supabase = createClient(
    Deno.env.get('SUPABASE_URL') ?? '',
    Deno.env.get('SUPABASE_ANON_KEY') ?? '',
    { global: { headers: { Authorization: authHeader } } }
  )

  // get request body
  const params = await req.json()!

  const room = params.room;
  console.log("listening to room:", room);

  // subscribe to supabase live updates from messages table
  let messages = [];
  supabase
    .channel("messages")
    .on(
      "postgres_changes",
      { event: "INSERT", schema: "public", table: "messages", filter: "room_id=eq."+room, },
      (payload) => {
        const updatedData = new TextEncoder().encode(`${JSON.stringify(payload.new)}\r\n\r\n`);
        messages.push(updatedData);
      }
    )
    .subscribe();

  // SSE logic
  let timerId: number | undefined;

  const body = new ReadableStream({
    start(controller) {
      timerId = setInterval(() => {
        while (messages.length) {
          controller.enqueue(messages.pop());
        }
      }, 1000)
    },
    cancel() {
      if (typeof timerId === 'number') {
        clearInterval(timerId)
      }
    },
  })

  return new Response(body,
    { headers: { ...corsHeaders, "Content-Type": "text/event-stream" } },
  )
})

