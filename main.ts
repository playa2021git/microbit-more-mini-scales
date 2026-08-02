/**
 * Microbit More + M5Stack Unit Mini Scales + NeoPixel ブリッジ
 *
 * Mini Scalesから取得した重量を、Microbit Moreのラベル付き数値として
 * Stretch3へ送信します。
 *
 * Stretch3側の通信仕様：
 * - ラベル「weight」：現在の重量（整数g）
 * - ラベル「cmd」に文字列「tare」を送信：風袋引きを実行
 * - ラベル「leds」に数値を送信：NeoPixelを先頭から指定個数点灯
 * - ラベル「status」：風袋引き完了時に「tared」を返す
 */

// NeoPixelの設定
// Grove ShieldのP0/P14端子では、NeoPixelの信号線としてP0を使用する
const LED_PIN = DigitalPin.P0
const LED_COUNT = 30
const LED_BRIGHTNESS = 25

// P0に接続した30個のRGB NeoPixelを初期化する
let strip = neopixel.create(LED_PIN, LED_COUNT, NeoPixelMode.RGB)

// USB給電への負荷を抑えるため、明るさを約10％に制限する
strip.setBrightness(LED_BRIGHTNESS)
strip.clear()
strip.show()

/**
 * Stretch3から指定された個数だけNeoPixelを点灯する。
 *
 * @param requestedCount Stretch3から受信した点灯数
 */
function updateNeoPixels(requestedCount: number): void {
    // 小数を切り捨て、0～30の範囲へ制限する
    let ledCount = Math.floor(requestedCount)

    if (ledCount < 0) {
        ledCount = 0
    }

    if (ledCount > LED_COUNT) {
        ledCount = LED_COUNT
    }

    // 一度すべて消灯する
    strip.clear()

    // LEDテープの先頭から指定個数を緑色に設定する
    for (let index = 0; index < ledCount; index++) {
        strip.setPixelColor(
            index,
            neopixel.colors(NeoPixelColors.Green)
        )
    }

    // 設定した内容をLEDテープへ送信する
    strip.show()
}

// Microbit MoreのBluetooth／USBシリアル通信サービスを開始する
MbitMore.startService()

// Stretch3からラベル「cmd」で送られた文字列命令を受信する
MbitMore.onReceivedTextWithLabel("cmd", function (command: string) {
    if (command == "tare") {
        // 現在載っている物を含めた状態を0gに設定する
        miniScales.tare()

        // Stretch3へ風袋引き完了を通知する
        MbitMore.sendTextWithLabel("status", "tared")
    }
})

// Stretch3からラベル「leds」で送られた点灯数を受信する
MbitMore.onReceivedNumberWithLabel("leds", function (ledCount: number) {
    updateNeoPixels(ledCount)
})

// Mini Scalesの重量を定期的にStretch3へ送信する
basic.forever(function () {
    // Mini Scalesから四捨五入済みの整数グラム値を取得する
    const weightG = miniScales.weight()

    // ラベル「weight」の数値として送信する
    MbitMore.sendNumberWithLabel("weight", weightG)

    // 1秒間に5回更新する。通信とI2Cへの負荷を抑えるため200ms待つ
    basic.pause(200)
})
