# Microbit More Mini Scales

M5Stack Unit Mini Scalesを、BBC micro:bit V2とMicrobit Moreを経由してStretch3から利用するためのブリッジ用MakeCodeプロジェクトです。

## 構成

- BBC micro:bit V2
- Seeed Studio Grove Shield for micro:bit v2.0
- M5Stack Unit Mini Scales
- Stretch3
- Microbit More

Mini ScalesはGrove Shieldの **I2C端子** に接続します。

> Mini Scalesは5V給電を必要とします。使用するシールドと給電方法の仕様を確認してください。

## MakeCodeへの読み込み

1. [Microsoft MakeCode for micro:bit](https://makecode.microbit.org/)を開く
2. 「読み込む」を選択する
3. 「URLから読み込む」を選択する
4. 次のURLを貼り付ける

```text
https://github.com/playa2021git/microbit-more-mini-scales
```

5. プロジェクトを開き、micro:bit V2へ書き込む

Microbit Moreを含むため、初回コンパイルには時間がかかる場合があります。

## Stretch3との通信仕様

### 重量の取得

micro:bitから次のラベルで重量を送信します。

| ラベル | データ型 | 内容 |
|---|---|---|
| `weight` | 数値 | Mini Scalesの重量（整数g） |

Stretch3では、Microbit Moreの「ラベル `weight` のデータ」ブロックで取得します。

### 風袋引き

Stretch3から次のデータを送信します。

| ラベル | データ型 | 内容 |
|---|---|---|
| `cmd` | 文字列 | `tare` |

風袋引きが完了すると、micro:bitから次のデータを返します。

| ラベル | データ型 | 内容 |
|---|---|---|
| `status` | 文字列 | `tared` |

## 更新周期

重量は200ms間隔、1秒間に約5回送信します。

## 使用している拡張機能

- [Microbit More v2 MakeCode Extension](https://github.com/microbit-more/pxt-mbit-more-v2)
- [pxt-mini-scales](https://github.com/playa2021git/pxt-mini-scales)

## 注意

- MakeCodeシミュレーターでは実際の重量を取得できません。
- micro:bit V1ではなく、micro:bit V2での使用を前提としています。
- 現段階ではStretch3に専用のMini Scaleブロックを追加していません。Microbit Moreのラベル付きデータ送受信ブロックを使用します。

## License

MIT License
