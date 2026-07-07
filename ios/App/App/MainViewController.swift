import UIKit
import Capacitor

/// Registers the in-app plugins with the Capacitor bridge
/// (npm plugins register automatically; local ones need this hook).
class MainViewController: CAPBridgeViewController {
    override open func capacitorDidLoad() {
        bridge?.registerPluginInstance(GameCenterPlugin())
        bridge?.registerPluginInstance(AppReviewPlugin())
    }
}
