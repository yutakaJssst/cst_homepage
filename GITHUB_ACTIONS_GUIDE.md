# GitHub Actionsを使用したデプロイ方法

このガイドでは、GitHub Actionsを使用してCST Homepageをデプロイする方法を説明します。

## 1. GitHubリポジトリの設定

まず、GitHubにリポジトリを作成し、コードをプッシュする必要があります。

1. GitHubにログインし、新しいリポジトリを作成します。
2. ローカルのプロジェクトをGitHubリポジトリにプッシュします：

```bash
# リポジトリを初期化（まだ行っていない場合）
git init

# すべてのファイルをステージング
git add .

# コミット
git commit -m "Initial commit"

# リモートリポジトリを追加（URLはGitHubリポジトリのURLに置き換えてください）
git remote add origin https://github.com/yourusername/cst_homepage.git

# コードをプッシュ
git push -u origin main
```

## 2. GitHub Secretsの設定

OpenAI APIキーをGitHub Secretsに保存します：

1. GitHubリポジトリのページで「Settings」タブをクリックします。
2. 左側のメニューから「Secrets and variables」→「Actions」を選択します。
3. 「New repository secret」ボタンをクリックします。
4. 名前を `API_KEY` として、値にOpenAI APIキーを入力します。
5. 「Add secret」ボタンをクリックして保存します。

## 3. GitHub Actionsワークフローファイルの理解

既に作成した `.github/workflows/deploy.yml` ファイルは以下のような内容になっています：

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches:
      - main  # または master、デフォルトブランチに合わせて変更

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v3

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '16'

      - name: Replace API Key
        run: |
          # config.jsファイルのダミーAPIキーを実際のAPIキーに置き換え
          sed -i "s/'sk-1234567890abcdefghijklmnopqrstuvwxyz1234567890'/'${{ secrets.API_KEY }}'/" assets/js/config.js

      - name: Deploy
        uses: JamesIves/github-pages-deploy-action@v4
        with:
          branch: gh-pages  # デプロイ先のブランチ
          folder: .         # デプロイするフォルダ
          clean: true       # デプロイ先ブランチから削除されたファイルを自動的に削除
```

このワークフローは以下のことを行います：

1. `main`ブランチにプッシュされたときに実行されます。
2. Ubuntuの最新バージョンでジョブを実行します。
3. リポジトリのコードをチェックアウトします。
4. Node.jsをセットアップします。
5. `config.js`ファイル内のダミーAPIキーを、GitHub Secretsに保存された実際のAPIキーに置き換えます。
6. `JamesIves/github-pages-deploy-action`アクションを使用して、コードをGitHub Pagesにデプロイします。

## 4. デプロイの実行

デプロイを実行するには、コードを`main`ブランチにプッシュするだけです：

```bash
# 変更をステージング
git add .

# コミット
git commit -m "Update website content"

# プッシュ
git push origin main
```

プッシュすると、GitHub Actionsが自動的にワークフローを実行し、サイトをデプロイします。

## 5. デプロイの確認

デプロイの進行状況と結果を確認するには：

1. GitHubリポジトリのページで「Actions」タブをクリックします。
2. 実行中または最近完了したワークフローが表示されます。
3. ワークフローをクリックすると、詳細な実行ログを確認できます。

デプロイが成功すると、サイトは以下のURLで公開されます：
`https://yourusername.github.io/cst_homepage/`

## 6. GitHub Pagesの設定

初めてGitHub Pagesを使用する場合は、リポジトリの設定でGitHub Pagesを有効にする必要があります：

1. GitHubリポジトリのページで「Settings」タブをクリックします。
2. 左側のメニューから「Pages」を選択します。
3. 「Source」セクションで、「Deploy from a branch」を選択します。
4. 「Branch」ドロップダウンから「gh-pages」を選択し、「/(root)」フォルダを選択します。
5. 「Save」ボタンをクリックします。

## 7. カスタムドメインの設定（オプション）

独自のドメインを使用する場合は、以下の手順で設定できます：

1. GitHubリポジトリのページで「Settings」タブをクリックします。
2. 左側のメニューから「Pages」を選択します。
3. 「Custom domain」セクションにドメイン名を入力します（例：`www.example.com`）。
4. 「Save」ボタンをクリックします。
5. DNSプロバイダーでCNAMEレコードを設定して、ドメインをGitHub Pagesに向けます。

## 8. トラブルシューティング

デプロイに問題がある場合は、以下を確認してください：

1. GitHub Actionsのログでエラーメッセージを確認します。
2. GitHub Secretsに`API_KEY`が正しく設定されているか確認します。
3. `.github/workflows/deploy.yml`ファイルが正しく設定されているか確認します。
4. リポジトリの設定でGitHub Pagesが正しく設定されているか確認します。

## 9. 注意事項

- GitHub Pagesは静的ウェブサイトのホスティングサービスです。サーバーサイドの処理（PHPやNode.jsなど）は実行できません。
- GitHub Pagesのサイトは公開されます。機密情報をコードに含めないように注意してください。
- GitHub Actionsの無料プランには月間の実行時間に制限があります。詳細はGitHubのドキュメントを参照してください。