@echo off
chcp 65001 > NUL
echo ===================================================
echo   Circadian (NowTask) GitHub Pages 自動デプロイツール
echo ===================================================
echo.

cd /d "c:\Users\81704\Downloads\AIディア\nowtask"

echo [1/5] Node.js 依存パッケージのインストール中 (gh-pagesなど)...
call npm install
if %ERRORLEVEL% neq 0 (
    echo.
    echo ❌ エラー: パッケージのインストールに失敗しました。
    pause
    exit /b %ERRORLEVEL%
)
echo.

echo [2/5] ローカル Git リポジトリの初期化中...
if not exist .git (
    call git init
    call git branch -M main
)
echo.

echo [3/5] 最新コードのコミットを作成中...
call git add .
call git commit -m "feat: add interactive competitive analysis and gh-pages deployment setup"
echo.

echo [4/5] GitHub 上にリポジトリを自動作成中...
echo ユーザー 'taku010201040' のアカウント配下に公開リポジトリ 'nowtask' を作成します。
echo すでに存在する場合は自動的にスキップされ、次の処理に進みます。
call gh repo create nowtask --public --source=. --push > NUL 2>&1
if %ERRORLEVEL% neq 0 (
    echo.
    echo ℹ️  リポジトリがすでに存在するか、作成ステップをスキップしました。
    echo リモート接続を確認して次のステップに進みます...
    call git remote add origin https://github.com/taku010201040/nowtask.git > NUL 2>&1
    call git push -u origin main > NUL 2>&1
) else (
    echo.
    echo 🎉 GitHubリポジトリ 'nowtask' を新規作成し、mainブランチをプッシュしました！
)
echo.

echo [5/5] プロジェクトのビルド ＆ GitHub Pagesへデプロイ中...
call npm run deploy
if %ERRORLEVEL% neq 0 (
    echo.
    echo ❌ エラー: デプロイに失敗しました。
    pause
    exit /b %ERRORLEVEL%
)

echo.
echo ===================================================
echo 🎉 デプロイが正常に完了しました！
echo ===================================================
echo 以下のURLからあなたのアプリにアクセスできます：
echo.
echo   🔗 https://taku010201040.github.io/nowtask/
echo.
echo ※ GitHub Pagesの初回反映には1〜2分程度かかる場合があります。
echo ===================================================
pause
