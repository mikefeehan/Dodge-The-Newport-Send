import UIKit
import Capacitor

/// Registers the in-app GameCenterPlugin with the Capacitor bridge
/// (npm plugins register automatically; local ones need this hook).
class MainViewController: CAPBridgeViewController {
    override open func capacitorDidLoad() {
        bridge?.registerPluginInstance(GameCenterPlugin())
    }
}
