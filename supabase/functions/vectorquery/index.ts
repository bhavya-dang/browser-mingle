/* query Vector DB for similar topics and return corresponding room IDs from supabase */

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { Pinecone } from 'https://esm.sh/@pinecone-database/pinecone'
import { env, pipeline } from 'https://cdn.jsdelivr.net/npm/@xenova/transformers@2.5.0'

// Configuration for Deno runtime
env.useBrowserCache = false;
env.allowLocalModels = false;

// embedding pipeline
const pipe = await pipeline(
  'feature-extraction',
  'Supabase/gte-small',
);

async function getEmbedding(input) {
  const output = await pipe(input, {
    pooling: 'mean',
    normalize: true,
  });
  
  return Array.from(output.data);
};

Deno.serve(async (req) => {
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

  // query pinecone with embedding for topic
  const embedding = await getEmbedding(params.topic);

  const queryResponse = await index.query({
    vector: embedding,
    topK: 1,
    includeValues: true,
  });

  const topic_names = queryResponse.matches.map(obj => obj.id);

  const res = topic_names;
  return new Response(
    JSON.stringify({topics: res}),
    { headers: { "Content-Type": "application/json" } },
  )
})

