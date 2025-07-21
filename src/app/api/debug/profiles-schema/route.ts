import { NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabaseServer';

export async function GET() {
  try {
    const supabase = createServerClient();
    
    // Get table schema info
    const { data, error } = await supabase.rpc('get_table_columns', { 
      table_name: 'profiles' 
    }).single();
    
    if (error) {
      // Fallback: try to get a sample profile to see available columns
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .limit(1)
        .single();
        
      return NextResponse.json({
        error: error.message,
        sample_columns: profile ? Object.keys(profile) : null,
        profile_error: profileError?.message
      });
    }
    
    return NextResponse.json({ columns: data });
    
  } catch (error) {
    return NextResponse.json({ 
      error: error instanceof Error ? error.message : 'Unknown error' 
    });
  }
}