#!/usr/bin/env npx tsx
import { checkWebsite } from './deadLinkCheckerFixed';

async function testGrammarly() {
  console.log('🧪 测试 Grammarly 网站...');
  try {
    const result = await checkWebsite('https://www.grammarly.com');
    console.log('结果:', result);
  } catch (error) {
    console.error('错误:', error);
  }
}

testGrammarly();
