/* query Vector DB for similar topics and return corresponding room topics and IDs from supabase */

import { corsHeaders } from "../_shared/cors.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { Pinecone } from 'https://esm.sh/@pinecone-database/pinecone'

Deno.serve(async (req) => {
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

  // get embedding
  const topic_ascii = params.topic.replace(/[\u{0080}-\u{FFFF}]/gu,""); // strip non-ascii characters

  const { data: d, error: e } = await supabase.functions.invoke("embed", {
    body: { input: topic_ascii },
  });
  const embedding = d.output;

  // query pinecone with embedding for topic
  const queryResponse = await index.query({
    vector: embedding,
    topK: 3,
    includeValues: true,
  });

  // get topic names from vector IDs
  const topic_names = queryResponse.matches.map(obj => obj.id);

  const res = topic_names;
  return new Response(
    JSON.stringify({topics: res}),
    { headers: { ...corsHeaders, "Content-Type": "application/json" } },
  )
})

