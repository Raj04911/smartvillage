import emailjs from "@emailjs/browser";

export const sendOtpEmail = async ({ email, name, otp }) => {
  const serviceId =
    process.env.REACT_APP_EMAILJS_SERVICE_ID || "service_8zd9m0p";
  const templateId =
    process.env.REACT_APP_EMAILJS_TEMPLATE_ID || "template_je5g0df";
  const publicKey =
    process.env.REACT_APP_EMAILJS_PUBLIC_KEY || "rbs-LjFvOElLQhTFf";

  if (!serviceId || !templateId || !publicKey) {
    return {
      sent: false,
      reason: "missing-config"
    };
  }

  try {
    const response = await emailjs.send(
      serviceId,
      templateId,
      {
        email,
        name: name || "Smart Dashboard User",
        passcode: otp,
        time: "10 minutes"
      },
      publicKey
    );

    return {
      sent: true,
      response
    };
  } catch (error) {
    return {
      sent: false,
      reason: error?.text || error?.message || "emailjs-send-failed"
    };
  }
};
