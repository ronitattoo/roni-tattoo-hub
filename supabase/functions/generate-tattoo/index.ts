import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Authenticate user
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: 'Authentication required' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Validate JWT and get user
    const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? '';
    const supabaseKey = Deno.env.get('SUPABASE_ANON_KEY') ?? '';
    const supabaseClient = createClient(supabaseUrl, supabaseKey, {
      global: { headers: { Authorization: authHeader } }
    });

    const { data: { user }, error: authError } = await supabaseClient.auth.getUser();
    if (authError || !user) {
      console.error('[AUTH] Invalid authentication');
      return new Response(
        JSON.stringify({ error: 'Invalid authentication' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('[AUTH] User authenticated:', user.id);

    const { prompt } = await req.json();
    
    // Validate prompt exists and type
    if (!prompt || typeof prompt !== 'string' || prompt.trim().length === 0) {
      return new Response(
        JSON.stringify({ error: 'Valid prompt is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Validate prompt length
    if (prompt.length > 500) {
      return new Response(
        JSON.stringify({ error: 'Prompt too long (max 500 characters)' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Sanitize prompt - block prompt injection patterns
    const dangerousPatterns = [
      /ignore\s+previous\s+instructions/i,
      /system\s+prompt/i,
      /you\s+are\s+now/i,
      /forget\s+everything/i,
      /act\s+as/i,
    ];

    for (const pattern of dangerousPatterns) {
      if (pattern.test(prompt)) {
        console.log('[SECURITY] Blocked dangerous prompt pattern for user:', user.id);
        return new Response(
          JSON.stringify({ error: 'Invalid prompt content detected' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
    }

    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY is not configured');
    }

    console.log('[REQUEST] Generating tattoo for user:', user.id);

    // Enhanced prompt for realistic black & grey tattoo style
    const enhancedPrompt = `Realistic black and grey tattoo design: ${prompt}. High contrast, clean lines, professional tattoo art style, no background, highly detailed shading, photorealistic tattoo artwork`;

    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash-image-preview',
        messages: [
          {
            role: 'user',
            content: enhancedPrompt
          }
        ],
        modalities: ['image', 'text']
      })
    });

    if (response.status === 429) {
      console.log('[RATE_LIMIT] Rate limit hit for user:', user.id);
      return new Response(
        JSON.stringify({ error: 'Rate limit exceeded. Please try again later.' }),
        { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (response.status === 402) {
      console.log('[CREDITS] Credits exhausted for user:', user.id);
      return new Response(
        JSON.stringify({ error: 'Credits exhausted. Please add more credits to continue.' }),
        { status: 402, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (!response.ok) {
      // Log internally but don't expose details to client
      console.error('[API_ERROR] AI Gateway failed:', {
        status: response.status,
        userId: user.id,
        timestamp: new Date().toISOString()
      });
      return new Response(
        JSON.stringify({ error: 'Service temporarily unavailable. Please try again.' }),
        { status: 503, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const data = await response.json();
    console.log('[SUCCESS] Image generated for user:', user.id);

    // Extract the image from the response
    const imageUrl = data.choices?.[0]?.message?.images?.[0]?.image_url?.url;
    
    if (!imageUrl) {
      console.error('[API_ERROR] No image in response for user:', user.id);
      return new Response(
        JSON.stringify({ error: 'Failed to generate image. Please try again.' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    return new Response(
      JSON.stringify({ 
        imageUrl,
        success: true 
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    // Log full error internally for debugging
    console.error('[INTERNAL_ERROR] Generate tattoo failed:', {
      error: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
      timestamp: new Date().toISOString()
    });

    // Return generic error to client
    return new Response(
      JSON.stringify({ error: 'Failed to generate tattoo design. Please try again.' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
