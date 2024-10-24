// pages/api/protectedRoute.js
import { authMiddleware } from "../../middleware/authMiddleware";
import { getUserData } from "../../utils/users";

export default authMiddleware(async (req, res) => {
  const userId = req.user.userId;
  const userData = await getUserData(userId);
  res.status(200).json({ message: "Welcome!", user: userData });
});
