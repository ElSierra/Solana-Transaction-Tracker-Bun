import { createNotificationInTable } from "./createNotificationInTable";
import { sendUserNotification } from "./sendUserNotification";

export const notificationBuilder = ({
  wallet,
  amount,
  transferOut,
  userId,
  date,
  walletId,
}: {
  wallet: string;
  amount: number;
  userId: string;
  transferOut: boolean;
  date: Date;
  walletId: string;
}) => {
  const LAMPORTS_PER_SOL = 1_000_000_000;
  const sol = amount / LAMPORTS_PER_SOL;
  if (transferOut) {
    console.log(`You have sent ${amount} to ${wallet}`);
    sendUserNotification(
      userId,
      {
        header: `${sol} SOL Sent`,
        content: `You have sent ${sol} SOL to ${wallet}`,
      },
      true
    );
    createNotificationInTable(
      `${sol} SOL Sent`,
      `You have sent ${sol} SOL to ${wallet}`,
      userId,
      true,
      date,
      walletId
    )
      .then((res) => {
        console.log(res);
      })
      .catch((err) => {
        console.log(err);
      });
  } else {
    console.log(`You have received ${amount} from ${wallet}`);
    sendUserNotification(
      userId,
      {
        header: `${sol} SOL Received`,
        content: `You have received ${sol} SOL from ${wallet}`,
      },
      false
    );
    createNotificationInTable(
      `${sol} SOL Received`,
      `You have received ${sol} SOL from ${wallet}`,
      userId,
      false,
      date,
      walletId
    )
      .then((res) => {
        console.log(res);
      })
      .catch((err) => {
        console.log(err);
      });
  }
};
