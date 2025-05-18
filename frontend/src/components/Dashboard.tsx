import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from "./ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "./ui/card";
import { toast } from "../hooks/use-toast";
import { Plus, LogOut, FileText } from 'lucide-react';

interface Property {
  id: string;
  facility_name: string;
  address: string;
  property_type: string;
  created_at: string;
}

const Dashboard: React.FC = () => {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const headers: Record<string, string> = {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        };
        
        if (import.meta.env.VITE_API_USERNAME && import.meta.env.VITE_API_PASSWORD) {
          const credentials = btoa(`${import.meta.env.VITE_API_USERNAME}:${import.meta.env.VITE_API_PASSWORD}`);
          headers['Authorization'] = `Basic ${credentials}`;
        }

        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/properties/`, {
          headers,
        });

        if (!response.ok) {
          throw new Error('Failed to fetch properties');
        }

        const data = await response.json();
        setProperties(data);
      } catch (error) {
        console.error(error);
        toast({
          title: "Error",
          description: "Failed to load properties",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchProperties();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">スマート民泊セールス・スイート</h1>
        <Button variant="outline" onClick={handleLogout} className="flex items-center gap-2">
          <LogOut size={16} />
          ログアウト
        </Button>
      </div>

      <div className="mb-8">
        <Link to="/property/new">
          <Button className="flex items-center gap-2">
            <Plus size={16} />
            新規物件を追加
          </Button>
        </Link>
      </div>

      {loading ? (
        <div>Loading...</div>
      ) : properties.length === 0 ? (
        <Card>
          <CardContent className="pt-6">
            <p className="text-center text-gray-500">
              物件がまだ登録されていません。「新規物件を追加」ボタンから物件を登録してください。
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {properties.map((property) => (
            <Card key={property.id}>
              <CardHeader>
                <CardTitle>{property.facility_name}</CardTitle>
                <CardDescription>{property.address}</CardDescription>
              </CardHeader>
              <CardContent>
                <p><span className="font-medium">物件種別:</span> {property.property_type}</p>
                <p><span className="font-medium">登録日:</span> {new Date(property.created_at).toLocaleDateString('ja-JP')}</p>
              </CardContent>
              <CardFooter>
                <Link to={`/report/${property.id}`} className="w-full">
                  <Button variant="outline" className="w-full flex items-center gap-2">
                    <FileText size={16} />
                    レポートを表示
                  </Button>
                </Link>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default Dashboard;
