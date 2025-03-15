# 日本大学理工学部 チャットボット セットアップガイド

このガイドでは、日本大学理工学部のホームページに組み込まれたチャットボットの設定方法とNetlifyへのデプロイ方法について説明します。

## 概要

このチャットボットは以下の技術を使用しています：

- フロントエンド: HTML, CSS, JavaScript
- バックエンド: Netlify Functions (サーバーレス関数)
- AI: OpenAI API (GPT-3.5 Turbo)

## 前提条件

1. [Netlify](https://www.netlify.com/)アカウント
2. [OpenAI](https://openai.com/)アカウントとAPIキー
3. [Git](https://git-scm.com/)（ローカル開発とデプロイ用）

## セットアップ手順

### 1. OpenAI APIキーの取得

1. [OpenAIのウェブサイト](https://openai.com/)にアクセスし、アカウントを作成またはログインします。
2. ダッシュボードから「API Keys」セクションに移動します。
3. 「Create new secret key」をクリックして新しいAPIキーを生成します。
4. 生成されたAPIキーをコピーして安全な場所に保存します（このキーは一度しか表示されません）。

### 2. Netlifyへのデプロイ

#### GitHubリポジトリからデプロイする場合

1. GitHubにリポジトリをプッシュします。
2. [Netlify](https://app.netlify.com/)にログインします。
3. 「New site from Git」をクリックします。
4. GitHubを選択し、リポジトリを選択します。
5. ビルド設定は以下のように設定します：
   - Build command: 空欄（必要なし）
   - Publish directory: `.`（ルートディレクトリ）
6. 「Advanced build settings」をクリックし、環境変数を追加します：
   - OPENAI_API_KEY: OpenAIから取得したAPIキー
   - MODEL: gpt-3.5-turbo（または使用したいモデル）
   - MAX_TOKENS: 150（または希望する最大トークン数）
   - TEMPERATURE: 0.7（または希望する温度値）
7. 「Deploy site」をクリックしてデプロイを開始します。

#### 手動でデプロイする場合

1. Netlifyダッシュボードから「Sites」→「Add new site」→「Deploy manually」を選択します。
2. サイトのファイルをドラッグ＆ドロップするか、アップロードします。
3. サイトがデプロイされたら、「Site settings」→「Functions」→「Settings」に移動し、関数ディレクトリを「netlify/functions」に設定します。
4. 「Environment variables」に移動し、以下の環境変数を追加します：
   - OPENAI_API_KEY: OpenAIから取得したAPIキー
   - MODEL: gpt-3.5-turbo（または使用したいモデル）
   - MAX_TOKENS: 150（または希望する最大トークン数）
   - TEMPERATURE: 0.7（または希望する温度値）

### 3. 動作確認

1. デプロイが完了したら、Netlifyが提供するURLにアクセスします。
2. ページ右下のチャットボットアイコンをクリックします。
3. チャットボットに質問を入力して、正常に応答が返ってくることを確認します。

## トラブルシューティング

### 依存関係のエラーが発生する場合

Netlifyでデプロイ時に「A Netlify Function is using "node-fetch" but that dependency has not been installed yet」のようなエラーが表示される場合は、以下の方法で解決できます：

1. **プロジェクトのルートにpackage.jsonを作成する（推奨）**:
   ```json
   {
     "name": "cst-homepage",
     "version": "1.0.0",
     "dependencies": {
       "node-fetch": "^2.6.7"
     }
   }
   ```

2. **netlify.tomlにプラグインを追加する**:
   ```toml
   [[plugins]]
   package = "@netlify/plugin-functions-install-core"
   ```

3. **ビルドコマンドでインストールする**:
   ビルド設定で、以下のようなビルドコマンドを設定します：
   ```
   cd netlify/functions && npm install && cd ../..
   ```

### チャットボットが常に同じ回答しか返さない場合

チャットボットが「日本大学理工学部には、以下の学科があります：...」のような固定の回答しか返さない場合は、以下の点を確認してください：

1. **ブラウザのコンソールログ**: ブラウザの開発者ツール（F12キー）を開き、コンソールタブでエラーメッセージを確認します。
2. **Netlify関数のログ**: NetlifyダッシュボードでFunctionsタブを開き、chatbot関数のログを確認します。
3. **環境変数の確認**: NetlifyダッシュボードでOPENAI_API_KEYが正しく設定されているか確認します。
4. **APIキーの有効性**: OpenAIダッシュボードでAPIキーが有効であることを確認します。
5. **使用量制限**: OpenAIの使用量制限に達していないか確認します。

問題が解決しない場合は、以下の修正を試してください：

1. **キャッシュのクリア**: ブラウザのキャッシュをクリアして、ページを再読み込みします。
2. **Netlifyの再デプロイ**: Netlifyダッシュボードで「Trigger deploy」をクリックして、サイトを再デプロイします。

### CORSエラーが発生する場合

1. netlify.tomlファイルが正しく設定されていることを確認します。
2. Netlify Functionsが正しく設定されていることを確認します。

## カスタマイズ

### チャットボットの外観を変更する

assets/css/chatbot.cssファイルを編集して、チャットボットの外観をカスタマイズできます。

### 静的レスポンスを追加する

特定の質問に対する静的な回答を追加するには、assets/js/chatbot.jsファイルのgetStaticResponse関数を編集します。

### モデルやパラメータを変更する

OpenAI APIのモデルやパラメータを変更するには、Netlifyの環境変数を更新します。

### チャットボットをすべてのページで利用可能にする

デフォルトでは、チャットボットはトップページ（index.html）でのみ利用可能ですが、すべてのページで利用可能にするための修正が施されています。この修正により、main.jsファイルがチャットボットのCSSとJavaScriptを動的に読み込むようになっています。

特定のページでのみチャットボットを表示したい場合は、assets/js/main.jsファイルのloadChatbot関数を修正して、表示条件を追加できます：

```javascript
function loadChatbot() {
    // 特定のページでのみ表示する場合
    const currentPath = window.location.pathname;
    const allowedPaths = ['/', '/index.html', '/about/index.html'];
    
    if (!allowedPaths.some(path => currentPath.endsWith(path))) {
        return; // 許可されていないページでは表示しない
    }
    
    // 以下、チャットボットの読み込み処理
    // ...
}
```

## セキュリティに関する注意

- OpenAI APIキーは常に安全に保管し、公開リポジトリにコミットしないでください。
- フロントエンドコードにAPIキーを直接埋め込まないでください。
- 必要に応じて、APIの使用量制限を設定して予期しない請求を防止してください。

## サポート

問題が解決しない場合は、以下を試してください：

1. OpenAIの[ドキュメント](https://platform.openai.com/docs/introduction)を参照する
2. Netlifyの[サポートドキュメント](https://docs.netlify.com/)を参照する
3. 開発者に連絡する