export const getCurrentUser = async (req, res) => {
  try {
    return res.status(200).json({ message: 'user controller placeholder' })
  } catch (error) {
    res.status(500).json({ error: 'User controller not implemented' })
  }
}
