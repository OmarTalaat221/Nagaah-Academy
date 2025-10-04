import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { base_url } from "../constants";

const useDiamondReward = () => {
  const [showDiamondModal, setShowDiamondModal] = useState(false);
  const [showTreasureModal, setShowTreasureModal] = useState(false);
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

  // Check for diamond updates from server
  const checkDiamondUpdates = useCallback(async () => {
    const userData = getUserData();
    if (!userData || !userData.student_id) return;

    try {
      const response = await axios.post(
        `${base_url}/user/auth/user_info.php`,
        JSON.stringify({ student_id: userData.student_id }),
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
  }, [getUserData, updateUserData]);

  // Initialize and start periodic checking
  useEffect(() => {
    const userData = getUserData();
    if (userData && userData.student_id) {
      setPreviousDiamonds(parseInt(userData.diamond) || 0);

      // Initial check
      checkDiamondUpdates();

      const interval = setInterval(checkDiamondUpdates, 300000);

      return () => clearInterval(interval);
    }
  }, [checkDiamondUpdates, getUserData]);

  return {
    showDiamondModal,
    showTreasureModal,
    newDiamondsEarned,
    setShowDiamondModal,
    setShowTreasureModal,
    currentDiamonds: previousDiamonds,
  };
};

export default useDiamondReward;
