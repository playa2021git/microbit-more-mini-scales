/**
 * Microbit Moreと共存できる最小WS2812/NeoPixelドライバ。
 *
 * 公式pxt-neopixelはBluetoothを無効化するyotta設定を含むため、
 * Microbit Moreとは依存関係が競合します。
 * このファイルではMakeCode本体に内蔵されたlight::sendWS2812Bufferを
 * 直接呼び出し、Bluetooth設定を変更せずにLEDへデータを送信します。
 */
namespace ws2812Compatible {
    /**
     * GRB形式のバッファをWS2812/NeoPixelへ送信する。
     */
    //% shim=light::sendWS2812Buffer
    function sendBuffer(buffer: Buffer, pin: DigitalPin): void {
        // シミュレーター用の空実装。実機ではshim先のネイティブ関数が動作する。
    }

    /**
     * LEDテープの先頭から指定個数を緑色に点灯する。
     *
     * @param pin 信号線を接続したデジタルピン
     * @param requestedCount 点灯させる個数
     * @param totalCount LEDの総数
     * @param brightness 緑色の明るさ（0～255）
     */
    export function showGreenBar(
        pin: DigitalPin,
        requestedCount: number,
        totalCount: number,
        brightness: number
    ): void {
        let ledCount = Math.floor(requestedCount)
        let safeTotal = Math.floor(totalCount)
        let safeBrightness = Math.floor(brightness)

        if (safeTotal < 0) {
            safeTotal = 0
        }

        if (ledCount < 0) {
            ledCount = 0
        }

        if (ledCount > safeTotal) {
            ledCount = safeTotal
        }

        if (safeBrightness < 0) {
            safeBrightness = 0
        }

        if (safeBrightness > 255) {
            safeBrightness = 255
        }

        // WS2812の一般的な並びはG-R-Bの3バイト。
        const buffer = pins.createBuffer(safeTotal * 3)

        for (let index = 0; index < ledCount; index++) {
            const offset = index * 3
            buffer[offset] = safeBrightness // Green
            buffer[offset + 1] = 0           // Red
            buffer[offset + 2] = 0           // Blue
        }

        // 消灯部分はバッファ生成時の0のまま送信する。
        sendBuffer(buffer, pin)
    }
}
