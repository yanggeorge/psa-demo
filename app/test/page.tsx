export default function TestPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 p-4">
      <h1 className="text-2xl font-bold">Auth.js 测试页面</h1>

      <div className="mt-4 text-sm text-gray-500">
        <p>环境变量:</p>
        <p>AUTH_URL: {process.env.AUTH_URL || '未设置'}</p>
        <p>AUTH_SECRET: {process.env.AUTH_SECRET ? '已设置' : '未设置'}</p>
      </div>
    </div>
  );
}
