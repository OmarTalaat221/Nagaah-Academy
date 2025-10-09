import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { base_url } from "../constants";

const useDiamondReward = () => {
  const [showDiamondModal, setShowDiamondModal] = useState(false);
  const [showTreasureModal, setShowTreasureModal] = useState(false);
  const [showSecurityAlert, setShowSecurityAlert] = useState(false);
  const [securityAlertVisible, setSecurityAlertVisible] = useState(false);
  const [previousDiamonds, setPreviousDiamonds] = useState(0);
  const [newDiamondsEarned, setNewDiamondsEarned] = useState(0);

  const getUserData = useCallback(() => {
    const localData = localStorage.getItem("NagahUser");
    if (!localData) return null;

    try {
      // Plain JSON parse without encryption
      const userData = JSON.parse(localData);
      return userData;
    } catch (error) {
      console.error("Error parsing NagahUser data:", error);
      return null;
    }
  }, []);

  // Update localStorage with new user data
  const updateUserData = useCallback((newData) => {
    try {
      // Plain JSON stringify without encryption
      localStorage.setItem("NagahUser", JSON.stringify(newData));
    } catch (error) {
      console.error("Error updating NagahUser data:", error);
    }
  }, []);

  // Get current FCM token
  const getCurrentFCMToken = useCallback(() => {
    return localStorage.getItem("fcmToken");
  }, []);

  // Check for diamond updates and FCM token changes from server
  const checkDiamondUpdates = useCallback(async () => {
    const userData = getUserData();
    if (!userData || !userData.student_id) return;

    try {
      const currentFCMToken = getCurrentFCMToken();

      const response = await axios.post(
        `${base_url}/user/auth/user_info.php`,
        JSON.stringify({
          student_id: userData.student_id,
          fcm_token: currentFCMToken, // Send current FCM token to compare
        }),
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data.status === "success") {
        const serverUserData = response.data.message;
        const currentDiamonds = parseInt(serverUserData.diamond) || 0;
        const localDiamonds = parseInt(userData.diamond) || 0;

        // Check FCM token mismatch (security check)
        const serverFCMToken = serverUserData.fcm_token;
        if (
          serverFCMToken &&
          currentFCMToken &&
          serverFCMToken !== currentFCMToken
        ) {
          console.log(
            "FCM Token mismatch detected - user logged in from another device"
          );
          console.log("Local FCM:", currentFCMToken);
          console.log("Server FCM:", serverFCMToken);

          // Trigger security alert and timer
          setShowSecurityAlert(true);
          setSecurityAlertVisible(true);
          return; // Don't process diamond updates if security issue detected
        }

        console.log("Diamond check for NagahUser:", {
          currentDiamonds,
          localDiamonds,
          student_id: userData.student_id,
        });

        // Update localStorage with server data
        const updatedUserData = { ...userData, ...serverUserData };
        updateUserData(updatedUserData);

        // Check if diamonds increased
        if (currentDiamonds > localDiamonds) {
          const newDiamonds = currentDiamonds - localDiamonds;
          setNewDiamondsEarned(newDiamonds);

          console.log("New diamonds earned:", newDiamonds);

          // Show diamond reward
          setShowDiamondModal(true);

          // Check for treasure reward (every 10 diamonds)
          const currentTreasures = Math.floor(currentDiamonds / 10);
          const previousTreasures = Math.floor(localDiamonds / 10);

          if (currentTreasures > previousTreasures) {
            console.log("Treasure reward unlocked!");
            setTimeout(() => {
              setShowTreasureModal(true);
            }, 3000); // Show treasure modal after diamond modal
          }
        }

        setPreviousDiamonds(currentDiamonds);
      }
    } catch (error) {
      console.error("Error checking diamond updates:", error);
    }
  }, [getUserData, updateUserData, getCurrentFCMToken]);

  // Initialize and start periodic checking
  useEffect(() => {
    const userData = getUserData();
    if (userData && userData.student_id) {
      setPreviousDiamonds(parseInt(userData.diamond) || 0);

      // Initial check
      checkDiamondUpdates();

      const interval = setInterval(checkDiamondUpdates, 300000); // 5 minutes

      return () => clearInterval(interval);
    }
  }, [checkDiamondUpdates, getUserData]);

  // Hide security alert visually (but keep timer running)
  const hideSecurityAlertVisual = useCallback(() => {
    setSecurityAlertVisible(false);
  }, []);

  // Complete security alert cleanup (called when timer ends)
  const completeSecurityAlert = useCallback(() => {
    setShowSecurityAlert(false);
    setSecurityAlertVisible(false);
  }, []);

  return {
    showDiamondModal,
    showTreasureModal,
    showSecurityAlert,
    securityAlertVisible,
    newDiamondsEarned,
    setShowDiamondModal,
    setShowTreasureModal,
    setShowSecurityAlert,
    hideSecurityAlertVisual,
    completeSecurityAlert,
    currentDiamonds: previousDiamonds,
  };
};

export default useDiamondReward;
