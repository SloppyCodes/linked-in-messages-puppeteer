# Delete or archive LinkedIn messages in bulk

**This script was made because currently LinkedIn is not providing a bulk message deletion or archiving option.**

Requirements:
- Nodejs version > 10.16
- Google Chrome
- Tobe logged into your LinkedIn account on the Google Chrome browser
- 3 minutes to set the script up

## Before running the script:
In order to run the script, you will need to replace the values of 2 constants located in the `inquirer.js` file.

Namely: `CHROME_EXECUTABLE_PATH` and `USER_DATA_DIR`.

To obtain these values you need to perform the following actions:

1. Open Google Chrome, paste the following in the address bar, and hit enter
   
   `chrome://version`
2. Copy the following information:
   
    `Executable Path` into the `CHROME_EXECUTABLE_PATH` constant.
   
    `Profile Path` into the `USER_DATA_DIR` constant.

## Running the script:
To run the script simply navigate into the cloned folder and run the following commands:

1. `npm install` - this command needs to be executed only once (on the 1st run).

2. `npm run start`

**That's it!**

Sit back, relax and let the script handle the messages for you.

**There is a 2 seconds delay between the message deletions** - you can change, or remove it but with this delay, you can be sure that the LinkedIn server handled correctly all of your requests.
