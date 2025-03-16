# CST Homepage

大学理工学部ホームページの試作です。内容は正確ではありません。

## 機能

- 学部・学科情報
- 入学案内
- キャンパスライフ
- 研究・大学院情報
- チャットボット（OpenAI APIを使用）

## チャットボットの設定

チャットボットはOpenAI APIを使用しています。APIキーを設定するには以下の手順に従ってください。

### GitHub Secretsを使用する場合（推奨）

GitHub Actionsでデプロイする場合は、GitHub Secretsを使用できます：

1. リポジトリの「Settings」→「Secrets and variables」→「Actions」を開く
2. 「New repository secret」ボタンを押す
3. 名前を `API_KEY` として、値にOpenAI APIキーを入力
4. 「Add secret」ボタンを押す

これにより、GitHub Actionsのデプロイ時に自動的にAPIキーが設定されます。

## デプロイ方法

このプロジェクトは以下の3つの方法でデプロイできます：

### 1. Netlify（最も推奨）

Netlifyを使用すると、サーバーレス関数を利用してCORSの問題を回避できます。

1. Netlifyアカウントを作成し、新しいサイトを作成します
2. 以下の環境変数をNetlifyダッシュボードで設定します：
   - `API_KEY`: OpenAI APIキー（または`OPENAI_API_KEY`でも可）

3. GitHub Actionsを使用してデプロイするには、以下のシークレットをGitHubリポジトリで設定します：
   - `API_KEY`: OpenAI APIキー（GitHub ActionsとNetlifyの両方で使用されます）
   - `NETLIFY_AUTH_TOKEN`: Netlify個人アクセストークン
   - `NETLIFY_SITE_ID`: NetlifyサイトのサイトID

注意: `API_KEY`と`OPENAI_API_KEY`は同じOpenAI APIキーを指しますが、異なる場所で使用されます。コードは両方の名前をチェックするので、どちらかの名前で設定すれば動作します。

#### Netlify個人アクセストークンの取得方法

1. Netlifyにログインします
2. 右上のユーザーアイコンをクリックし、「User settings」を選択します
3. 「Applications」を選択します
4. 「New access token」ボタンをクリックします
5. トークンの説明を入力し、「Generate token」をクリックします
6. 生成されたトークンをコピーします（このトークンは一度しか表示されないので注意してください）

#### NetlifyサイトのサイトIDの取得方法

1. Netlifyにログインします
2. サイトを選択します
3. 「Site settings」を選択します
4. 「Site information」セクションに「Site ID」が表示されています

### 2. GitHub Pages（推奨）

GitHub Pagesを使用する場合は、APIキーの制限とCORSの問題に対応するため、事前に用意された回答を表示するように変更しました。GitHub Pages環境では、チャットボットは質問の内容に応じて以下の事前に用意された回答を表示します：

- 「理工学部の学科について教えてください」→ 学科一覧の回答
- 「キャンパスの場所を教えてください」→ キャンパス情報の回答
- その他の質問 → 一般的な案内メッセージ

### 3. Netlify（最も推奨）

Netlifyでデプロイする場合は、サーバーレス関数を使用してCORS問題を解決します。最新の修正では、以下の改善を行いました：

1. **絶対URLの使用**:
   - 相対パス（`/.netlify/functions/openai-proxy`）ではなく、絶対URL（`https://your-site.netlify.app/.netlify/functions/openai-proxy`）を使用
   - これにより、パスの解決問題を回避

2. **学科に関する質問の自動検出**:
   - 「学科」を含む質問に対しては、APIを呼び出さずに静的な回答を表示
   - これにより、APIエラーが発生しても基本的な情報を提供

3. **CORS設定の強化**:
   - `netlify.toml`ファイルにCORSヘッダーを追加
   - これにより、ブラウザのCORS制限を回避

#### Netlify設定のトラブルシューティング

1. Netlify環境変数に `API_KEY` または `OPENAI_API_KEY` が正しく設定されているか確認してください。

2. `netlify.toml`ファイルが以下のように設定されていることを確認してください：
   ```toml
   [build]
     functions = "netlify/functions"
     publish = "."

   # This redirect is for the /api path
   [[redirects]]
     from = "/api/*"
     to = "/.netlify/functions/:splat"
     status = 200

   # Add CORS headers for the functions
   [[headers]]
     for = "/.netlify/functions/*"
       [headers.values]
       Access-Control-Allow-Origin = "*"
       Access-Control-Allow-Headers = "Content-Type, Authorization"
       Access-Control-Allow-Methods = "GET, POST, OPTIONS"
   ```

3. 問題が解決しない場合は、ブラウザのコンソールでエラーメッセージを確認し、ページを再読み込みしてください。

### 3. GitHub Pages（基本）

GitHub Pagesのみを使用する場合は、CORSの問題を回避するために以下の方法を使用します：

#### ローカル開発の場合

ローカルで開発する場合は、`assets/js/config.js`ファイルを直接編集してAPIキーを設定できます：

```javascript
// ChatGPT API Configuration
const CONFIG = {
    OPENAI_API_KEY: 'YOUR_ACTUAL_API_KEY_HERE', // Replace with your actual API key
    MODEL: 'gpt-3.5-turbo',
    MAX_TOKENS: 150,
    TEMPERATURE: 0.7
};

export default CONFIG;
```

**注意**:
- APIキーをGitHubにコミットしないでください。ローカルでのテスト後は必ず元の状態に戻してください。
- 現在のコードではテスト用のダミーAPIキーが設定されていますが、これは実際には機能しません。実際のAPIキーに置き換えてください。
- ブラウザでCORSエラーが発生する場合は、OpenAI APIへの直接アクセスが制限されている可能性があります。その場合は、バックエンドサーバーを介してAPIにアクセスするか、CORSプロキシを使用してください。

### CORSエラーの解決方法

ブラウザから直接OpenAI APIにアクセスする場合、CORSエラーが発生する可能性があります。これを解決するには以下の方法があります：

1. **CORSプロキシを使用する**
   
   `assets/js/chatbot.js`ファイルを編集して、APIリクエストをCORSプロキシを通して行うようにします：

   ```javascript
   // 例: CORSプロキシを使用する場合
   const response = await fetch('https://cors-anywhere.herokuapp.com/https://api.openai.com/v1/chat/completions', {
       // ...
   });
   ```

2. **バックエンドサーバーを作成する**
   
   Node.jsなどを使用してバックエンドサーバーを作成し、そこからOpenAI APIにリクエストを送信します。これにより、CORSの問題を回避できます。

## ローカルサーバーの起動

```bash
# Pythonの組み込みHTTPサーバーを使用
python -m http.server

# または
python3 -m http.server
```

ブラウザで http://localhost:8000 にアクセスしてください。