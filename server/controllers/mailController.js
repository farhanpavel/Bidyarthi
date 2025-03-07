import prisma from "../db.js";

export const sendMail = async (req, res) => {
  try {
    const fromUserId = req.user.id;
    const { email, subject, message } = req.body;
    console.log(email);

    const fromUser = await prisma.user.findUnique({
      where: {
        id: fromUserId,
      },
    });

    const toUser = await prisma.user.findUnique({
      where: {
        email: email,
      },
    });

    console.log(fromUser, toUser);

    if (!toUser) {
      return res.status(404).json({ message: "User of this email not found" });
    }

    //logic for the mail sending is only from faculty to student or student to faculty
    let mailPermission = false;
    if (fromUser.role === "faculty" && toUser.role === "student")
      mailPermission = true;
    if (fromUser.role === "student" && toUser.role === "faculty")
      mailPermission = true;

    if (!mailPermission) {
      return res
        .status(403)
        .json({ message: "You are not allowed to send mail to this user" });
    } else {
      const mail = await prisma.mail.create({
        data: {
          message: message,
          subject: subject,
          fromUserId: fromUserId,
          toUserId: toUser.id,
        },
      });

      return res
        .status(200)
        .json({ mail: mail, message: "Mail sent successfully" });
    }
  } catch (e) {
    console.log(e);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const getMyMails = async (req, res) => {
  const userId = req.user.id;
  try {
    const mails = await prisma.mail.findMany({
      where: {
        toUserId: userId,
      },
      include: {
        from: true,
      },
    });

    return res.status(200).json(mails);
  } catch (e) {
    return res.status(500).json({ message: "Internal server error" });
  }
};
