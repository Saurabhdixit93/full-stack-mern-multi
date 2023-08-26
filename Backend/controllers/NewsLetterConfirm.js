const { mailTransporter } = require("../utils/Nodemailer");
// news letter
const subscribeNews = async (req, res, next) => {
  try {
    const { email } = req.body;
    const subject = "Thanks for subscribing to our newsletter";
    const html = `
    <html>
        <head>
        <style>
            body {
            font-family: Arial, sans-serif;
            }
            .container {
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
            background-color: #f4f4f4;
            }
            .header {
            background-color: #3498db;
            color: white;
            padding: 10px;
            text-align: center;
            }
            .content {
            padding: 20px;
            background-color: white;
            }
            .footer {
            background-color: #333;
            color: white;
            padding: 10px;
            text-align: center;
            }
        </style>
        </head>
        <body>
        <div class="container">
            <div class="header">
            <h1>Thank You for Subscribing!</h1>
            </div>
            <div class="content">
            <p>Dear ${email},</p>
            <p>Thank you for subscribing to our newsletter. We're excited to have you on board!</p>
            <p>Stay tuned for the latest updates, news, and special offers.</p>
            <p>Best regards,</p>
            <p>Saurabh Dixit</p>
            </div>
            <div class="footer">
            <p>&copy; ${new Date().getFullYear()} Saurabh Dixit. All rights reserved.</p>
            </div>
        </div>
        </body>
    </html>
    `;
    const mailOptions = {
      from: process.env.MAIL_FROM,
      to: email,
      subject: subject,
      html: html,
    };
    await mailTransporter.sendMail(mailOptions);
    return res.json({
      success: true,
      message: "Thank You for Subscribing!",
    });
  } catch (error) {
    return res.json({
      success: false,
      message: "Internal Server Error !",
    });
  }
};

module.exports = { subscribeNews: subscribeNews };
