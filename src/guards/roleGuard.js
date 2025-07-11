/**
 * Middleware para verificar se o usuário tem uma das roles permitidas.
 * Deve ser usado DEPOIS do JwtAuthGuard.
 * * @param {string[]} allowedRoles - Um array de strings com as roles que têm permissão. Ex: ['admin', 'gerente']
 */
export const checkRole = (allowedRoles) => {
  // Retorna a função de middleware do Express
  return (req, res, next) => {
    // 1. Pega o usuário que foi anexado pelo JwtAuthGuard
    const user = req.user;

    // 2. Verifica se o usuário e a role existem
    // Se não, é porque o JwtAuthGuard não foi usado antes, ou o token não tem a role.
    if (!user || !user.role) {
      return res.status(403).json({ message: 'Acesso negado. Informações de permissão ausentes.' });
    }

    // 3. Verifica se a role do usuário está na lista de roles permitidas
    if (allowedRoles.includes(user.role)) {
      // Se a role do usuário está na lista, permite o acesso
      next();
    } else {
      // Se não, nega o acesso com o status 403 Forbidden.
      // 401 Unauthorized = Não autenticado (não logado).
      // 403 Forbidden = Autenticado, mas sem permissão para este recurso específico.
      return res.status(403).json({ message: 'Acesso negado. Você não tem permissão para realizar esta ação.' });
    }
  };
};