const { wtRoleId} = require('../config.json')


module.exports = {

async assignRole(member) {
    const role = member.guild.roles.cache.get(wtRoleId);

    if (!role) {
      console.log(`Could not find role with ID ${wtRoleId}`);
      return;
    }
    try {
      await member.roles.add(role);
      console.log(`Added role ${role.name} to member ${member.user.tag}`);
    } catch (error) {
      console.error(`Error assigning role to member ${member.user.tag}: ${error}`);
    }
  }
}