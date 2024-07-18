const nodemailer = require("nodemailer")
const crypto = require('crypto')
const db = require('../config/db')

function sendVerificationEmail(email, token, res) {
    const transporter = nodemailer.createTransport({
      service: 'Gmail',
      auth: {
        user: "kirui6623@gmail.com",
        pass: 'vsgx bfsn inzz eyaz',
      },
    });
  
    const mailOptions = {
      from: "kirui66@3@gmail.com",
      to: email,
      subject: 'Email Verification',
      html: `<p>Click the link to verify your email: <a href="http://localhost:3000/verify-email?token=${token}">Verify Email</a></p>`,
    };
  
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error('Error sending email:', error);
      } else {
        console.log('Email sent:', info.response);
      }
    });

}

function sendResetEmail(userEmail) {
    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetTokenExpires = new Date(Date.now() + 3600000); // Token expires in 1 hour

    const query = 'UPDATE users SET token = ?, tokenExpires = ? WHERE email = ?';
    db.query(query, [resetToken, resetTokenExpires, userEmail], (err, results) => {
        if (err) {
            console.error('Error updating the database with reset token:', err);
            throw err;
        }

        if (results.affectedRows === 0) {
            console.error('No user found with that email address');
            throw new Error('No user found with that email address');
        }

        const transporter = nodemailer.createTransport({
            service: 'Gmail',
            auth: {
                user: 'kirui6623@gmail.com',
                pass: 'vsgx bfsn inzz eyaz',
            },
        });

        const mailOptions = {
            to: userEmail,
            from: 'servicehub@gmail.com',
            subject: 'Password Reset',
            text: `You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n
            Please click on the following link, or paste this into your browser to complete the process:\n\n
            http://localhost:3000/reset-password?token=${resetToken}\n\n
            If you did not request this, please ignore this email and your password will remain unchanged.\n`,
        };

        transporter.sendMail(mailOptions, (err) => {
            if (err) {
                console.error('Error sending email:', err);
                throw err;
            }
            console.log('Reset email sent successfully');
        });
    });
}

module.exports = {sendVerificationEmail, sendResetEmail}
