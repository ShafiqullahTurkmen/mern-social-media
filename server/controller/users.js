import User from "../models/User.js";

// READ
export const getUser = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) return res.status(400).json({ msg: "missing params!" });

    const user = await User.findById(id);
    if (!user) return res.status(404).json({ message: "User Not Found" });
    res.status(200).json(user);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};

export const getUserFriends = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) return res.status(400).json({ msg: "missing params!" });

    const user = await User.findById(id);
    if (!user) return res.status(404).json({ message: "User Not Found" });

    const friends = await Promise.all(
      user.friends.map((id) => User.findById(id))
    );
    if (!(Array.isArray(friends) && friends.length))
      return res.status(400).json({ msg: "friends Not Found!" });

    const formatedFriends = friends.map(
      ({ _id, firstName, lastName, occupation, location, picturePath }) => ({
        _id,
        firstName,
        lastName,
        occupation,
        location,
        picturePath,
      })
    );

    res.status(200).json(formatedFriends);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};

// UPDATE
export const addRemoveFriend = async (req, res) => {
  try {
    const { id, friendId } = req.params;

    if (!(id && friendId))
      return res.status(400).json({ msg: "missing params!" });

    const user = await User.findById(id);
    if (!user) return res.status(404).json({ message: "User Not Found" });

    const friend = await User.findById(friendId);
    if (!friend) return res.status(400).json({ msg: "friend Not Found!" });

    if (user?.friends?.includes(friendId)) {
      user.friends = user.friends.filter((objId) => objId !== friendId);
      friend.friends = friend.friends.filter((objId) => objId !== id);
    } else {
      user.friends.push(friendId);
      friend.friends.push(friendId);
    }

    await user.save();
    await friend.save();

    const friends = await Promise.all(
      user.friends.map((id) => User.findById(id))
    );
    if (!(Array.isArray(friends) && friends.length))
      return res.status(400).json({ msg: "friends Not Found!" });

    const formatedFriends = friends.map(
      ({ _id, firstName, lastName, occupation, location, picturePath }) => ({
        _id,
        firstName,
        lastName,
        occupation,
        location,
        picturePath,
      })
    );

    res.status(200).json(formatedFriends);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};
