// Visit https://www.youtube.com/feed/history/comment_history and paste this script into the Google Chrome Dev console and execute it. 

let DELETION_LIMIT = 1000;  // Set how many comments you want to delete here!

let sleep = (minTime, maxTime) => new Promise(res => setTimeout(res, Math.random() * (maxTime - minTime) + minTime));
async function scrollToBottom() {
  window.scrollTo(0, document.body.scrollHeight);
  await sleep(2000, 4000);
}

async function work() {
  let totalDeletedComments = parseInt(localStorage.getItem('totalDeletedComments')) || 0;
  console.log(`Total deleted comments so far: ${totalDeletedComments}`);

  let totalLoadedComments = 0;
  let totalComments = 0;

  console.log("# LOADING COMMENTS");
  while (totalLoadedComments < DELETION_LIMIT) {
    await scrollToBottom();
    
    let buttons = [...document.querySelectorAll("c-wiz .GqCJpe.u2cbPc.LDk2Pd .VfPpkd-Bz112c-LgbsSe.yHy1rc.eT1oJ.mN1ivc")];
    totalComments = buttons.length;
    totalLoadedComments = totalComments;  

    if (totalComments < 1) break;  // Stop if no more comments are loaded
  }

  window.scrollTo(0, 0);  // Scroll back to the top
  await sleep(1000, 1500);
  let buttons = [...document.querySelectorAll("c-wiz .GqCJpe.u2cbPc.LDk2Pd .VfPpkd-Bz112c-LgbsSe.yHy1rc.eT1oJ.mN1ivc")];
 
  let deletionCount = 0;
  console.log("# DELETING COMMENTS");
  for (let b of buttons) {
    if (deletionCount >= DELETION_LIMIT || buttons.length === 0) break;

    b.click();
    deletionCount++;
    totalDeletedComments++;
    localStorage.setItem('totalDeletedComments', totalDeletedComments);

    if (deletionCount % 500 === 0) {
      console.log(`Total deleted comments so far: ${totalDeletedComments}`);
    }
    await sleep(100, 200);
  }
  console.log(`Total deleted comments in this batch: ${totalDeletedComments}`);
  
  return totalDeletedComments;
}

async function run() {
  let totalDeletedComments = 0;
  while (totalDeletedComments < DELETION_LIMIT) {
    totalDeletedComments = await work();
    if (totalDeletedComments >= DELETION_LIMIT) {
      break;
    }
    await sleep(150, 500);
  }
  console.log(`${DELETION_LIMIT} comments deleted, stopped the execution.`);
  console.log("Leave this Tab open for a while till you don't see any notifications from Youtube in the lower left corner about successful deletions anymore!");
}

run();
