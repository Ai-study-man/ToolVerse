import React from 'react';
import ToolLogo from '@/components/ToolLogo';
import { featuredTools } from '@/data/mockData';

export default function TestLogoPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Logo 测试页面</h1>
      
      <div className="space-y-8">
        {/* 测试现有工具的 logo */}
        <section>
          <h2 className="text-2xl font-semibold mb-4">现有工具 Logo 测试</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {featuredTools.slice(0, 8).map((tool) => (
              <div key={tool.id} className="text-center">
                <ToolLogo 
                  name={tool.name} 
                  logo={tool.logo} 
                  size="lg" 
                  className="mx-auto mb-2"
                />
                <p className="text-sm font-medium">{tool.name}</p>
              </div>
            ))}
          </div>
        </section>

        {/* 测试 logoService 映射的工具 */}
        <section>
          <h2 className="text-2xl font-semibold mb-4">Logo Service 映射测试</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              'ChatGPT',
              'Claude',
              'DALL-E 3',
              'Midjourney',
              'Figma',
              'Canva',
              'Notion',
              'Linear'
            ].map((toolName) => (
              <div key={toolName} className="text-center">
                <ToolLogo 
                  name={toolName} 
                  logo={undefined} 
                  size="lg" 
                  className="mx-auto mb-2"
                />
                <p className="text-sm font-medium">{toolName}</p>
              </div>
            ))}
          </div>
        </section>

        {/* 测试不同尺寸 */}
        <section>
          <h2 className="text-2xl font-semibold mb-4">不同尺寸测试</h2>
          <div className="flex items-center space-x-8">
            <div className="text-center">
              <ToolLogo name="ChatGPT" logo={undefined} size="sm" className="mx-auto mb-2" />
              <p className="text-xs">Small</p>
            </div>
            <div className="text-center">
              <ToolLogo name="ChatGPT" logo={undefined} size="md" className="mx-auto mb-2" />
              <p className="text-sm">Medium</p>
            </div>
            <div className="text-center">
              <ToolLogo name="ChatGPT" logo={undefined} size="lg" className="mx-auto mb-2" />
              <p className="text-base">Large</p>
            </div>
            <div className="text-center">
              <ToolLogo name="ChatGPT" logo={undefined} size="xl" className="mx-auto mb-2" />
              <p className="text-lg">Extra Large</p>
            </div>
          </div>
        </section>

        {/* 测试错误处理 */}
        <section>
          <h2 className="text-2xl font-semibold mb-4">错误处理测试</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <ToolLogo 
                name="Invalid Tool" 
                logo="https://invalid-url.com/logo.png" 
                size="lg" 
                className="mx-auto mb-2"
              />
              <p className="text-sm">无效 URL</p>
            </div>
            <div className="text-center">
              <ToolLogo 
                name="No Logo Tool" 
                logo={undefined} 
                size="lg" 
                className="mx-auto mb-2"
              />
              <p className="text-sm">无 Logo</p>
            </div>
            <div className="text-center">
              <ToolLogo 
                name="Unknown Tool XYZ" 
                logo={undefined} 
                size="lg" 
                className="mx-auto mb-2"
              />
              <p className="text-sm">未知工具</p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
