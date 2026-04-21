import emailjs from "@emailjs/browser";

export const sendOtpEmail = async ({ email, name, otp }) => {
  const serviceId = process.env.REACT_APP_EMAILJS_SERVICE_ID;
  const templateId = process.env.REACT_APP_EMAILJS_TEMPLATE_ID;
  const publicKey = process.env.REACT_APP_EMAILJS_PUBLIC_KEY;

  if (!serviceId || !templateId || !publicKey) {
    return {
      sent: false,
      reason: "missing-config"
    };
  }

  await emailjs.send(
    serviceId,
    templateId,
    {
      to_email: email,
      to_name: name || "Farmer",
      otp_code: otp
    },
    publicKey
  );

  return {
    sent: true
  };
};
