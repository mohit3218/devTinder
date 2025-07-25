const { SendEmailCommand } = require("@aws-sdk/client-ses");
const { sesClient } = require("./sesClient");

const createSendEmailCommand = (
  toAddress,
  fromAddress,
  subject,
  body,
  toEmailId
) => {
  return new SendEmailCommand({
    Destination: {
      CcAddresses: [],
      ToAddresses: [toAddress],
    },
    Message: {
      Body: {
        Html: {
          Charset: "UTF-8",
          Data: `<h1>${body}`,
        },
        Text: {
          Charset: "UTF-8",
          Data: `This is the text format email`,
        },
      },
      Subject: {
        Charset: "UTF-8",
        Data: subject,
      },
    },
    Source: fromAddress,
    ReplyToAddresses: [],
  });
};

const run = async (subject, body, toEmailId) => {
  const sendEmailCommand = createSendEmailCommand(
    "mohitldh1992@gmail.com", //recipient
    "mohitldh1992@gmail.com", //sender
    subject,
    body,
    toEmailId
  );

  try {
    return await sesClient.send(sendEmailCommand);
  } catch (caught) {
    if (caught instanceof Error && caught.name === "MessageRejected") {
      const messageRejectedError = caught;
      return messageRejectedError;
    }
    throw caught;
  }
};

module.export = run;
