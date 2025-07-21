// Temporary test file - you can delete this after testing
// Run this with: node test-social-links.js

const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

async function testSocialLinks() {
  try {
    // Test if we can select the column
    const { data, error } = await supabase
      .from('profiles')
      .select('social_links')
      .limit(1);
    
    if (error) {
      console.error('❌ Error:', error.message);
    } else {
      console.log('✅ social_links column exists and is accessible');
      console.log('📊 Sample data:', data);
    }
  } catch (err) {
    console.error('❌ Connection error:', err.message);
  }
}

testSocialLinks();