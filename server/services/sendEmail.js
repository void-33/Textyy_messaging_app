const transporter = require('./email.config');

async function sendVerificationEmail(to, verificationToken){
    const CLIENT_URL = process.env.CLIENT_URL || 'http://localhost:3001'
    const verificationLink = `${CLIENT_URL}/email-verified?token=${verificationToken}`
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
