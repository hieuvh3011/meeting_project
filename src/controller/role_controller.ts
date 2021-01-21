import Role from "../models/roles";

const insertRole = async (roleType: string): Promise<void> => {
  const roleAlreadyExist = (await findRoleByType(roleType)) != -1;
  if (!roleAlreadyExist) {
    await Role.create(roleType);
  }
};

const findRoleByType = async (roleType: string) => {
  const result = await Role.findOne({ where: { roleType } });
  if (!result) {
    return -1;
  }
  return result;
};

/**
 * By default, the system will have three role:
 * @var standard,
 * @var leader,
 * @var manager
 * @function generateDefaultRole
 */
const generateDefaultRole = async (): Promise<void> => {
  await insertRole("standard");
  await insertRole("leader");
  await insertRole("manager");
};

const getRoleIdByType = async (roleType: string): Promise<number> => {
  const role = await Role.findOne({ where: { role_type: roleType } });
  return role["dataValues"]["id"];
};

const getRoleTypeById = async (id: string): Promise<string> => {
  const role = await Role.findOne({ where: { id } });
  return role["dataValues"]["roleType"];
};



export default {
  insertRole,
  generateDefaultRole,
  getRoleIdByType,
  getRoleTypeById
};
