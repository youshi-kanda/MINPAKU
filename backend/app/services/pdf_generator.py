from reportlab.lib.pagesizes import A4
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib import colors
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
import os
import tempfile

def register_fonts():
    try:
        font_paths = [
            '/usr/share/fonts/truetype/fonts-japanese-gothic.ttf',
            '/usr/share/fonts/truetype/ipafont-gothic/ipag.ttf',
            '/usr/share/fonts/opentype/ipafont-gothic/ipag.ttf'
        ]
        
        for font_path in font_paths:
            if os.path.exists(font_path):
                pdfmetrics.registerFont(TTFont('IPAGothic', font_path))
                return True
                
        print("Japanese fonts not found. Using default fonts.")
        return False
    except Exception as e:
        print(f"Error registering fonts: {e}")
        return False

def generate_revenue_report(property_data, projections):
    """Generate a PDF revenue report for a property"""
    temp_file = tempfile.NamedTemporaryFile(suffix='.pdf', delete=False)
    doc = SimpleDocTemplate(temp_file.name, pagesize=A4)
    
    styles = getSampleStyleSheet()
    has_japanese_font = register_fonts()
    
    if has_japanese_font:
        styles.add(ParagraphStyle(name='JapaneseStyle', fontName='IPAGothic', fontSize=10))
        title_style = ParagraphStyle(name='JapaneseTitle', fontName='IPAGothic', fontSize=16, alignment=1)
    else:
        styles.add(ParagraphStyle(name='JapaneseStyle', fontName='Helvetica', fontSize=10))
        title_style = ParagraphStyle(name='JapaneseTitle', fontName='Helvetica', fontSize=16, alignment=1)
    
    content = []
    
    title = Paragraph(f"収益予測レポート: {property_data['facility_name']}", title_style)
    content.append(title)
    content.append(Spacer(1, 20))
    
    content.append(Paragraph("物件情報:", styles['JapaneseStyle']))
    content.append(Spacer(1, 10))
    
    property_details = [
        ["施設名", property_data['facility_name']],
        ["住所", property_data['address']],
        ["築年数", f"{property_data['building_age']}年"],
        ["リノベーション", "あり" if property_data['has_renovation'] else "なし"],
        ["物件種別", property_data['property_type']],
        ["運営形態", property_data['operation_type']]
    ]
    
    t = Table(property_details, colWidths=[100, 300])
    t.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (0, -1), colors.lightgrey),
        ('GRID', (0, 0), (-1, -1), 1, colors.black),
        ('FONTNAME', (0, 0), (-1, -1), 'IPAGothic' if has_japanese_font else 'Helvetica'),
    ]))
    content.append(t)
    content.append(Spacer(1, 20))
    
    content.append(Paragraph("月別収益予測:", styles['JapaneseStyle']))
    content.append(Spacer(1, 10))
    
    monthly_headers = ["月", "予想売上", "予想経費", "予想利益"]
    monthly_data = [monthly_headers]
    
    total_revenue = 0
    total_expenses = 0
    total_profit = 0
    
    for month, data in projections['monthly'].items():
        monthly_data.append([
            month,
            f"¥{data['revenue']:,}",
            f"¥{data['expenses']:,}",
            f"¥{data['profit']:,}"
        ])
        total_revenue += data['revenue']
        total_expenses += data['expenses']
        total_profit += data['profit']
    
    monthly_data.append([
        "年間合計",
        f"¥{total_revenue:,}",
        f"¥{total_expenses:,}",
        f"¥{total_profit:,}"
    ])
    
    t = Table(monthly_data, colWidths=[80, 100, 100, 100])
    t.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), colors.lightgrey),
        ('BACKGROUND', (0, -1), (-1, -1), colors.lightgrey),
        ('GRID', (0, 0), (-1, -1), 1, colors.black),
        ('FONTNAME', (0, 0), (-1, -1), 'IPAGothic' if has_japanese_font else 'Helvetica'),
    ]))
    content.append(t)
    
    doc.build(content)
    return temp_file.name
