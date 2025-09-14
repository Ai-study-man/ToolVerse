/**
 * Database Category Cleaning Script
 * Cleans and normalizes tool categories in the database
 */

import { normalizeCategory, mapToUnifiedCategory } from '../src/utils/categoryIcons';

// Simulated database query results (replace with actual Supabase queries)
async function getToolsWithCategories(): Promise<Array<{id: number, name: string, description: string, category: string | null}>> {
  // This would be your actual Supabase query
  // const { data, error } = await supabase.from('tools').select('id, name, description, category');
  
  // For demonstration, return mock data structure
  return [
    { id: 1, name: 'ChatGPT Writer', description: 'AI writing assistant for emails and content', category: 'AI Writing' },
    { id: 2, name: 'DALL-E', description: 'Generate images from text descriptions', category: 'Image Generation' },
    { id: 3, name: 'Claude Assistant', description: 'AI chatbot for conversations and help', category: 'Chatbot' },
    { id: 4, name: 'GitHub Copilot', description: 'AI pair programmer for coding', category: 'Development Tools' },
    { id: 5, name: 'Runway ML', description: 'Video editing with AI tools', category: 'Video Editor' },
    { id: 6, name: 'Notion AI', description: 'Smart workspace for productivity and note-taking', category: null },
    { id: 7, name: 'Grammarly', description: 'Writing assistant for grammar and style checking', category: 'Writing Tools' },
    { id: 8, name: 'Canva Magic', description: 'Design tool with AI-powered templates and graphics', category: 'Design' },
    // Add more examples...
  ];
}

// Function to analyze current categories
async function analyzeCategoryDistribution() {
  console.log('🔍 Analyzing current category distribution...\n');
  
  const tools = await getToolsWithCategories();
  const categoryStats: Record<string, { count: number; normalized: string; examples: string[] }> = {};
  
  tools.forEach(tool => {
    const original = tool.category || 'unknown';
    const unified = mapToUnifiedCategory(tool);
    
    if (!categoryStats[original]) {
      categoryStats[original] = {
        count: 0,
        normalized: unified,
        examples: []
      };
    }
    
    categoryStats[original].count++;
    if (categoryStats[original].examples.length < 3) {
      categoryStats[original].examples.push(`${tool.name} (ID: ${tool.id})`);
    }
  });
  
  // Group by normalized categories
  const normalizedStats: Record<string, string[]> = {};
  Object.entries(categoryStats).forEach(([original, stats]) => {
    if (!normalizedStats[stats.normalized]) {
      normalizedStats[stats.normalized] = [];
    }
    normalizedStats[stats.normalized].push(`${original} (${stats.count} tools)`);
  });
  
  console.log('📊 Category Analysis Results:');
  console.log('==============================\n');
  
  Object.entries(normalizedStats).forEach(([normalized, originals]) => {
    console.log(`🎯 ${normalized}:`);
    originals.forEach(original => console.log(`   - ${original}`));
    console.log('');
  });
  
  return categoryStats;
}

// Function to generate preview of changes
async function previewCategoryChanges() {
  console.log('👀 Previewing category normalization changes...\n');
  
  const tools = await getToolsWithCategories();
  const changes: Array<{id: number, name: string, original: string, unified: string, changed: boolean}> = [];
  
  tools.forEach(tool => {
    const original = tool.category || 'unknown';
    const unified = mapToUnifiedCategory(tool);
    const changed = original.toLowerCase() !== unified.toLowerCase();
    
    changes.push({
      id: tool.id,
      name: tool.name,
      original,
      unified,
      changed
    });
  });
  
  const changedItems = changes.filter(c => c.changed);
  
  console.log(`📈 Summary: ${changedItems.length} out of ${changes.length} tools will have category changes\n`);
  
  if (changedItems.length > 0) {
    console.log('🔄 Changes to be made:');
    console.log('======================');
    changedItems.slice(0, 20).forEach(change => {
      console.log(`${change.name} (ID ${change.id}): "${change.original}" → "${change.unified}"`);
    });
    
    if (changedItems.length > 20) {
      console.log(`... and ${changedItems.length - 20} more changes`);
    }
  }
  
  // Show category distribution after changes
  const categoryDistribution: Record<string, number> = {};
  changes.forEach(change => {
    categoryDistribution[change.unified] = (categoryDistribution[change.unified] || 0) + 1;
  });
  
  console.log('\n📊 Final category distribution:');
  console.log('==============================');
  Object.entries(categoryDistribution)
    .sort(([,a], [,b]) => b - a)
    .forEach(([category, count]) => {
      console.log(`${category}: ${count} tools`);
    });
  
  return changes;
}

// Function to apply category normalization (DRY RUN by default)
async function applyCategoryNormalization(dryRun = true) {
  console.log(`${dryRun ? '🧪 DRY RUN:' : '✅ APPLYING:'} Category normalization...\n`);
  
  const tools = await getToolsWithCategories();
  const updates: Array<{id: number, name: string, newCategory: string}> = [];
  let successCount = 0;
  let errorCount = 0;
  
  for (const tool of tools) {
    const original = tool.category || 'unknown';
    const unified = mapToUnifiedCategory(tool);
    
    if (original.toLowerCase() !== unified.toLowerCase()) {
      updates.push({ id: tool.id, name: tool.name, newCategory: unified });
      
      if (!dryRun) {
        try {
          // Replace this with actual Supabase update
          // const { error } = await supabase
          //   .from('tools')
          //   .update({ category: unified })
          //   .eq('id', tool.id);
          
          // if (error) throw error;
          
          console.log(`✅ Updated ${tool.name} (ID ${tool.id}): "${original}" → "${unified}"`);
          successCount++;
        } catch (error) {
          console.error(`❌ Failed to update ${tool.name} (ID ${tool.id}):`, error);
          errorCount++;
        }
      } else {
        console.log(`[DRY RUN] Would update ${tool.name} (ID ${tool.id}): "${original}" → "${unified}"`);
        successCount++;
      }
    }
  }
  
  console.log(`\n📊 Results:`);
  console.log(`   - Total updates needed: ${updates.length}`);
  console.log(`   - ${dryRun ? 'Would succeed' : 'Successful'}: ${successCount}`);
  if (!dryRun && errorCount > 0) {
    console.log(`   - Failed: ${errorCount}`);
  }
  
  return updates;
}

// Main execution function
async function main() {
  console.log('🚀 Database Category Cleaning Tool');
  console.log('===================================\n');
  
  try {
    // Step 1: Analyze current distribution
    await analyzeCategoryDistribution();
    
    console.log('\n' + '='.repeat(50) + '\n');
    
    // Step 2: Preview changes
    await previewCategoryChanges();
    
    console.log('\n' + '='.repeat(50) + '\n');
    
    // Step 3: Dry run
    await applyCategoryNormalization(true);
    
    console.log('\n🔧 To apply changes to the database:');
    console.log('   1. Set up your Supabase connection');
    console.log('   2. Uncomment the actual database queries');
    console.log('   3. Run: applyCategoryNormalization(false)');
    console.log('\n⚠️  Remember to backup your database before applying changes!');
    
  } catch (error) {
    console.error('❌ Error during category cleaning:', error);
  }
}

// Export functions for use in other scripts
export {
  analyzeCategoryDistribution,
  previewCategoryChanges,
  applyCategoryNormalization,
  main
};

// Run if called directly
if (require.main === module) {
  main();
}