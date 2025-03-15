# CST Homepage

日本大学理工学部のホームページです。

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

### ローカル開発の場合

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
- ブラウザでCORSエラーが発生する場合は、OpenAI APIへの直接アクセスが制限されている可能性があります。その場合は、バックエンドサーバーを介してAPIにアクセスするか、CORSプロキシを使用してください。

## ローカルサーバーの起動

```bash
# Pythonの組み込みHTTPサーバーを使用
python -m http.server

# または
python3 -m http.server
```

ブラウザで http://localhost:8000 にアクセスしてください。