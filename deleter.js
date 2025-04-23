let DELETION_LIMIT = 1000;  // Set how many comments you want to delete here!

let LOG_INTERVAL = Math.floor(DELETION_LIMIT / 4);
let sleep = (minTime, maxTime) =>
  new Promise(res => setTimeout(res, Math.random() * (maxTime - minTime) + minTime));

async function scrollToBottom() {
  window.scrollTo(0, document.body.scrollHeight);
  await sleep(2000, 3000);
}

console.log("# GETTING READY TO BLAST YOUR COMMENTS");

async function getDeleteButtons() {
  return [
    ...document.querySelectorAll(
      "c-wiz .GqCJpe.u2cbPc.LDk2Pd .VfPpkd-Bz112c-LgbsSe.yHy1rc.eT1oJ.mN1ivc"
    ),
  ];
}

async function deleteBatch(sessionDeletedCount, totalDeletedComments) {
  let buttons = await getDeleteButtons();

  if (buttons.length === 0) return { sessionDeletedCount, totalDeletedComments, didDelete: false };

  for (let i = 0; i < buttons.length; i++) {
    if (sessionDeletedCount >= DELETION_LIMIT) break;

    buttons[i].click();
    sessionDeletedCount++;
    totalDeletedComments++;
    localStorage.setItem("totalDeletedComments", totalDeletedComments);

    if (sessionDeletedCount % LOG_INTERVAL === 0) {
      console.log(`Total deleted comments so far: ${totalDeletedComments}`);
    }

    await sleep(100, 200);
  }

  return { sessionDeletedCount, totalDeletedComments, didDelete: true };
}

async function run() {
  let sessionDeletedCount = 0;
  let totalDeletedComments = parseInt(localStorage.getItem('totalDeletedComments')) || 0;

  console.log(`Total deleted comments so far (including previous runs): ${totalDeletedComments}`);

  let loopsWithoutDeletes = 0;

  while (sessionDeletedCount < DELETION_LIMIT) {
    await scrollToBottom();

    let { sessionDeletedCount: newCount, totalDeletedComments: newTotal, didDelete } =
      await deleteBatch(sessionDeletedCount, totalDeletedComments);

    if (!didDelete) {
      loopsWithoutDeletes++;
    } else {
      loopsWithoutDeletes = 0;
    }

    sessionDeletedCount = newCount;
    totalDeletedComments = newTotal;

    if (loopsWithoutDeletes >= 3) {
      console.log("No more deletable comments found after multiple attempts.");
      break;
    }

    await sleep(500, 1000);
  }

  console.log(`${sessionDeletedCount} comments deleted. Done.`);
  console.log("Leave this tab open until YouTube finishes confirming deletion.");
}

run();
