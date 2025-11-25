export const getGuildSettings = async (req, res) => {
  try {
    return res.status(200).json({ message: 'guild controller placeholder' })
  } catch (error) {
    res.status(500).json({ error: 'Guild controller not implemented' })
  }
}
