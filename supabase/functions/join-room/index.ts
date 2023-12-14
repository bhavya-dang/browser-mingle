import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { corsHeaders } from "../_shared/cors.ts"
import { Pinecone } from 'https://esm.sh/@pinecone-database/pinecone'

async function getEmbedding(input) {
  const { data, error } = await supabase.functions.invoke("embed", {
    body: { input: input },
  });

  return data.output;
};

Deno.serve(async (req: Request) => {
  // This is needed if you're planning to invoke your function from a browser.
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  // create Pinecone client
  const pinecone = new Pinecone({
    apiKey: Deno.env.get("PINECONE_API_KEY"),
    environment: Deno.env.get("PINECONE_ENVIRONMENT")
  })
  const index = pinecone.index("topics");
  
  // create supabase client
  const authHeader = req.headers.get('Authorization')!
  const supabase = createClient(
    Deno.env.get('SUPABASE_URL') ?? '',
    Deno.env.get('SUPABASE_ANON_KEY') ?? '',
    { global: { headers: { Authorization: authHeader } } }
  )

  // get request body
  const params = await req.json()!

  // check if room for the topic exists
  const { data: query, error: e } = await supabase
    .from('rooms')
    .select("*")
    .eq('topic', params.topic);

  if (query.length >= 1) {
    // TODO log if more than one room present

    return new Response(
      JSON.stringify({ "room_id": query[0].room_id }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } },
    )
  }

  // create topic if it doesn't exist
  const { data, error } = await supabase
    .from('rooms')
    .insert([
      { topic: params.topic },
    ])
    .select('room_id')
    .eq('topic', params.topic);

  console.log("😗", data[0]);

  // insert into Pinecone
  const embedding = await getEmbedding(params.topic);
  await index.upsert(
    [ { id: params.topic, values: embedding } ]
  )

  let res = data[0];
  return new Response(
    JSON.stringify(res),
    { headers: { ...corsHeaders, "Content-Type": "application/json" } },
  )
})

