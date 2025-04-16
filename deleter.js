// Set how many comments you want to delete here!
let DELETION_LIMIT = 1000;  

// Helper function to introduce a random delay between actions
let sleep = (minTime, maxTime) => new Promise(res => setTimeout(res, Math.random() * (maxTime - minTime) + minTime));

// Scrolls to the bottom of the page to load more comments
async function scrollToBottom() {
  window.scrollTo(0, document.body.scrollHeight);  // Scroll to the bottom
  await sleep(2000, 4000);  // Wait for a random time between 2s and 4s to allow comments to load
}

// Main function to delete comments
async function work() {
  // Retrieve the total deleted comments count from localStorage, defaulting to 0
  let totalDeletedComments = parseInt(localStorage.getItem('totalDeletedComments')) || 0;
  console.log(`Total deleted comments so far: ${totalDeletedComments}`);

  let totalLoadedComments = 0;
  let totalComments = 0;

  console.log("# LOADING COMMENTS");
  // Loop to load comments until we reach the deletion limit
  while (totalLoadedComments < DELETION_LIMIT) {
    await scrollToBottom();  // Scroll to load more comments
    
    // Query for all comment delete buttons
    let buttons = [...document.querySelectorAll("c-wiz .GqCJpe.u2cbPc.LDk2Pd .VfPpkd-Bz112c-LgbsSe.yHy1rc.eT1oJ.mN1ivc")];
    totalComments = buttons.length;
    totalLoadedComments = totalComments;  // Update the total loaded comments count

    // If no comments were loaded, break out of the loop
    if (totalComments < 1) break;
  }

  window.scrollTo(0, 0);  // Scroll back to the top after loading comments
  await sleep(1000, 1500);  // Wait for a brief moment before starting deletion

  // Query again to get all the delete buttons (this time for deleting)
  let buttons = [...document.querySelectorAll("c-wiz .GqCJpe.u2cbPc.LDk2Pd .VfPpkd-Bz112c-LgbsSe.yHy1rc.eT1oJ.mN1ivc")];

  let deletionCount = 0;  // Counter to keep track of deleted comments
  console.log("# DELETING COMMENTS");
  // Loop through all the buttons and delete comments
  for (let b of buttons) {
    // Stop if we reach the deletion limit or if no more buttons are available
    if (deletionCount >= DELETION_LIMIT || buttons.length === 0) break;

    b.click();  // Click on the delete button to remove the comment
    deletionCount++;  // Increment the deletion counter
    totalDeletedComments++;  // Increment the total deleted comments
    localStorage.setItem('totalDeletedComments', totalDeletedComments);  // Update the localStorage

    // Log every 250 deletions to show progress
    if (deletionCount % 250 === 0) {
      console.log(`Total deleted comments so far: ${totalDeletedComments}`);
    }

    // Wait for a brief moment before clicking the next button to avoid overloading the system
    await sleep(100, 200);
  }

  console.log(`Total deleted comments in this batch: ${totalDeletedComments}`);
  
  return totalDeletedComments;  // Return the total deleted comments after this batch
}

// Function to run the entire process
async function run() {
  let totalDeletedComments = 0;
  // Keep running until the totalDeletedComments reaches the DELETION_LIMIT
  while (totalDeletedComments < DELETION_LIMIT) {
    totalDeletedComments = await work();  // Call work() to load and delete comments
    if (totalDeletedComments >= DELETION_LIMIT) {
      break;  // If the deletion limit is reached, stop the loop
    }
    await sleep(150, 500);  // Wait a random time before the next batch
  }

  console.log(`${DELETION_LIMIT} comments deleted, stopped the execution.`);  // Log when the deletion limit is reached
  console.log("Leave this Tab open for a while till you don't see any notifications from Youtube in the lower left corner about successful deletions anymore!");
}

// Start the script execution
run();
