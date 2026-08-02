/**
 * Microbit More + M5Stack Unit Mini Scales ブリッジ
 *
 * Mini Scalesから取得した重量を、Microbit Moreのラベル付き数値として
 * Stretch3へ送信します。
 *
 * Stretch3側の通信仕様：
 * - ラベル「weight」：現在の重量（整数g）
 * - ラベル「cmd」に文字列「tare」を送信：風袋引きを実行
 * - ラベル「status」：風袋引き完了時に「tared」を返す
 */

// Microbit MoreのBluetooth／USBシリアル通信サービスを開始する
MbitMore.startService()

// Scratchからラベル「cmd」で送られた文字列命令を受信する
MbitMore.onReceivedTextWithLabel("cmd", function (command: string) {
    if (command == "tare") {
        // 現在載っている物を含めた状態を0gに設定する
        miniScales.tare()

        // Stretch3へ風袋引き完了を通知する
        MbitMore.sendTextWithLabel("status", "tared")
    }
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
