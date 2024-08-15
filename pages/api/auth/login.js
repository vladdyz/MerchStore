import { authenticateUser } from '@/pages/api/authenticate';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    try {
      const { username, password } = req.body;
      const result = await authenticateUser(username, password);
      res.status(200).json(result);
    } catch (error) {
      console.error('Authentication error:', error); // Log the error for debugging
      res.status(500).json({ error: "Username or password is incorrect"});
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
