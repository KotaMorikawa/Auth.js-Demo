# Next.js Advanced Authentication Demo

このプロジェクトは、Next.js 14とAuth.jsを使用した高度な認証機能を実装したデモアプリケーションです。メール認証、2要素認証、ソーシャルログインなど、本番環境で必要となる認証機能を網羅的に実装しています。

## 技術スタック

- [Next.js](https://nextjs.org) (15.1.0) - Reactフレームワーク (with Turbopack)
- [NextAuth.js](https://authjs.dev) (5.0.0-beta.25) - 認証ライブラリ
- [Prisma](https://www.prisma.io) (6.0.1) - TypeScript用ORMツール
- [React](https://reactjs.org) (19.0.0) - UIライブラリ
- [Zod](https://zod.dev) (3.24.1) - スキーマバリデーション
- [React Hook Form](https://react-hook-form.com) (7.54.1) - フォーム管理
- [React Email](https://react.email) (@react-email/components: 0.0.31) - メールテンプレート
- [Resend](https://resend.com) (4.0.1) - メール配信サービス

### UI Components

- [Radix UI](https://www.radix-ui.com) - ヘッドレスUIコンポーネント
  - Dialog (1.1.3)
  - Label (2.1.1)
  - Switch (1.1.2)
  - その他のRadixコンポーネント
- [Lucide React](https://lucide.dev) (0.468.0) - アイコンライブラリ
- [Tailwind CSS](https://tailwindcss.com) (3.4.1) - スタイリング

## 主な機能

- 📧 メールアドレスによる認証
- 🔐 2要素認証（2FA）
- 🌐 ソーシャルログイン（Google, GitHub）
- ✉️ メール確認機能
- 🔑 パスワードリセット
- 👤 プロフィール編集
- 🛡️ ルートプロテクション
- 📱 レスポンシブデザイン

## プロジェクト構成

```
.
├── actions/                 # Server Actions
│   └── email/              # メール関連のアクション
├── prisma/                 # データベース定義
├── src/
│   ├── app/               # ページルーティング
│   │   ├── (auth)/       # 認証関連ページ
│   │   └── api/          # APIルート
│   ├── components/        # UIコンポーネント
│   │   ├── email/        # メールテンプレート
│   │   └── ui/           # shadcn/uiコンポーネント
│   ├── hooks/            # カスタムフック
│   └── lib/              # ユーティリティ関数
├── schemas/               # Zodバリデーションスキーマ
├── types/                # 型定義
└── db/                   # DBモデル定義
```

## セットアップ

1. 依存関係のインストール:

```bash
npm install

# または特定のバージョンを指定してインストール
npm install next@15.1.0 react@19.0.0 react-dom@19.0.0 next-auth@5.0.0-beta.25 @prisma/client@6.0.1
```

注意: このプロジェクトはTurbopackを使用しています。開発サーバー起動時に`--turbopack`フラグが必要です。

2. 環境変数の設定:

`.env`ファイルを作成し、以下の環境変数を設定:

```env
# Database (Supabase)
# Supavisor経由のコネクションプーリング用URL
DATABASE_URL=""

# マイグレーション用の直接接続URL
DIRECT_URL=""

# Auth.js用のシークレットキー（以下のコマンドで生成可能）
# openssl rand -base64 32
AUTH_SECRET=""

# OAuth Providers
GOOGLE_CLIENT_ID=""
GOOGLE_CLIENT_SECRET=""

GITHUB_CLIENT_ID=""
GITHUB_CLIENT_SECRET=""

# Email Provider (Resend)
RESEND_API_KEY=""
```

#### 環境変数の説明

- **データベース設定**

  - `DATABASE_URL`: Supavisorを使用したコネクションプーリング用のURL
  - `DIRECT_URL`: データベースマイグレーション時に使用する直接接続用のURL

- **認証設定**

  - `AUTH_SECRET`: Auth.js用の暗号化キー。本番環境では必ず強力な値を設定してください
  - OAuth設定は各プロバイダーの開発者コンソールから取得してください：
    - [Google Cloud Console](https://console.cloud.google.com/)
    - [GitHub Developer Settings](https://github.com/settings/developers)

- **メール設定**
  - `RESEND_API_KEY`: [Resend](https://resend.com)のAPIキー

4. データベースのセットアップ:

```bash
# Prismaクライアントの生成
npx prisma generate

# データベースのマイグレーション
npx prisma migrate deploy

# (開発時) データベーススキーマの変更を反映
npx prisma db push

# (開発時) Prisma Studioの起動
npx prisma studio
```

注意: マイグレーション時は`DIRECT_URL`を使用するため、必ず設定してください。

5. 開発サーバーの起動:

```bash
npm run dev
```

## 実装の特徴

### Server Actions

認証関連の操作はすべてServer Actionsを使用して実装されています：

```typescript
// actions/email/sign-in.ts
"use server";

export const signIn = async (data: SignInSchema) => {
  const validatedFields = SignInSchema.safeParse(data);

  if (!validatedFields.success) {
    return { error: "Invalid fields!" };
  }

  // 認証ロジック
};
```

### スキーマバリデーション

Zodを使用した型安全なバリデーション：

```typescript
// schemas/index.ts
export const SignInSchema = z.object({
  email: z.string().email({
    message: "メールアドレスが必要です",
  }),
  password: z.string().min(1, {
    message: "パスワードが必要です",
  }),
});
```

### メール認証

React Emailを使用したカスタマイズ可能なメールテンプレート：

```typescript
// components/email/verification-email.tsx
export const VerificationEmail = ({
  verificationUrl
}: VerificationEmailProps) => {
  return (
    // メールテンプレート
  );
};
```

## セキュリティ設定

このプロジェクトでは、以下のセキュリティ対策を実装しています：

### セキュリティヘッダー

`next.config.ts`で以下のセキュリティヘッダーを設定しています：

```typescript
const cspHeader = `
    default-src 'self';
    script-src 'self' 'unsafe-eval' 'unsafe-inline';
    style-src 'self' 'unsafe-inline';
    object-src 'none';
    frame-ancestors 'none';
    block-all-mixed-content;
    upgrade-insecure-requests;
`;
```

#### 実装されているセキュリティ機能

1. **コンテンツセキュリティポリシー (CSP)**

   - 同一オリジンリソースのみを許可
   - スクリプトとスタイルの制御
   - 混在コンテンツのブロック
   - HTTPSへの自動アップグレード

2. **HTTP Strict Transport Security (HSTS)**

   - HTTPS通信の強制（max-age: 2年）
   - サブドメインへの適用
   - ブラウザのプリロードリストへの登録対応

3. **X-Frame-Options**

   - クリックジャッキング攻撃の防止
   - 同一オリジンのフレームのみ許可

4. **Referrer Policy**
   - クロスオリジンでのリファラー情報の制御
   - プライバシー保護の強化

### その他のセキュリティ機能

- **パスワードハッシュ化**

  - bcryptを使用した安全なパスワード保存
  - ソルト自動生成

- **レート制限**

  - ログイン試行回数の制限
  - パスワードリセットリクエストの制限

- **CSRF保護**

  - Auth.jsによる自動的なCSRFトークン管理

- **XSS対策**
  - React/Next.jsの自動エスケープ機能
  - CSPによる追加的な保護

### 開発環境での注意点

1. セキュリティヘッダーは開発環境で問題を引き起こす可能性があります。必要に応じて環境変数で制御してください：

```typescript
// next.config.ts
const headers = process.env.NODE_ENV === "production" ? securityHeaders : [];
```

2. `unsafe-eval`と`unsafe-inline`の使用は、Next.jsの動作に必要ですが、セキュリティリスクを若干高めます。

### セキュリティのベストプラクティス

- 定期的なパッケージの更新
- 環境変数の適切な管理
- 本番環境でのデバッグモードの無効化
- セッショントークンの適切な管理
- ログイン試行の監視とブロック
