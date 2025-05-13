const transporter = require('./email.config');

async function sendVerificationEmail(to, verificationToken){
    const BASE_URL = process.env.BASE_URL || 'http://localhost:5000'
    const verificationLink = `${BASE_URL}/api/auth/verify-email?token=${verificationToken}`
  try {
    await transporter.sendMail({
      from: '"Textyy Team" <noreply@textyy.com>',
      to, // This email doesn't need to exist
      subject: "Test Verification Email",
      html: `
        <p> Thank you for registering with Textyy? </p>
        <p> Please Click the link below to verify your Email: </p>
        <a href="${verificationLink}">Verify Email</a>
      `,
    });
  } catch (err) {
    console.error("❌ Failed to send email:", err);
  }
}

module.exports = { sendVerificationEmail };
