#!/usr/bin/env npx tsx

import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import * as path from 'path';

dotenv.config({ path: path.join(process.cwd(), '.env.local') });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

async function main() {
  console.log('🔍 查看数据库中的工具网站...');
  
  const { data, error } = await supabase
    .from('tools')
    .select('id, name, website')
    .order('name')
    .limit(20);

  if (error) {
    console.error('❌ 查询失败:', error);
    return;
  }

  console.log(`\n📋 前20个工具:`);
  data?.forEach((tool, i) => {
    console.log(`${i+1}. ${tool.name}: ${tool.website}`);
  });

  // 查找包含真实域名的工具
  console.log('\n🔍 查找真实网站...');
  const { data: realSites } = await supabase
    .from('tools')
    .select('id, name, website')
    .or('website.ilike.%openai%,website.ilike.%github%,website.ilike.%google%,website.ilike.%microsoft%,website.ilike.%anthropic%')
    .limit(10);

  if (realSites && realSites.length > 0) {
    console.log(`\n✅ 找到 ${realSites.length} 个真实网站:`);
    realSites.forEach((tool, i) => {
      console.log(`${i+1}. ${tool.name}: ${tool.website}`);
    });
  } else {
    console.log('\n❌ 没有找到真实网站，数据库可能包含测试数据');
  }
}

main();
