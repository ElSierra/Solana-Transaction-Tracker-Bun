import axios from "axios";

export const sendUserNotification = async (
  userId: string,
  message: {
    header: string;
    content: string;
  },
  sentOut?: boolean
) => {
  const res = await axios.post(
    "https://onesignal.com/api/v1/notifications",
    {
      app_id: process.env.ONE_SIGNAL_APP_ID,
      headings: {
        en: message.header,
      },
      contents: {
        en: message.content,
      },
      android_accent_color: "FF0000",
      small_icon: sentOut
        ? "sent_icon"
        : sentOut === false
        ? "receive_icon"
        : "",
      android_channel_id: "5cb42037-721c-4476-a9fd-d29352d32713",
      include_external_user_ids: [userId],
    },
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Basic ${process.env.ONE_SIGNAL_KEY}`,
      },
    }
  );

  return res.data.id;
};
