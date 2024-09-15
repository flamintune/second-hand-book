// src/components/DeclarationOfUse.tsx
import React from 'react';
import { Link } from 'react-router-dom';

const DeclarationOfUse: React.FC = () => {
  return (
    <div className="flex flex-col min-h-screen p-4 bg-white">
      <div className="max-w-2xl mx-auto w-full">
        <h1 className="text-2xl font-bold mb-4">交大喷泉二手书使用声明</h1>
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-2">1. 服务说明</h2>
          <p>交大喷泉二手书是一个专为大学生提供二手教材交易的平台。我们致力于为用户提供安全、便捷的二手书交易体验。</p>
        </div>
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-2">2. 用户责任</h2>
          <p>用户应当遵守相关法律法规，不得利用本平台从事任何违法或不当行为。用户对自己在平台上的行为负责。</p>
        </div>
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-2">3. 隐私保护</h2>
          <p>我们重视用户隐私，承诺按照隐私政策保护用户个人信息。未经用户同意，我们不会向第三方披露用户个人信息。</p>
        </div>
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-2">4. 免责声明</h2>
          <p>平台仅为用户提供信息发布与交流的场所，不对用户间交易的具体内容负责。因交易产生的纠纷由交易双方自行解决。</p>
        </div>
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-2">5. 协议修改</h2>
          <p>我们保留随时修改本使用声明的权利。修改后的声明将在平台上公布，继续使用本平台即表示同意修改后的声明。</p>
        </div>
        <Link to="/login" className="text-blue-500 hover:underline">返回登录页面</Link>
      </div>
    </div>
  );
};

export default DeclarationOfUse;