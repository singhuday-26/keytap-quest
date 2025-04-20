
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.38.4';

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { language, difficulty } = await req.json();

    // Generate code snippet using OpenAI
    const prompt = `Generate a ${difficulty} difficulty coding example in ${language}. 
                   The code should be practical, well-commented, and demonstrate good practices. 
                   Keep it under 15 lines. Include a brief title that describes what the code does.`;

    const openAIResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: 'You are a coding expert that generates clear, concise code examples.' },
          { role: 'user', content: prompt }
        ],
      }),
    });

    const data = await openAIResponse.json();
    const generatedCode = data.choices[0].message.content;
    
    // Extract title and code from the generated content
    const [title, ...codeLines] = generatedCode.split('\n');
    const code = codeLines.join('\n');

    // Store in database
    const supabaseClient = createClient(
      'https://wdfoznswlscixgfersin.supabase.co',
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndkZm96bnN3bHNjaXhnZmVyc2luIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQ5NTUwNjQsImV4cCI6MjA2MDUzMTA2NH0.3zXTcgCiS-Si_t72w2YMu6RBtS4xsvP2Fix0tof79NQ'
    );

    const { data: snippet, error } = await supabaseClient
      .from('code_snippets')
      .insert([
        {
          title: title.replace('#', '').trim(),
          code,
          language,
          difficulty,
          source: 'openai'
        }
      ])
      .select()
      .single();

    if (error) throw error;

    return new Response(JSON.stringify(snippet), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error generating snippet:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
