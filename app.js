const nodemailer = require('nodemailer');
const express = require('express');
const app = express();

app.set('view engine', 'ejs');

app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  res.render('index', { status: "send" });
});

app.post('/', async (req, res) => {

  let testAccount = await nodemailer.createTestAccount();

  let transporter = nodemailer.createTransport({
    host: "smtp.ethereal.email",
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: testAccount.user, // generated ethereal user
      pass: testAccount.pass, // generated ethereal password
    },
  });

  let mailOptions = {
    from: 'foo@gmail.com', // change to your email
    to: req.body.to,
    subject: req.body.subject,
    text: req.body.text
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      res.render('index', { status: 'error' });
    } else {
      res.render('index', { status: 'success' });
    }
  });
});

app.listen(3000, () => console.log('Server started...'));