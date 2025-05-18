import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { toast } from "../hooks/use-toast";
import { Download, Send } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
import { Input } from "./ui/input";
import { Label } from "./ui/label";

interface Property {
  id: string;
  facility_name: string;
  address: string;
  building_age: number;
  has_renovation: boolean;
  operation_area: string;
  price_area: string;
  property_type: string;
  cleaning_cost_basis: number;
  average_stays: number;
  competitor_ratio: number;
  operation_type: string;
}

interface MonthlyData {
  revenue: number;
  expenses: number;
  profit: number;
}

interface RevenueProjection {
  monthly: Record<string, MonthlyData>;
  property_id: string;
}

const RevenueReport: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [property, setProperty] = useState<Property | null>(null);
  const [projections, setProjections] = useState<RevenueProjection | null>(null);
  const [loading, setLoading] = useState(true);
  const [lineUserId, setLineUserId] = useState('');
  const [sendingLine, setSendingLine] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { getAuthHeaders, createApiUrl } = await import('../utils/auth');
        
        const propertyResponse = await fetch(createApiUrl(`/api/properties/${id}`), {
          headers: getAuthHeaders(),
        });

        if (!propertyResponse.ok) {
          throw new Error('Failed to fetch property data');
        }

        const propertyData = await propertyResponse.json();
        setProperty(propertyData);

        const projectionsResponse = await fetch(createApiUrl('/api/revenue/calculate'), {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            ...getAuthHeaders()
          },
          body: JSON.stringify(propertyData),
        });

        if (!projectionsResponse.ok) {
          throw new Error('Failed to fetch revenue projections');
        }

        const projectionsData = await projectionsResponse.json();
        setProjections(projectionsData);
      } catch (error) {
        console.error(error);
        toast({
          title: "Error",
          description: "Failed to load report data",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const handleDownloadPDF = async () => {
    if (!property) return;

    try {
      const { getAuthHeaders, createApiUrl } = await import('../utils/auth');
      
      const response = await fetch(createApiUrl('/api/revenue/pdf'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeaders()
        },
        body: JSON.stringify(property),
      });

      if (!response.ok) {
        throw new Error('Failed to generate PDF');
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = url;
      a.download = `${property.facility_name}_revenue_report.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      
      toast({
        title: "Success",
        description: "PDF downloaded successfully",
      });
    } catch (error) {
      console.error(error);
      toast({
        title: "Error",
        description: "Failed to download PDF",
        variant: "destructive",
      });
    }
  };

  const handleSendLine = async () => {
    if (!property || !lineUserId) return;

    setSendingLine(true);
    try {
      const { getAuthHeaders, createApiUrl } = await import('../utils/auth');
      
      const response = await fetch(createApiUrl('/api/line/notify'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeaders()
        },
        body: JSON.stringify({
          property_data: property,
          line_user_id: lineUserId,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to send LINE notification');
      }

      toast({
        title: "Success",
        description: "LINE notification sent successfully",
      });
    } catch (error) {
      console.error(error);
      toast({
        title: "Error",
        description: "Failed to send LINE notification",
        variant: "destructive",
      });
    } finally {
      setSendingLine(false);
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  if (!property || !projections) {
    return <div className="flex justify-center items-center h-screen">No data found</div>;
  }

  const yearlyRevenue = Object.values(projections.monthly).reduce((sum, data) => sum + data.revenue, 0);
  const yearlyExpenses = Object.values(projections.monthly).reduce((sum, data) => sum + data.expenses, 0);
  const yearlyProfit = Object.values(projections.monthly).reduce((sum, data) => sum + data.profit, 0);

  return (
    <div className="container mx-auto py-8 px-4">
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>収益予測レポート: {property.facility_name}</CardTitle>
          <CardDescription>{property.address}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <h3 className="text-lg font-semibold mb-2">物件情報</h3>
              <ul className="space-y-1">
                <li><span className="font-medium">築年数:</span> {property.building_age}年</li>
                <li><span className="font-medium">リノベーション:</span> {property.has_renovation ? 'あり' : 'なし'}</li>
                <li><span className="font-medium">稼働基準地域:</span> {property.operation_area}</li>
                <li><span className="font-medium">価格基準地域:</span> {property.price_area}</li>
                <li><span className="font-medium">物件種別:</span> {property.property_type}</li>
                <li><span className="font-medium">運営形態:</span> {property.operation_type}</li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-2">年間収益サマリー</h3>
              <ul className="space-y-1">
                <li><span className="font-medium">年間予想売上:</span> ¥{yearlyRevenue.toLocaleString()}</li>
                <li><span className="font-medium">年間予想経費:</span> ¥{yearlyExpenses.toLocaleString()}</li>
                <li><span className="font-medium">年間予想利益:</span> ¥{yearlyProfit.toLocaleString()}</li>
                <li><span className="font-medium">平均月間利益:</span> ¥{Math.round(yearlyProfit / 12).toLocaleString()}</li>
              </ul>
            </div>
          </div>

          <h3 className="text-lg font-semibold mb-4">月別収益予測</h3>
          <div className="h-80 mb-6">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={Object.entries(projections.monthly).map(([month, data]) => ({ month, ...data }))}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip formatter={(value) => `¥${Number(value).toLocaleString()}`} />
                <Legend />
                <Bar dataKey="revenue" name="予想売上" fill="#8884d8" />
                <Bar dataKey="expenses" name="予想経費" fill="#82ca9d" />
                <Bar dataKey="profit" name="予想利益" fill="#ffc658" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Button onClick={handleDownloadPDF} className="flex items-center gap-2">
              <Download size={16} />
              PDFをダウンロード
            </Button>
            
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline" className="flex items-center gap-2">
                  <Send size={16} />
                  LINEで送信
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>LINEで送信</DialogTitle>
                  <DialogDescription>
                    レポートをLINEで送信します。送信先のLINEユーザーIDを入力してください。
                  </DialogDescription>
                </DialogHeader>
                <div className="py-4">
                  <Label htmlFor="line-user-id">LINE ユーザーID</Label>
                  <Input
                    id="line-user-id"
                    value={lineUserId}
                    onChange={(e) => setLineUserId(e.target.value)}
                    placeholder="U1234567890abcdef..."
                  />
                </div>
                <DialogFooter>
                  <Button onClick={handleSendLine} disabled={sendingLine || !lineUserId}>
                    {sendingLine ? "送信中..." : "送信"}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>月別詳細</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border p-2 text-left">月</th>
                  <th className="border p-2 text-right">予想売上</th>
                  <th className="border p-2 text-right">予想経費</th>
                  <th className="border p-2 text-right">予想利益</th>
                </tr>
              </thead>
              <tbody>
                {Object.entries(projections.monthly).map(([month, data]) => (
                  <tr key={month}>
                    <td className="border p-2">{month}</td>
                    <td className="border p-2 text-right">¥{data.revenue.toLocaleString()}</td>
                    <td className="border p-2 text-right">¥{data.expenses.toLocaleString()}</td>
                    <td className="border p-2 text-right">¥{data.profit.toLocaleString()}</td>
                  </tr>
                ))}
                <tr className="bg-gray-100 font-semibold">
                  <td className="border p-2">年間合計</td>
                  <td className="border p-2 text-right">¥{yearlyRevenue.toLocaleString()}</td>
                  <td className="border p-2 text-right">¥{yearlyExpenses.toLocaleString()}</td>
                  <td className="border p-2 text-right">¥{yearlyProfit.toLocaleString()}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default RevenueReport;
