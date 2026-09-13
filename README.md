# FGCHS Teachers Demo

福岡女子商業高等学校「教員紹介」GitHub Pages確認用デモです。

## 公開方法

1. GitHubで新しいリポジトリを作成します。
2. このフォルダ内のファイルを、フォルダ構成を保ったままリポジトリ直下へアップロードします。
3. GitHubの **Settings → Pages** を開きます。
4. **Build and deployment → Source** を `Deploy from a branch` にします。
5. Branch を `main`、Folder を `/(root)` にして保存します。
6. 数十秒〜数分後に発行されるURLで確認します。

## ファイル構成

```text
fgchs-teachers-v2-github-pages/
├── index.html
├── .nojekyll
├── README.md
├── assets/
│   ├── styles.css
│   └── app.js
└── data/
    └── teachers.json
```

## データについて

`data/teachers.json` は、提供された `女子商_教員紹介_正式運用テンプレート_v2_0(1).xlsx` の内容をもとに生成しています。

- `active = TRUE` の教員のみ表示
- 通常教員とパラレルティーチャーを分離
- `cardImagePosition` / `profileImagePosition` を別々に反映
- プロフィールの空欄項目は自動的に非表示
- 「関連リンク」シートをプロフィール下部へ表示
- 「追加プロフィール」シートを任意セクションとして表示
- `プロフィール状態`、`最終確認日`、`備考（内部用）` は公開画面に表示しません

## 注意

写真は学校WordPressの画像URLを参照しています。GitHub Pages側には写真ファイルを複製していません。

このデモは表示確認用です。最終WordPress版では、教員データをカスタム投稿タイプからPHPでサーバー生成し、画像はWordPressのレスポンシブ画像機能を利用する想定です。
