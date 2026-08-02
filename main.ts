/**
 * Microbit More + M5Stack Unit Mini Scales + WS2812/NeoPixel ブリッジ
 *
 * Mini Scalesから取得した重量を、Microbit Moreのラベル付き数値として
 * Stretch3へ送信します。
 *
 * Stretch3側の通信仕様：
 * - ラベル「weight」：現在の重量（整数g）
 * - ラベル「cmd」に文字列「tare」を送信：風袋引きを実行
 * - ラベル「leds」に数値を送信：LEDを先頭から指定個数点灯
 * - ラベル「status」：風袋引き完了時に「tared」を返す
 */

// Grove ShieldのP0/P14端子では、LEDテープの信号線としてP0を使用する
const LED_PIN = DigitalPin.P0
const LED_COUNT = 30

// 0～255。USB給電への負荷を抑えるため約10％の明るさにする
const LED_BRIGHTNESS = 25

/**
 * Stretch3から指定された個数だけLEDを点灯する。
 * 個数はドライバ側で0～30に制限される。
 */
function updateNeoPixels(requestedCount: number): void {
    ws2812Compatible.showGreenBar(
        LED_PIN,
        requestedCount,
        LED_COUNT,
        LED_BRIGHTNESS
    )
}

// 起動時は全消灯する
updateNeoPixels(0)

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
