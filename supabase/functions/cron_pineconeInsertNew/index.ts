import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { Pinecone } from 'https://esm.sh/@pinecone-database/pinecone'

// create Pinecone client
const pinecone = new Pinecone({
  apiKey: Deno.env.get("PINECONE_API_KEY"),
  environment: Deno.env.get("PINECONE_ENVIRONMENT")
})
const index = pinecone.index("topics");

Deno.serve(async (req) => {
  const { name } = await req.json()
  console.log(name);

  // create supabase client
  const authHeader = req.headers.get('Authorization')!
  const supabase = createClient(
    Deno.env.get('SUPABASE_URL') ?? '',
    Deno.env.get('SUPABASE_ANON_KEY') ?? '',
    { global: { headers: { Authorization: authHeader } } }
  )
  
  // get topic names that have vector_added set to false
  const { data, error } = await supabase
    .from('rooms')
    .select('topic')
    .eq('vector_added', 'FALSE')

  console.log(data);

  // insert all into Pinecone
  //const topic_ascii = params.topic.replace(/[\u{0080}-\u{FFFF}]/gu,""); // strip non-ascii characters
  //console.log(topic_ascii);
  //const { data: d, error: e } = await supabase.functions.invoke("embed", {
  //  body: { input: topic_ascii },
  //});
  //const embedding = d.output;
  //await index.upsert(
  //  [ { id: topic_ascii, values: embedding } ]
  //)

  // empty response
  const data = {
    message: `Hello ${name}!`,
  }

  return new Response(
    JSON.stringify(data),
    { headers: { "Content-Type": "application/json" } },
  )
})
