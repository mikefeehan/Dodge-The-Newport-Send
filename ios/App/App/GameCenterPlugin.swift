import Capacitor
import GameKit

/// Minimal Game Center bridge for the game (no npm plugin needed — lives in the app target).
/// JS side: window.Capacitor.Plugins.GameCenter.{authenticate, submitScore, showLeaderboard}
@objc(GameCenterPlugin)
public class GameCenterPlugin: CAPPlugin, CAPBridgedPlugin {
    public let identifier = "GameCenterPlugin"
    public let jsName = "GameCenter"
    public let pluginMethods: [CAPPluginMethod] = [
        CAPPluginMethod(name: "authenticate", returnType: CAPPluginReturnPromise),
        CAPPluginMethod(name: "submitScore", returnType: CAPPluginReturnPromise),
        CAPPluginMethod(name: "showLeaderboard", returnType: CAPPluginReturnPromise)
    ]

    @objc func authenticate(_ call: CAPPluginCall) {
        DispatchQueue.main.async {
            var resolved = false
            GKLocalPlayer.local.authenticateHandler = { [weak self] viewController, _ in
                // GameKit may hand us a sign-in view controller first, then call again with the result.
                if let vc = viewController {
                    self?.bridge?.viewController?.present(vc, animated: true)
                    return
                }
                guard !resolved else { return }
                resolved = true
                call.resolve(["authenticated": GKLocalPlayer.local.isAuthenticated])
            }
        }
    }

    @objc func submitScore(_ call: CAPPluginCall) {
        guard GKLocalPlayer.local.isAuthenticated else { call.reject("Not signed in to Game Center"); return }
        guard let leaderboardId = call.getString("leaderboardId") else { call.reject("leaderboardId is required"); return }
        let score = call.getInt("score") ?? 0
        GKLeaderboard.submitScore(score, context: 0, player: GKLocalPlayer.local,
                                  leaderboardIDs: [leaderboardId]) { error in
            if let error = error { call.reject(error.localizedDescription) } else { call.resolve() }
        }
    }

    @objc func showLeaderboard(_ call: CAPPluginCall) {
        guard GKLocalPlayer.local.isAuthenticated else { call.reject("Not signed in to Game Center"); return }
        guard let leaderboardId = call.getString("leaderboardId") else { call.reject("leaderboardId is required"); return }
        DispatchQueue.main.async {
            let vc = GKGameCenterViewController(leaderboardID: leaderboardId, playerScope: .global, timeScope: .allTime)
            vc.gameCenterDelegate = self
            self.bridge?.viewController?.present(vc, animated: true)
            call.resolve()
        }
    }
}

extension GameCenterPlugin: GKGameCenterControllerDelegate {
    public func gameCenterViewControllerDidFinish(_ gameCenterViewController: GKGameCenterViewController) {
        gameCenterViewController.dismiss(animated: true)
    }
}
