# Estimating transaction cost on Soneium

Soneium 上でのトランザクションコスト見積もり方法を探る。

## 環境

- Node.js
  - `20.16.0`

## 準備

### 使用するパッケージのインストール

```bash
$ npm i
```

## 実施

### ethers.js v6 を使った方式

```bash
$ npx ts-node ./ethers.ts
```

### viem v2 を使った方式

```bash
$ npx ts-node ./viem.ts
```
