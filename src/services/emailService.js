const nodemailer = require('nodemailer');

const createTransporter = async () => {
    // Gmail SMTP configuration

    console.log('SMTP_USER:', process.env.SMTP_USER);
    console.log('SMTP_PASS:', process.env.SMTP_PASS);

    return nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 465,
        secure: true, // use SSL
        auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS
        },
        tls: {
            // Do not fail on invalid certificates
            rejectUnauthorized: false
        }
    });
};

const sendOTPEmail = async (email, otp) => {
  const transporter = await createTransporter();
  
  const mailOptions = {
    from: process.env.SMTP_USER,
    to: email,
    subject: 'Email Verification OTP',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #333;">Email Verification</h2>
        <p>Your OTP for email verification is:</p>
        <h1 style="color: #4CAF50; font-size: 32px; letter-spacing: 5px; text-align: center; padding: 20px; background: #f5f5f5; border-radius: 5px;">${otp}</h1>
        <p>This OTP will expire in 10 minutes.</p>
        <p>If you didn't request this verification, please ignore this email.</p>
      </div>
    `
  };

  try {
    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error('Error sending email:', error);
    throw new Error('Failed to send verification email');
  }
};

const sendPasswordResetEmail = async (email, resetToken) => {
  const transporter = await createTransporter();

  const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;
  const mailOptions = {
    from: process.env.SMTP_USER,
    to: email,
    subject: 'Password Reset Request',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #333;">Password Reset Request</h2>
        <p>You have requested to reset your password. Click the button below to proceed:</p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${resetUrl}" 
             style="background-color: #4CAF50; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; display: inline-block;">
            Reset Password
          </a>
        </div>
        <p>If you didn't request this password reset, please ignore this email.</p>
        <p>This link will expire in 1 hour.</p>
        <hr style="margin: 20px 0; border: none; border-top: 1px solid #eee;">
        <p style="color: #666; font-size: 12px;">This is an automated message, please do not reply.</p>
      </div>
    `
  };

  try {
    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error('Error sending password reset email:', error);
    throw new Error('Failed to send password reset email');
  }
};

const sendInterestMatchEmail = async (user1, user2) => {
  const transporter = await createTransporter();

  // Email for user1
  const mailOptions1 = {
    from: process.env.SMTP_USER,
    to: user1.email,
    subject: 'Interest Match - Contact Information',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #333;">🎉 Interest Match!</h2>
        <p>Great news! Your interest in <strong>${user2.full_name}</strong> has been accepted!</p>
        
        <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="color: #4CAF50; margin-top: 0;">Contact Information</h3>
          <p><strong>Name:</strong> ${user2.full_name}</p>
          <p><strong>Email:</strong> ${user2.email}</p>
          <p><strong>Phone:</strong> ${user2.phone_number}</p>
          <p><strong>Age:</strong> ${user2.age} years</p>
          <p><strong>Location:</strong> ${user2.location.city}, ${user2.location.state}</p>
          <p><strong>Profession:</strong> ${user2.profession}</p>
          ${user2.interests_hobbies ? `<p><strong>Interests:</strong> ${user2.interests_hobbies}</p>` : ''}
          ${user2.brief_personal_description ? `<p><strong>About:</strong> ${user2.brief_personal_description}</p>` : ''}
        </div>
        
        <p>You can now contact them directly to take your relationship forward!</p>
        <p>Best wishes,<br>The Manas Team</p>
        
        <hr style="margin: 20px 0; border: none; border-top: 1px solid #eee;">
        <p style="color: #666; font-size: 12px;">This is an automated message, please do not reply.</p>
      </div>
    `
  };

  // Email for user2
  const mailOptions2 = {
    from: process.env.SMTP_USER,
    to: user2.email,
    subject: 'Interest Match - Contact Information',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #333;">🎉 Interest Match!</h2>
        <p>Great news! You have accepted <strong>${user1.full_name}</strong>'s interest in your profile!</p>
        
        <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="color: #4CAF50; margin-top: 0;">Contact Information</h3>
          <p><strong>Name:</strong> ${user1.full_name}</p>
          <p><strong>Email:</strong> ${user1.email}</p>
          <p><strong>Phone:</strong> ${user1.phone_number}</p>
          <p><strong>Age:</strong> ${user1.age} years</p>
          <p><strong>Location:</strong> ${user1.location.city}, ${user1.location.state}</p>
          <p><strong>Profession:</strong> ${user1.profession}</p>
          ${user1.interests_hobbies ? `<p><strong>Interests:</strong> ${user1.interests_hobbies}</p>` : ''}
          ${user1.brief_personal_description ? `<p><strong>About:</strong> ${user1.brief_personal_description}</p>` : ''}
        </div>
        
        <p>You can now contact them directly to take your relationship forward!</p>
        <p>Best wishes,<br>The Manas Team</p>
        
        <hr style="margin: 20px 0; border: none; border-top: 1px solid #eee;">
        <p style="color: #666; font-size: 12px;">This is an automated message, please do not reply.</p>
      </div>
    `
  };

  try {
    await transporter.sendMail(mailOptions1);
    await transporter.sendMail(mailOptions2);
  } catch (error) {
    console.error('Error sending interest match emails:', error);
    throw new Error('Failed to send interest match emails');
  }
};

module.exports = {
  sendOTPEmail,
  sendPasswordResetEmail,
  sendInterestMatchEmail
};
