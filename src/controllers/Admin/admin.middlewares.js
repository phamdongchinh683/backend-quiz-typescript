const Admin = require("../../services/admin/admin.service.js");
const { responseStatus } = require("../handler/index.js");

exports.roleAdmin = async (req, res, next) => {
  const admin = await Admin.roleAdmin(req.user);
  if (admin?.role === "admin") {
    req.user = admin;
    next();
  } else {
    return responseStatus(
      res,
      401,
      "failed",
      "Access Denied. Admin only route!"
    );
  }
};

exports.isAdmin = async (req, res, next) => {
  const admin = await Admin.roleAdmin(req.body);
  if (admin?.role === "admin") {
    req.user = req.body;
    next();
  } else {
    return responseStatus(res, 401, "failed", "just only admin can login!");
  }
};
