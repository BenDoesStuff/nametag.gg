// Test script to debug color_theme column issues
// Run this with: node test-color-theme.js

const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

async function testColorTheme() {
  console.log('🔍 Testing color_theme column...\n');

  try {
    // Test 1: Check if we can select the column
    console.log('1. Testing SELECT on color_theme column...');
    const { data: selectData, error: selectError } = await supabase
      .from('profiles')
      .select('id, color_theme')
      .limit(1);
    
    if (selectError) {
      console.error('❌ SELECT Error:', selectError.message);
      console.error('Full error:', selectError);
    } else {
      console.log('✅ color_theme column exists and is readable');
      console.log('📊 Sample data:', selectData);
    }

    // Test 2: Get current user
    console.log('\n2. Getting current user...');
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    
    if (userError) {
      console.error('❌ User Error:', userError.message);
      return;
    }
    
    if (!user) {
      console.log('⚠️  No authenticated user found');
      return;
    }
    
    console.log('✅ User found:', user.id);

    // Test 3: Try to update color_theme
    console.log('\n3. Testing UPDATE on color_theme column...');
    const testTheme = {
      primary: '#FF6B35',
      primaryRgb: '255, 107, 53',
      themeName: 'test-theme',
      displayName: 'Test Theme',
      description: 'Test theme for debugging'
    };

    const { data: updateData, error: updateError } = await supabase
      .from('profiles')
      .update({ color_theme: testTheme })
      .eq('id', user.id);

    if (updateError) {
      console.error('❌ UPDATE Error:', updateError.message);
      console.error('Full error:', updateError);
      console.error('Error code:', updateError.code);
      console.error('Error details:', updateError.details);
      console.error('Error hint:', updateError.hint);
    } else {
      console.log('✅ color_theme update successful');
      console.log('📊 Update result:', updateData);
    }

    // Test 4: Verify the update worked
    console.log('\n4. Verifying the update...');
    const { data: verifyData, error: verifyError } = await supabase
      .from('profiles')
      .select('color_theme')
      .eq('id', user.id)
      .single();

    if (verifyError) {
      console.error('❌ Verify Error:', verifyError.message);
    } else {
      console.log('✅ Verification successful');
      console.log('📊 Current color_theme:', verifyData.color_theme);
    }

  } catch (err) {
    console.error('❌ Unexpected error:', err);
  }
}

// Test database structure
async function testDatabaseStructure() {
  console.log('\n🏗️  Testing database structure...\n');

  try {
    // Check if we can query the information schema
    const { data, error } = await supabase
      .rpc('exec_sql', { 
        sql: `
          SELECT column_name, data_type, is_nullable, column_default 
          FROM information_schema.columns 
          WHERE table_name = 'profiles' 
          AND table_schema = 'public'
          ORDER BY ordinal_position;
        `
      });

    if (error) {
      console.log('⚠️  Cannot check database structure via RPC');
      console.log('This is normal - most Supabase projects disable RPC for security');
    } else {
      console.log('✅ Database structure:', data);
    }
  } catch (err) {
    console.log('⚠️  Cannot check database structure:', err.message);
  }
}

async function main() {
  await testColorTheme();
  await testDatabaseStructure();
  
  console.log('\n📋 Next Steps:');
  console.log('1. If SELECT works but UPDATE fails, check RLS policies');
  console.log('2. If column not found, run the migration SQL in Supabase SQL Editor');
  console.log('3. Check the exact error message details above');
}

main();