#!/usr/bin/env npx tsx

import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import * as path from 'path';
import { checkWebsite } from './deadLinkCheckerFixed';

dotenv.config({ path: path.join(process.cwd(), '.env.local') });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

async function testRealWebsites() {
  console.log('🧪 测试真实网站的检测...');

  // 获取一些真实网站和测试网站
  const { data: realSites } = await supabase
    .from('tools')
    .select('id, name, website')
    .or('website.ilike.%openai%,website.ilike.%github%,website.ilike.%anthropic%')
    .limit(3);

  const { data: testSites } = await supabase
    .from('tools')
    .select('id, name, website')
    .ilike('name', '%Ad Creator%')
    .limit(2);

  const allSites = [...(realSites || []), ...(testSites || [])];

  console.log(`\n🔍 测试 ${allSites.length} 个网站:\n`);

  for (const tool of allSites) {
    console.log(`🔍 检查: ${tool.name}`);
    console.log(`   网站: ${tool.website}`);
    
    const result = await checkWebsite(tool.website);
    
    if (result.success) {
      console.log(`✅ 正常 - 状态码: ${result.statusCode}, 响应时间: ${result.responseTime}ms\n`);
    } else {
      console.log(`❌ 异常 - 错误: ${result.error}, 响应时间: ${result.responseTime}ms\n`);
    }
  }

  console.log('🎉 测试完成！');
}

testRealWebsites();
