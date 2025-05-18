# スマート民泊セールス・スイート (Smart Minpaku Sales Suite)

短期賃貸（民泊）ビジネスコンサルタント向けの営業支援ツール

## 機能

- 物件データ入力フォーム（内部使用向け）
- 収益予測PDFレポート生成
- 地域・季節ごとの価格ベンチマーク
- 過去のデータ蓄積による予測精度向上
- LINE通知機能

## 技術スタック

- フロントエンド: React, TypeScript, Tailwind CSS
- バックエンド: FastAPI
- データベース: インメモリ（開発用）、Firestore（本番用オプション）
- PDF生成: ReportLab
- LINE通知: LINE Messaging API
- コンテナ化: Docker, Docker Compose

## 開発環境のセットアップ

### 前提条件

- Docker と Docker Compose がインストールされていること
- Node.js と npm がインストールされていること
- Python 3.12 と Poetry がインストールされていること

### インストール手順

1. リポジトリをクローン

```bash
git clone https://github.com/yourusername/minpaku-sales-suite.git
cd minpaku-sales-suite
```

2. 環境変数の設定

```bash
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env
```

`.env` ファイルを編集して必要な環境変数を設定してください。

3. Docker Compose で起動

```bash
docker-compose up
```

これにより、以下のサービスが起動します：
- フロントエンド: http://localhost:3000
- バックエンド: http://localhost:8000

## 開発方法

### バックエンド開発

```bash
cd backend
poetry install
poetry run uvicorn app.main:app --reload
```

API ドキュメントは http://localhost:8000/docs で確認できます。

### フロントエンド開発

```bash
cd frontend
npm install
npm run dev
```

## 本番環境へのデプロイ

### バックエンド

```bash
cd backend
docker build -t minpaku-backend .
docker run -p 8000:8000 minpaku-backend
```

### フロントエンド

```bash
cd frontend
npm run build
```

`dist` ディレクトリの内容を Cloudflare Pages などの静的ホスティングサービスにデプロイしてください。

## LINE Messaging API の設定

1. [LINE Developers Console](https://developers.line.biz/console/) でアカウントを作成
2. 新しいチャネルを作成し、Messaging API を有効化
3. チャネルアクセストークンを取得し、バックエンドの `.env` ファイルに設定

## ライセンス

MIT
