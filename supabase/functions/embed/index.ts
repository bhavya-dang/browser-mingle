/* get vector embedding for a string */
import { env, pipeline } from 'https://cdn.jsdelivr.net/npm/@xenova/transformers@2.5.0'

// Configuration for Deno runtime
env.useBrowserCache = false;
env.allowLocalModels = false;

// embedding pipeline
const pipe = await pipeline(
  'feature-extraction',
  'Supabase/gte-small',
);

Deno.serve(async (req) => {
  // get request body
  const { input } = await req.json()!

  const output = await pipe(input, {
    pooling: 'mean',
    normalize: true,
  });
  
  const data = Array.from(output.data);

  return new Response(
    JSON.stringify({ output: data }),
    { headers: { "Content-Type": "application/json" } },
  )
})

