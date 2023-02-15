const avatarImageController = async (req, res) => {
  const avatar = req.params.avatar;

  res.json({ avatar });
};

module.exports = {
  avatarImageController,
};
