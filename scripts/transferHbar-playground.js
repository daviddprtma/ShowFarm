import { Client, AccountId, PrivateKey, TransferTransaction, Hbar, AccountBalanceQuery } from "@hashgraph/sdk";

// Hard-coded credentials for Hedera Playground (do not commit to GitHub)
const operatorId = AccountId.fromString("0.0.7147874");
const operatorKey = PrivateKey.fromString("3030020100300706052b8104000a042204206b839d82e15ffe64fcdd64e7e2badc735fe6e7286f2938beabaf9e6347b60102");

const client = Client.forTestnet().setOperator(operatorId, operatorKey);

async function main() {
  // Use your own account ID as the recipient for a test transfer
  const RECEIVER_ID = AccountId.fromString("0.0.7147874");

  // Query and print the operator's account balance before transfer
  const balanceBefore = await new AccountBalanceQuery()
    .setAccountId(operatorId)
    .execute(client);
  console.log("Balance before transfer:", balanceBefore.hbars.toString());

  const tx = await new TransferTransaction()
    .addHbarTransfer(operatorId, new Hbar(-1))
    .addHbarTransfer(RECEIVER_ID, new Hbar(1))
    .execute(client);

  const receipt = await tx.getReceipt(client);
  console.log("Transaction status:", receipt.status.toString());

  // Query and print the operator's account balance after transfer
  const balanceAfter = await new AccountBalanceQuery()
    .setAccountId(operatorId)
    .execute(client);
  console.log("Balance after transfer:", balanceAfter.hbars.toString());
}

main();
