const adminEmails = {
  superAdmins: process.env.SUPER_ADMIN_EMAILS?.split(',') || [],
  admins: process.env.ADMIN_EMAILS?.split(',') || []
};

// Validate email format
const validateEmails = (emails) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emails.every(email => emailRegex.test(email));
};

if (!validateEmails(adminEmails.superAdmins) || !validateEmails(adminEmails.admins)) {
  console.error('Invalid email format in admin configuration');
  process.exit(1);
}

module.exports = adminEmails; 