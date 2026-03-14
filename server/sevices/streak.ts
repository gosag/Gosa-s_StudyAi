import User from '../models/userSchema'; // Adjust path if needed

export const updateUserStreak = async (userId: string) => {
  try {
    const user = await User.findById(userId);
    if (!user) return;

    const now = new Date();
    // 1. Get the current date without the time (e.g., 2026-03-14T00:00:00.000Z)
    const today = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));
    // 3. Strip the time from the user's lastActivityDate for an apples-to-apples comparison
    const lastDate = new Date(user.lastActivityDate);
    const lastActivity = new Date(Date.UTC(lastDate.getUTCFullYear(), lastDate.getUTCMonth(), lastDate.getUTCDate()));

    // 4. Calculate the difference in days
    const diffTime = Math.abs(today.getTime() - lastActivity.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 

    // 5. Apply the Streak Logic Route
    if (diffDays === 0) {
      // Case A: Action already performed today. Do nothing.
      return;
    } else if (diffDays === 1) {
      // Case B: Action performed yesterday. Maintain and increment streak!
      user.currentStreak += 1;
      if (user.currentStreak > user.longestStreak) {
        user.longestStreak = user.currentStreak;
      }
    } else {
      // Case C: Missed a day (diffDays > 1). Streak broken. Reset.
      user.currentStreak = 1;
    }

    // 6. Finalize
    user.lastActivityDate = today;
    await user.save();

  } catch (error) {
    console.error("Streak update failed:", error);
  }
};