

module.exports = {

    async removeRole(member) {
        const role = member.guild.roles.cache.find(r => r.name === 'War Thunder');
        if (!role) {
          console.log(`Could not find role with name ROLE_NAME`);
          return;
        }
        try {
          await member.roles.remove(role);
          console.log(`Removed role ${role.name} from member ${member.user.tag}`);
        } catch (error) {
          console.error(`Error removing role from member ${member.user.tag}: ${error}`);
        }
      }
      
    }