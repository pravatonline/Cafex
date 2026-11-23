/**
 * CAFEX - ROLE BASED ACCESS CONTROL (RBAC) MIDDLEWARE
 * Roles hierarchy: customer < staff < kitchen < manager < admin < super_admin
 */

const verifyRole = (allowedRoles = []) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required before checking permissions.'
      });
    }

    const userRole = req.user.role;

    // Super Admin has unrestricted access to everything
    if (userRole === 'super_admin') {
      return next();
    }

    if (!allowedRoles.includes(userRole)) {
      return res.status(403).json({
        success: false,
        message: `Forbidden: Access restricted to [${allowedRoles.join(', ')}] roles. Your role is '${userRole}'.`
      });
    }

    next();
  };
};

module.exports = {
  verifyRole
};
