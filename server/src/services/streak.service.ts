import User from '../models/user.model'; 
export const updateUserStreak = async (userId: string) => {
  try {
    const user = await User.findById(userId);
    if (!user) return;

    const now = new Date();
    const today = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));
    const lastDate = new Date(user.lastActivityDate);
    const lastActivity = new Date(Date.UTC(lastDate.getUTCFullYear(), lastDate.getUTCMonth(), lastDate.getUTCDate()));
    const diffTime = Math.abs(today.getTime() - lastActivity.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
    if (diffDays === 0) {
      return;
    } else if (diffDays === 1) {
      user.currentStreak += 1;
      if (user.currentStreak > user.longestStreak) {
        user.longestStreak = user.currentStreak;
      }
    } else {
    
      user.currentStreak = 1;
    }
    user.lastActivityDate = today;
    await user.save();

  } catch (error) {
    console.error("Streak update failed:", error);
  }
};