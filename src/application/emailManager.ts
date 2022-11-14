import nodemailer from "nodemailer";

export const emailManager = {
  async sendEmail(registratedUser: any) {
    // console.log(registratedUser, "registratedUser");

    try {
      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: process.env.USER_EMAIL!, // generated ethereal user
          pass: process.env.USER_PASSWORD!, // generated ethereal password
        },
      });

      // send mail with defined transport object
      const info = await transporter.sendMail({
        from: '"Fred Foo 👻" <foo@example.com>', // sender address
        to: registratedUser.accountData.email, // list of receivers
        subject: "registration", // Subject line
        html: `<a href="http://localhost:5001/auth/registration-confirmation?code=${registratedUser.emailConfirmation.confirmCode}">Click</a>`, // html body
      });
      // console.log("info", info);
      return true;
    } catch (error) {
      console.log(error);
      return false;
    }
  },
};
