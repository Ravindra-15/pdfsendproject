const nodemailer = require("nodemailer");
const path = require("path");

// map each role to its corresponding pdf file
const pdfMap = {
  student: "student.pdf",
  working_professional: "working_professional.pdf",
  teacher: "teacher.pdf",
};

// nodemailer transporter using gmail credentials
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const sendEmailWithPDF = async ({ name, email, role }) => {
  // get correct pdf filename based on user role
  const pdfFileName = pdfMap[role];

  // build absolute path to pdf file
  const pdfPath = path.join(__dirname, "../pdfs", pdfFileName);

  const mailOptions = {
    from: `"Vikas Team" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: "Your PDF is here! 🎉",
    // email body text
    html: `
      <h2>Hello ${name}!</h2>
      <p>Thank you for your payment of ₹39.</p>
      <p>Please find your PDF attached below as per your selected role <strong>${role}</strong>.</p>
      <br/>
      <p>Regards,<br/>Vikas Team</p>
    `,
    // attach the correct pdf to the email
    attachments: [
      {
        filename: pdfFileName,
        path: pdfPath,
      },
    ],
  };

  // send the email
  await transporter.sendMail(mailOptions);
};

module.exports = { sendEmailWithPDF };