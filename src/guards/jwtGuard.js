import jwt from 'jsonwebtoken';

/**
 * @param {object} req - O objeto de requisição do Express.
 * @param {object} res - O objeto de resposta do Express.
 * @param {function} next - A função para chamar o próximo middleware.
 */
export default function JwtAuthGuard(req, res, next) {
    const authHeader = req.headers['authorization'];
    if (!authHeader && !req.query.token) {
      return res.status(401).json({ message: 'Token não fornecido.' });
    }

    const token = authHeader.split(' ')[0];
    if (req.query.token && !token) { 
      token = req.query.token;
    }
    if (!token) {
      return res.status(401).json({ message: 'Token não encontrado.' });
    }

    try {
      if (!process.env.JWT_SECRET) {
        return res.status(500).json({ message: 'Erro interno no servidor.' });
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      req.user = {
        id: decoded.sub,
        login: decoded.login,
        role: decoded.role,
      };

      next();
    } catch (error) {
      return res.status(401).json({ message: 'Token inválido ou expirado.' }); 
    }
}
