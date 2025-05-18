from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class Property(BaseModel):
    id: Optional[str] = None
    facility_name: str  # 施設名
    address: str  # 住所
    building_age: int  # 築年数
    has_renovation: bool  # リノベ有無
    operation_area: str  # 稼働基準地域
    price_area: str  # 価格基準地域
    property_type: str  # 物件種別
    cleaning_cost_basis: float  # 清掃費計算用
    average_stays: float  # 平均宿泊数
    competitor_ratio: float  # 競合比設定
    operation_type: str  # 借上 or 代行
    created_at: datetime = datetime.now()
    updated_at: datetime = datetime.now()
