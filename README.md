# 茶録 — Charoku

茶道のお稽古を深める、あなたの稽古帳アプリ。

## 機能

- **ホーム画面**: 今日の季節に合った禅語が掛軸の画像とともに迎えてくれます
- **YouTube動画ブックマーク**: お点前の動画をカテゴリ別に管理・メモ付き保存
- **禅語・茶杓の銘コレクション**: 月別60以上の禅語・銘を収録。自分で追加も可能
- **AI深掘り解説**: Claude APIが禅語の歴史的背景・茶道との関わりを解説
- **お稽古使用記録**: 各禅語・銘をいつ使ったか記録
- **お気に入り管理**: 好きな禅語・動画をまとめて管理
- **PWA対応**: スマホのホーム画面に追加してアプリのように使用可能

## 技術スタック

- Next.js 15 (App Router)
- React 19
- TypeScript
- Vercel (デプロイ先)
- Anthropic Claude API (AI解説)

## セットアップ

### 1. リポジトリをクローン

```bash
git clone https://github.com/YOUR_USERNAME/charoku.git
cd charoku
```

### 2. 依存関係をインストール

```bash
npm install
```

### 3. 環境変数を設定

```bash
cp .env.example .env.local
```

`.env.local` を編集して Anthropic API キーを設定:

```
ANTHROPIC_API_KEY=sk-ant-xxxxxxxxxxxxx
```

APIキーは https://console.anthropic.com/ で取得できます。

### 4. 開発サーバーを起動

```bash
npm run dev
```

http://localhost:3000 でアプリが開きます。

## Vercel へのデプロイ

### 手順

1. **GitHubにリポジトリを作成**
   - https://github.com/new でリポジトリを作成（Privateでも可）
   - コードをpush

```bash
git init
git add .
git commit -m "initial commit"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/charoku.git
git push -u origin main
```

2. **Vercelにログイン**
   - https://vercel.com にアクセス
   - GitHubアカウントでログイン

3. **プロジェクトをインポート**
   - 「Add New Project」をクリック
   - GitHubリポジトリ `charoku` を選択
   - 「Deploy」をクリック

4. **環境変数を設定**
   - Vercelダッシュボード > Settings > Environment Variables
   - `ANTHROPIC_API_KEY` を追加（値はAPIキー）
   - 「Redeploy」で反映

5. **完了！**
   - `https://charoku-xxxxx.vercel.app` のURLでアクセス可能に

### スマホでアプリとして使う

1. スマホのブラウザで公開URLにアクセス
2. **iPhone**: Safari > 共有ボタン > 「ホーム画面に追加」
3. **Android**: Chrome > メニュー > 「ホーム画面に追加」

## PWA アイコンの準備

`public/` フォルダに以下のアイコンファイルを配置してください:

- `icon-192.png` (192x192px)
- `icon-512.png` (512x512px)

茶道をイメージしたアイコン（茶碗、抹茶色の丸など）がおすすめです。

## プロジェクト構成

```
charoku/
├── app/
│   ├── api/
│   │   └── ai-explain/
│   │       └── route.ts      # AI解説APIルート（APIキーはサーバーサイド）
│   ├── layout.tsx             # ルートレイアウト（PWAメタタグ）
│   └── page.tsx               # メインページ
├── components/
│   └── Charoku.tsx            # メインアプリコンポーネント
├── lib/
│   ├── data.ts                # 禅語・銘データ
│   └── types.ts               # TypeScript型定義
├── public/
│   └── manifest.json          # PWAマニフェスト
├── .env.example               # 環境変数サンプル
├── next.config.ts
├── package.json
└── tsconfig.json
```

## セキュリティ

- Anthropic APIキーは **サーバーサイドのAPIルート** (`/api/ai-explain`) 経由で使用
- クライアントにAPIキーが露出しません
- `.env.local` は `.gitignore` に含まれGitHubにpushされません

## データ保存

現在はブラウザの localStorage にデータを保存しています。

- 動画ブックマーク
- 禅語・銘のお気に入り
- 自分で追加した禅語・銘
- お稽古使用記録

※ 端末やブラウザごとにデータは別になります。将来的にSupabase等で同期する拡張も可能です。

## ライセンス

Private use
