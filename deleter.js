// Visit https://www.youtube.com/feed/history/comment_history and paste this into the Chrome DevTools Console

let DELETION_LIMIT = 500;  // Set how many comments you want to delete here!

let LOG_INTERVAL = Math.floor(DELETION_LIMIT / 4);  // Log progress every 25%
let sleep = (minTime, maxTime) =>
  new Promise(res => setTimeout(res, Math.random() * (maxTime - minTime) + minTime));

async function scrollToBottom() {
  window.scrollTo(0, document.body.scrollHeight);
  await sleep(2000, 4000);
}

async function work(sessionDeletedCount) {
  let totalDeletedComments = parseInt(localStorage.getItem('totalDeletedComments')) || 0;
  console.log(`Total deleted comments so far (including previous runs): ${totalDeletedComments}`);

  let totalLoadedComments = 0;
  let totalComments = 0;

  console.log("# LOADING COMMENTS");
  while (totalLoadedComments < Math.min(DELETION_LIMIT - sessionDeletedCount, 500)) {
    await scrollToBottom();

    let buttons = document.querySelectorAll(
      "c-wiz .GqCJpe.u2cbPc.LDk2Pd .VfPpkd-Bz112c-LgbsSe.yHy1rc.eT1oJ.mN1ivc"
    );
    totalComments = buttons.length;
    totalLoadedComments = totalComments;
    if (totalComments < 1) break;
  }

  window.scrollTo(0, 0);
  await sleep(1000, 1500);

  // Only query buttons ONCE for deletion
  let buttons = [
    ...document.querySelectorAll(
      "c-wiz .GqCJpe.u2cbPc.LDk2Pd .VfPpkd-Bz112c-LgbsSe.yHy1rc.eT1oJ.mN1ivc"
    ),
  ];

  let batchDeleted = 0;
  for (let i = 0; i < buttons.length; i++) {
    if (sessionDeletedCount >= DELETION_LIMIT) break;

    buttons[i].click();
    batchDeleted++;
    sessionDeletedCount++;
    totalDeletedComments++;

    localStorage.setItem("totalDeletedComments", totalDeletedComments);

    if (sessionDeletedCount % LOG_INTERVAL === 0) {
      console.log(`Total deleted comments so far: ${totalDeletedComments}`);
    }

    await sleep(100, 200);
  }

  console.log(`Total deleted comments in this batch: ${batchDeleted}`);
  return sessionDeletedCount;
}

async function run() {
  let sessionDeletedCount = 0;

  while (sessionDeletedCount < DELETION_LIMIT) {
    sessionDeletedCount = await work(sessionDeletedCount);

    if (sessionDeletedCount >= DELETION_LIMIT) {
      break;
    }

    await sleep(150, 500);
  }

  console.log(`${DELETION_LIMIT} comments deleted, stopped the execution.`);
  console.log("Leave this tab open until YouTube finishes confirming deletion (look for messages in the lower left corner).");
}

run();
