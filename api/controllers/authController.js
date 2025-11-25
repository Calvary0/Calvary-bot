export const loginWithDiscord = async (req, res) => {
  try {
    return res.status(200).json({ message: 'auth controller placeholder' })
  } catch (error) {
    res.status(500).json({ error: 'Auth controller not implemented' })
  }
}
