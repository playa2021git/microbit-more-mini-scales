# Microbit More Mini Scales

M5Stack Unit Mini ScalesとWS2812/NeoPixel LEDを、BBC micro:bit V2とMicrobit Moreを経由してStretch3から利用するためのブリッジ用MakeCodeプロジェクトです。

## 構成

- BBC micro:bit V2
- Seeed Studio Grove Shield for micro:bit v2.0
- M5Stack Unit Mini Scales
- Groveコネクタ対応WS2812/NeoPixel 30LED
- Stretch3
- Microbit More

## 接続

| 機器 | Grove Shieldの端子 |
|---|---|
| M5Stack Unit Mini Scales | I2C端子 |
| WS2812/NeoPixel 30LED | P0/P14端子 |

LEDテープの信号線にはP0を使用します。P14はこのプログラムでは使用しません。

> Mini ScalesとLEDテープには安定した給電が必要です。このプログラムでは緑色の明るさを25/255（約10％）に制限しています。

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

## BluetoothとWS2812の互換処理

Microsoft公式の`pxt-neopixel`拡張機能は、Bluetoothを無効化する設定を含みます。そのため、Bluetoothを有効にするMicrobit Moreと同時に追加するとMakeCodeで設定競合が発生します。

本プロジェクトでは`pxt-neopixel`を依存関係に追加せず、MakeCode本体に内蔵された`light::sendWS2812Buffer`を`ws2812-compatible.ts`から直接呼び出します。これにより、Microbit MoreのBluetooth／USB通信設定を維持したままLEDへデータを送信します。

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

### LEDの点灯数

Stretch3から、点灯させるLED数を次のラベルで送信します。

| ラベル | データ型 | 内容 |
|---|---|---|
| `leds` | 数値 | 先頭から点灯させるLED数（0～30） |

受信した値は小数点以下を切り捨て、0未満は0、30を超える値は30として処理します。LEDは緑色で点灯します。

10g増えるごとに1個点灯させる場合、Stretch3側で次のように計算します。

```text
点灯数 = 重さ ÷ 10 の切り下げ
```

計算した点灯数を、Microbit Moreの送信ブロックで次のように送ります。

```text
micro:bitへデータ「点灯数」にラベル「leds」を付けて送る
```

同じ点灯数を繰り返し送らないように、「前回の点灯数」と異なる場合だけ送信する方法を推奨します。

## 更新周期

重量は200ms間隔、1秒間に約5回送信します。LEDはStretch3から`leds`を受信したときだけ更新します。

## 使用している拡張機能

- [Microbit More v2 MakeCode Extension](https://github.com/microbit-more/pxt-mbit-more-v2)
- [pxt-mini-scales](https://github.com/playa2021git/pxt-mini-scales)

WS2812送信部分は、このリポジトリ内の`ws2812-compatible.ts`に実装しています。

## 注意

- MakeCodeシミュレーターでは実際の重量やLEDを確認できません。
- micro:bit V1ではなく、micro:bit V2での使用を前提としています。
- P0はLED専用として扱い、Stretch3から通常のデジタル出力・アナログ出力・サーボ制御には使用しないでください。
- LEDのちらつき、micro:bitの再起動、重量値の乱れが起きる場合は電力不足を疑ってください。
- 現段階ではStretch3に専用ブロックを追加していません。Microbit Moreのラベル付きデータ送受信ブロックを使用します。

## License

MIT License
