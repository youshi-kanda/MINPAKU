import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "./ui/card";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Button } from "./ui/button";
import { toast } from "../hooks/use-toast";

const Login: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { saveToken, createApiUrl } = await import('../utils/auth');
      
      const formData = new URLSearchParams();
      formData.append('username', username);
      formData.append('password', password);
      
      const apiEndpoint = createApiUrl('/api/token');
      
      const requestHeaders: Record<string, string> = {
        'Content-Type': 'application/x-www-form-urlencoded',
      };
      
      console.log('Sending login request to:', apiEndpoint);
      
      const response = await fetch(apiEndpoint, {
        method: 'POST',
        headers: requestHeaders,
        body: formData,
        credentials: 'same-origin'  // Changed from 'include' to 'same-origin' for same-origin requests
      });
      
      console.log('Login response status:', response.status);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Login error response:', errorText);
        throw new Error(`Login failed: ${response.status} ${errorText}`);
      }
      
      const data = await response.json();
      
      if (!data.access_token) {
        throw new Error('No access token in response');
      }
      
      saveToken(data.access_token);
      
      toast({
        title: "Success",
        description: "Login successful",
      });
      
      navigate('/dashboard');
    } catch (error) {
      console.error(error);
      toast({
        title: "Error",
        description: "Invalid username or password",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold">ログイン</CardTitle>
          <CardDescription>
            スマート民泊セールス・スイートにログインしてください
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="username">ユーザー名</Label>
                <Input
                  id="username"
                  placeholder="ユーザー名を入力"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">パスワード</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="パスワードを入力"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </div>
            <Button className="w-full mt-6" type="submit" disabled={loading}>
              {loading ? "ログイン中..." : "ログイン"}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex justify-center">
          <p className="text-sm text-gray-500">
            デモ用: ユーザー名 "admin", パスワード "secret"
          </p>
        </CardFooter>
      </Card>
    </div>
  );
};

export default Login;
