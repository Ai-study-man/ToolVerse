import fs from 'fs';
import path from 'path';
import https from 'https';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

// 下载AI Collection仓库
async function downloadAICollection() {
  const tempDir = path.join(process.cwd(), 'temp');
  const repoDir = path.join(tempDir, 'ai-collection');
  
  console.log('📥 开始下载AI Collection仓库...');
  
  // 创建临时目录
  if (!fs.existsSync(tempDir)) {
    fs.mkdirSync(tempDir, { recursive: true });
  }
  
  // 如果目录已存在，先删除
  if (fs.existsSync(repoDir)) {
    console.log('🗑️  删除现有目录...');
    fs.rmSync(repoDir, { recursive: true, force: true });
  }
  
  try {
    // 克隆仓库
    console.log('⬇️  克隆仓库...');
    await execAsync(`git clone https://github.com/ai-collection/ai-collection.git "${repoDir}"`);
    console.log('✅ 仓库下载完成');
    
    return repoDir;
  } catch (error) {
    console.error('❌ 下载仓库失败:', error);
    throw error;
  }
}

// 清理临时文件
function cleanup(tempDir: string) {
  try {
    if (fs.existsSync(tempDir)) {
      fs.rmSync(tempDir, { recursive: true, force: true });
      console.log('🧹 清理临时文件完成');
    }
  } catch (error) {
    console.warn('⚠️  清理临时文件失败:', error);
  }
}

// 主函数
async function main() {
  let repoDir: string | undefined;
  
  try {
    // 下载仓库
    repoDir = await downloadAICollection();
    
    // 动态导入处理脚本
    const { importAICollection } = await import('./importAICollection');
    
    // 临时修改process.argv来传递路径
    const originalArgv = process.argv;
    process.argv = [...process.argv.slice(0, 2), repoDir];
    
    try {
      // 执行导入
      await importAICollection();
    } finally {
      // 恢复原始argv
      process.argv = originalArgv;
    }
    
  } catch (error) {
    console.error('❌ 导入过程失败:', error);
    process.exit(1);
  } finally {
    // 清理临时文件
    if (repoDir) {
      cleanup(path.dirname(repoDir));
    }
  }
}

// 运行主函数
if (require.main === module) {
  main().catch(console.error);
}
