const cron = require("node-cron");
const { subDays, startOfDay, endOfDay } = require("date-fns");
const sendEMail = require("./sendEmail");
const ConnectionRequestModel = require("../models/connectionRequest");

cron.schedule("0 8 * * * *", async () => {
  //Send emails to all people to who got requests teh previous day
  try {
    const yesterday = subDays(new Date(), 1);
    const yesterdayStart = startOfDay(yesterday);
    const yesterdayEnd = endOfDay(yesterday);

    const pendingRequests = ConnectionRequestModel.find({
      status: "interested",
      createdAt: {
        $gte: yesterdayStart,
        $lt: yesterdayEnd,
      },
    }).populate("fromUserId toUserId");

    console.log("pendingRequests ", pendingRequests);

    const listOfEMails = [
      ...new Set(pendingRequests.map((req) => req.toUserId.emailId)),
    ];

    for (const email of listOfEMails) {
      //Send E-mails
      try {
        const res = await sendEMail.run(
          "New Friend Requests pending for " + email,
          "There are so many friend requests pending, please login to the DevTinder app and accept or reject request."
        );
      } catch (err) {
        console.log(`Error send email : ${err}`);
      }
    }
  } catch (err) {
    console.log(`Error Cron Job: ${err}`);
  }
  console.log("Hello World, " + new Date());
});
