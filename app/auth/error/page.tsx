'use client';

import { AlertCircle } from 'lucide-react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

export default function AuthError() {
  const searchParams = useSearchParams();
  const [errorMessage, setErrorMessage] = useState<string>('发生了未知错误');
  const [errorType, setErrorType] = useState<string>('');

  useEffect(() => {
    // 从URL参数中获取错误信息
    const error = searchParams?.get('error');

    if (error) {
      setErrorType(error);

      // 根据错误类型设置友好的错误消息
      switch (error) {
        case 'Configuration':
          setErrorMessage('服务器配置错误，请联系管理员');
          break;
        case 'AccessDenied':
          setErrorMessage('访问被拒绝，您没有权限访问此资源');
          break;
        case 'Verification':
          setErrorMessage('验证链接无效或已过期');
          break;
        case 'OAuthSignin':
        case 'OAuthCallback':
        case 'OAuthCreateAccount':
        case 'EmailCreateAccount':
        case 'Callback':
        case 'OAuthAccountNotLinked':
        case 'EmailSignin':
        case 'CredentialsSignin':
          setErrorMessage('登录失败，请检查您的用户名和密码');
          break;
        case 'SessionRequired':
          setErrorMessage('请先登录后再访问此页面');
          break;
        default:
          setErrorMessage('发生了未知错误，请稍后再试');
      }
    }
  }, [searchParams]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-center text-2xl">认证错误</CardTitle>
          <CardDescription className="text-center">登录过程中发生了错误</CardDescription>
        </CardHeader>
        <CardContent>
          <Alert variant="destructive" className="mb-4">
            <AlertCircle className="size-4" />
            <AlertTitle>错误类型: {errorType || '未知错误'}</AlertTitle>
            <AlertDescription>{errorMessage}</AlertDescription>
          </Alert>

          <div className="mt-4 text-sm text-muted-foreground">
            <p>如果您继续遇到问题，请尝试以下解决方案：</p>
            <ul className="mt-2 list-disc space-y-1 pl-5">
              <li>检查您的用户名和密码</li>
              <li>清除浏览器缓存和Cookie</li>
              <li>使用不同的浏览器尝试</li>
              <li>联系系统管理员获取帮助</li>
            </ul>
          </div>
        </CardContent>
        <CardFooter className="flex justify-center">
          <Button asChild>
            <Link href="/login">返回登录页面</Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
