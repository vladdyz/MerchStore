import { registerUser } from '@/pages/api/authenticate';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    try {
      const { username, password, password2 } = req.body;
      //console.log(username, password, password2);

      if (password !== password2) {
        return res.status(400).json({ error: 'Passwords do not match' });
      }

      const result = await registerUser({ username, password, password2 });
      res.status(201).json(result);
    } catch (error) {
      console.error('Error in register API handler:', error); // Log the error
      res.status(500).json({ error: error.message });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}