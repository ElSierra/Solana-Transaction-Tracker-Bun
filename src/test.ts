import * as OneSignal from "@onesignal/node-onesignal";
import axios from "axios";
import * as dotenv from "dotenv";
import knex from "../db/knex";
console.log(
  process.env.ONE_SIGNAL_KEY,
  process.env.ONE_SIGNAL_USER_AUTH_KEY,
  process.env.ONE_SIGNAL_APP_ID
);

// const configuration = OneSignal.createConfiguration({
//  authMethods:{
//     rest_api_key: {
//         tokenProvider:{
//             getToken: async () => {
//                 return process.env.ONE_SIGNAL_KEY as string;
//             }
//         }
//     }
//  }
// });

// const client = new OneSignal.DefaultApi(configuration);

// const notification = new OneSignal.Notification();

// notification.app_id = process.env.ONE_SIGNAL_APP_ID  as string;
// //notification.small_icon="sent_icon",
// notification.android_channel_id="5cb42037-721c-4476-a9fd-d29352d32713",
// notification.android_accent_color="FF0000",
// notification.headings = { en: "SOL Sent" };
// notification.include_aliases = {external_ids: ["1ffb662c-6dc7-4776-b86f-5f3c3344205d"]};

// notification.contents = { en: "200 SOL Was sent to you" };

// client.createNotification(notification).then((response) => {
//     console.log(response.id);
//     }
// ).catch((error) => {

//     console.error(error);
// }
// )

// const sendRestaurant = axios.post(
//   "https://onesignal.com/api/v1/notifications",
//   {
//     app_id: process.env.ONE_SIGNAL_APP_ID,
//     headings: {
//       en: "⏰ Check in ",
//     },
//     contents: {
//       en: "Don't forget to check in today",
//     },
//     android_accent_color: "FF0000",
//     android_channel_id: "5cb42037-721c-4476-a9fd-d29352d32713",
//     include_external_user_ids: ["1ffb662c-6dc7-4776-b86f-5f3c3344205d"],
//   },
//   {
//     headers: {
//       "Content-Type": "application/json",
//       Authorization: `Basic ${process.env.ONE_SIGNAL_KEY}`,
//     },
//   }
// );

// sendRestaurant
//   .then((response) => {
//     console.log(response.data);
//   })
//   .catch((error) => {
//     console.error(error);
//   });

knex
  .table("wallets")
  .columnInfo()
  .then((data) => {
    console.log(data);
  })
  .catch((error) => {
    console.error(error);
  });
