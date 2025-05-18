from linebot import LineBotApi
from linebot.models import TextSendMessage
from linebot.exceptions import LineBotApiError
import os
from dotenv import load_dotenv

load_dotenv()

line_bot_api = LineBotApi(os.getenv('LINE_CHANNEL_ACCESS_TOKEN', ''))

def send_notification(user_id, property_data, projections):
    """Send a notification to a user with property data and revenue projections"""
    try:
        yearly_profit = sum(month_data['profit'] for month_data in projections['monthly'].values())
        
        message = f"""
        新しい収益予測レポートが作成されました！
        
        物件: {property_data['facility_name']}
        住所: {property_data['address']}
        年間予想利益: ¥{yearly_profit:,}
        
        詳細はウェブサイトでご確認ください。
        """
        
        line_bot_api.push_message(user_id, TextSendMessage(text=message))
        return {"status": "success"}
    except LineBotApiError as e:
        return {"status": "error", "message": str(e)}
