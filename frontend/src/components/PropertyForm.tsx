import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "./ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "./ui/card";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Checkbox } from "./ui/checkbox";
import { toast } from "../hooks/use-toast";

interface PropertyFormData {
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

const PropertyForm: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [formData, setFormData] = useState<PropertyFormData>({
    facility_name: '',
    address: '',
    building_age: 0,
    has_renovation: false,
    operation_area: '',
    price_area: '',
    property_type: '',
    cleaning_cost_basis: 0,
    average_stays: 0,
    competitor_ratio: 0,
    operation_type: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? parseFloat(value) : value,
    }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleCheckboxChange = (name: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      [name]: checked,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/properties/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Failed to save property data');
      }

      const data = await response.json();
      toast({
        title: "Success",
        description: "Property data saved successfully",
      });

      navigate(`/report/${data.id}`);
    } catch (error) {
      console.error(error);
      toast({
        title: "Error",
        description: "Failed to save property data",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <Card className="w-full max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle>物件情報入力</CardTitle>
          <CardDescription>民泊物件の情報を入力してください</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="facility_name">施設名</Label>
                <Input
                  id="facility_name"
                  name="facility_name"
                  value={formData.facility_name}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="address">住所</Label>
                <Input
                  id="address"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="building_age">築年数</Label>
                <Input
                  id="building_age"
                  name="building_age"
                  type="number"
                  min="0"
                  value={formData.building_age}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="has_renovation" className="block mb-2">リノベ有無</Label>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="has_renovation"
                    checked={formData.has_renovation}
                    onCheckedChange={(checked) => 
                      handleCheckboxChange('has_renovation', checked as boolean)
                    }
                  />
                  <label
                    htmlFor="has_renovation"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    リノベーション済み
                  </label>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="operation_area">稼働基準地域</Label>
                <Select
                  onValueChange={(value) => handleSelectChange('operation_area', value)}
                  value={formData.operation_area}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="地域を選択" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="東京">東京</SelectItem>
                    <SelectItem value="大阪">大阪</SelectItem>
                    <SelectItem value="京都">京都</SelectItem>
                    <SelectItem value="福岡">福岡</SelectItem>
                    <SelectItem value="札幌">札幌</SelectItem>
                    <SelectItem value="沖縄">沖縄</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="price_area">価格基準地域</Label>
                <Select
                  onValueChange={(value) => handleSelectChange('price_area', value)}
                  value={formData.price_area}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="地域を選択" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="東京">東京</SelectItem>
                    <SelectItem value="大阪">大阪</SelectItem>
                    <SelectItem value="京都">京都</SelectItem>
                    <SelectItem value="福岡">福岡</SelectItem>
                    <SelectItem value="札幌">札幌</SelectItem>
                    <SelectItem value="沖縄">沖縄</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="property_type">物件種別</Label>
                <Select
                  onValueChange={(value) => handleSelectChange('property_type', value)}
                  value={formData.property_type}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="種別を選択" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="マンション">マンション</SelectItem>
                    <SelectItem value="一軒家">一軒家</SelectItem>
                    <SelectItem value="アパート">アパート</SelectItem>
                    <SelectItem value="高級マンション">高級マンション</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="cleaning_cost_basis">清掃費計算用</Label>
                <Input
                  id="cleaning_cost_basis"
                  name="cleaning_cost_basis"
                  type="number"
                  min="0"
                  value={formData.cleaning_cost_basis}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="average_stays">平均宿泊数</Label>
                <Input
                  id="average_stays"
                  name="average_stays"
                  type="number"
                  min="1"
                  step="0.1"
                  value={formData.average_stays}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="competitor_ratio">競合比設定</Label>
                <Input
                  id="competitor_ratio"
                  name="competitor_ratio"
                  type="number"
                  min="0"
                  max="2"
                  step="0.1"
                  value={formData.competitor_ratio}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="operation_type">運営形態</Label>
                <Select
                  onValueChange={(value) => handleSelectChange('operation_type', value)}
                  value={formData.operation_type}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="運営形態を選択" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="借上">借上</SelectItem>
                    <SelectItem value="代行">代行</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "送信中..." : "収益予測を作成"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default PropertyForm;
