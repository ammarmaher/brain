*** Canonical PRD text - Basic Send Application V5 ***
*** Extracted 2026-07-06 from C:\Users\User\Downloads\lab dirver\Basic Send Application-V5.docx (stdlib docx->md; no images present in source) ***
*** Line anchors cited across this module (BR-BSA-*, Q-BSA-*) refer to THIS file's line numbers +2 header lines; original agent anchors were to the raw extraction ***


# Falcon Basic Send Application (BSA)
The Basic Send Application is a foundational, lightweight utility within the Falcon platform that allows users to dispatch WhatsApp messages and Voice (IVR) broadcasts to targeted recipient lists either from the UI interface or from the APIs.
The Basic Send Application provides a streamlined workflow for template selection, dynamic variable mapping from the selected contact group, and cost estimation prior to dispatch. By giving users granular control over duplicate handling. This app maximizes delivery success while strictly adhering to the tenant's predefined financial and operational constraints.

# BSA (Assumptions and Conditions)
- The Account Owner & Falcon Usertype are only allowed to purchase and activate applications from the marketplace.
- Once this application is activated and purchased, it is allowed to be used by all Normal Users in that account (in all levels), unless a permission group is assigned to that user and overrides this default role permission.
- If there is any commchannel under that account that was not enabled; its SEND button will be disabled inside the BSA, and the user can see only the outbox and scheduled sub-tabs, he can not do transactions.
- If the commchannel was disabled for any reason (manually disabled, grace period finished, …) the scheduled transactions once their due date came will be failed, and a failed reason will be identified.
- Using the application to send transactions does not care about the Wallet and Balance configurations, it will follow the balance strategy used and comply with it.
- There is no balance failover facility in this application and in all applications in future, if the final wallet/bucket does not have balance, the transaction will be aborted.
- There is no failover between commchannels in this application, the user either uses it to send Whatsapp messages or Voice call messages.
- For both Whatsapp and Voice messages; the user can send to a pre-detained and approved templates only, even the body type was set for free for the Voice commchannel.
- The normal user can select the templates and contact groups which are created by him, or shared with him. And the shared templates and contact groups are created by other users inside the account/ tenant.

# Application Purchase, Activation, and Navigation
- The Basic Send Application is a Marketplace application that can be purchased only from the Marketplace & Applications.Mng main menu by the Account Owner or a Falcon UserType with the required permissions.
- Once the purchase is completed successfully, the application status becomes Active immediately, and no additional activation or configuration steps are required.
- After activation, the system automatically creates a new submenu item named Basic Send Application under the Marketplace & Applications.Mng main menu.
- The application can be accessed from two locations:
- Marketplace & Applications.Mng
- Marketplace & Applications.Mng → Basic Send Application, which provides direct access to the application's functionality.
- Both navigation paths open the same application instance and display the same data and functionality.

# BSA Behavior Based on WhatsApp/ Voice Communication Channel Status
The Basic Send Application depends on the availability of the selected WhatsApp/ Voice Communication Channel. The application itself remains Active regardless of the Communication Channel status; however, the functionality available to the user depends on the status of the selected Communication Channel.
- If the selected WhatsApp/ Voice Communication Channel is Active, all related BSA functionalities are available.
- If the selected WhatsApp/ Voice Communication Channel becomes Expired, Disabled or enters any status that prevents message/call sending:
- The corresponding Send button (Send WhatsApp Message / Send Voice IVR Message) shall be disabled.
- Users can continue accessing the Outbox, Scheduled, transaction details, statistics, reports, and other historical data related to that Communication Channel.
- Users cannot create new transactions using the affected Communication Channel.
- Any scheduled transactions that reach their execution time while the Communication Channel is unavailable shall fail automatically, and the transaction failure reason shall indicate that the selected Communication Channel is not active.
- Once the Communication Channel becomes Active again, users can immediately create new transactions. Previously failed scheduled transactions are not retried automatically and must be recreated or rescheduled by the user.
- If both the WhatsApp and Voice Communication Channels are not active, the Basic Send Application remains Active and accessible in read-only mode. Users can view and export historical transactions and statistics, but all sending operations are disabled until at least one Communication Channel becomes Active.

# BSA Features, Functionalities, and Pages
Once the normal user selects the activated BSA from the marketplace; the application landing page will be the detailed page for the Whatsapp tab and there is another almost similar page for the Voice tab.

## Whatsapp Tab
Inside this Whatsapp tab there are multiple tabs (Outbox and Scheduled) in addition to the “Send Whatsapp Message” button.

### Send Whatsapp Message button
When an authorized user clicks the “Send WhatsApp Message” button, a screen opens three sections (Message details, Recipients and preview). The interface enforces the following configurations for each section:
- Message Details
- Select WhatsApp Sender ID: This field represents the resource of the message. Also it represents the verified phone number linked to the client's Meta Business account. By default; a Normal User can select any Sender ID attached to the tenant, unless restricted by an overriding Permission Group.
- Select WhatsApp Template: Users are restricted to selecting a single, pre-approved template that they created or that was shared within their tenant. The UI must enforce a 3-tier selection hierarchy:
- Whatsapp template Category/ service type (Marketing, Utility, and Authentication) → Language → Template Name.
- The selected template variables will be viewed under the Variables field to be more clear to user to know the variables then map them
We suggest to have a backend call to sync the selected template with Meta, requesting the Meta to share the current status of that template, and the current body for that template -in case the template status or body changed and not updated in Falcon via webhook- this sync will update the template on templates pages also.
- Select the sending time: The user can select the sending time for that transaction, either send the transaction now (immediately) or schedule it in future (set date and time).
In case the template status was changed to anything not Approved/Active, the system will indicate to the user that he has to select another template.
- Add Recipients:
This section represents the destination of the message. The user can add recipients using one of the following methods:
- Select Contact Groups
- The user can select one or multiple contact groups as recipients.
- The selected contact groups can be:
- Created by the same user.
- Shared with the user.
- For each selected contact group, the user must:
- Identify the destination column that contains the recipients’ destination for example mobile numbers.
- Map the contact group fields/columns with the template variables before selecting another contact group, “add contact group” button will remain disabled if the contact group columns are not mapped with the template variables.
- Add Manual Recipients:
- The user can enter a direct/manual “destination” for example “phone number” in the recipient field.
- A maximum of 3 manual recipients is allowed.
- For each manually added recipient, the user must:
- Enter values for all related template variables.
- “Add recipient” button will remain disabled until the user fills in the variable.
- The manually entered template variable values should:
- Be displayed to the user.
- Be editable by the user.
- Variable Schema Mapping: For each contact group added, the interface must render a 1:1 schema mapping grid, forcing the user to map every required variable inside the WhatsApp template to a specific data column header within that contact group sheet.
- Message Preview: The user can see a message preview for the current transaction he is building which contains variable replacements by the values related to the first recipient in the first selected contact group.
Before final submission when the user clicks on “send” button , the system displays a confirmation summary overlay presenting:
- A duplicate handling checkbox: “Allow duplicate recipients”.
- A transaction cost estimation calculated programmatically based on target recipient's destination, template category type, total recipient count, and active contract details
Once the user confirms these points, the transaction will be processed (if the sending time was now), or saved to be processed in future (if the sending time was later). In both cases the balance deduction will be done on sending time for the transactions, which means there is no reservation for balance at the transaction creation time for the future transactions.

#### Send Logic
Upon immediate execution or when a scheduled date matures, the backend processing engine takes over using the following sequential rules:
- The system does not make any reservation for balance at the transaction creation time, it starts deducting balance at the execution time and once it starts processing the records/patches of that transaction.
- The system should make sure that there is enough balance for the current record/batch under processing. We will deduct the balance as the first step of processing the record/batch, and then refund in case of any internal failures preventing this record/batch from being processed successfully. This will be applied regardless of the balance strategy (User Based or NodeBased, Single Wallet or Multiple Wallets).
- The system must process the manually entered recipients first, then the other contact groups based on their added order in the compose process.
- The system will do variable replacements with the actual data for each recipient right before dispatching the payload to Meta or Voice providers. (this will represent the Send date for each recipient).
- If the user does not allow for duplicate sending, the internal logic will remove the duplicated numbers, keep and process the first one only.
- When it comes to charging; for each record/bulk we do a reservation from the balance to the needed amount for that record/bulk, and commit in success or return in case of filed (and based on charging controls). So anytime we decide to process a record/bulk we do a reservation then proceed, if there is not enough balance we abort the process for that record/bulk.

#### Transaction statuses
- If the system decides to abort the transaction due to insufficient balance right before processing any record; the transaction status will be “Failed”.
- If the system decides to partially process the transaction due to insufficient balance the transaction status will be “Partially processed”.
- If the system successfully processes the whole transaction records, the status will be “Completed”.
- During the process of the transaction its status will be “In Progress” and the total recipient count and total transaction cost columns will be updated during the time.
- During the process of the transaction the user can “Cancel” this transaction, and its status will be “Canceled”. The system will stop processing the next patch and update the records accordingly.
There should be a confirmation message shown to the user about the cancelation action, and indicate if the cancelation action took place while the transaction is still in progress, or the system already finished the whole transaction and processed all recipients in it.
- If the user decided to Delete -from the scheduled tab- the scheduled transaction which their due date has not come yet, the system will ignore this transaction, and its status will be “Deleted”.
- All transactions whose due date has not come yet will be viewed and listed in the scheduled tab, and their status will be “Scheduled” unless they were deleted and mentioned before.
Anytime the system decides to abort the transaction with status “Failed” or change its status to “Partially processed”, details will be added in the transaction detailed page to give the user indication and reason for these statuses.

### WhatsApp Outbox Tab
This tab contains a grid view for all transactions sent by the logged in user (the transactions whose execution time is satisfied regardless if they are already processed or are processing now).
This tab contains the following columns:
- Transaction ID: Unique identifier for the transaction, auto generated by the system.
- Sender ID: The whatsapp phone number used as sender when this transaction was sent.
- Template name: The name for the selected and used whatsapp template.
- Template language: The language for the selected and used whatsapp template.
- Template type: The type for the selected and used whatsapp template.
- Creation date: The datetime when this transaction has been created/ submitted.
- Total recipient count: Total number of the recipients in all CGs including the manually added recipients.
- Total transaction cost: The total cost for all sent messages to all recipients in the transaction.
- Recipients: Contact groups names, in addition to the added manually recipients.
- Status: (In Progress, Canceled, Partially Processed, Failed, Completed)
- Actions: 3dots contains:
- “Details” button which opens a transaction detailed page (will be clarified below).
- “Cancel” button which cancels and aborts the sending/ processing logic, and stops processing the next batch regardless of the remaining or processed recipients. And update the fields accordingly (status, count, cost, …).
Cancellation Rule: If a user triggers a Cancel command on an In Progress transaction via the 3-dot action menu, the engine terminates processing at the next immediate batch edge.
- Confirmation Dialog: The system must intercept the cancellation request with a confirmation dialog that dynamically displays the thread state. It must clarify:
- The transaction's current processing status.
- Whether the cancellation successfully intercepted the transaction mid-flight (leaving unsent records uncharged).
- Whether the backend completed processing all records before the cancel thread completed execution.
Post-Cancellation System Updates: Upon successful cancellation, the system will:
- Update the transaction's Status to 'Canceled'.
- Adjust the Total Recipient Count to reflect only those recipients for whom messages were successfully sent before the cancellation.
- Recalculate the Total Transaction Cost based solely on these successfully sent messages.
- Exclude recipients whose messages were not processed from both the count and the cost.

#### Outbox Detailed View Page
Each transaction in the outbox tab has a details page, it could be reached by clicking on the “Details” option in the 3dots in the actions column.
Once the user enters the details page for any outbox transaction, he will see a full details about this transaction, including:
- Transaction ID, Sender ID, used Whatsapp Template name, used whatsapp Template language, used Template type, Creation date for this transaction, Total recipient count in this transaction, Total transaction cost for this transaction, Recipients, Transaction Status, in addition to the following:
- Some statistics and readings about this transaction.
Suggested Statistics for WhatsApp Outbox Detailed View:
- Delivered Rate: Percentage of messages successfully delivered to recipients.
- Read Rate: Percentage of delivered messages that have been read by recipients.
- Played Rate (for voice notes): Percentage of voice notes that have been played by recipients.
- Seen Rate (for media messages): Percentage of media messages that have been seen by recipients.
- Failed Rate: Percentage of messages that failed to send or deliver.
- Reply Rate: Percentage of recipients who replied to the message.
- Average Delivery Time: The average time taken for messages to be delivered after sending.
- Cost Breakdown:
A breakdown of costs by template type and recipient destination.
Cost of messages sent
Average cost per message
- Recipients details grid that contains all recipients as mobile numbers listed in a table one by one followed by the following details per each recipient:
- Recipient mobile number.
- Whatsapp message status for this mobile number: the status for this message as per Meta:
- Pending: we did not submit it yet to Meta, still in our system.
- Sent: we have replaced the variables, submitted it to Meta for this recipient, and this is the submission date
- Delivered: Meta returns the status delivered with the delivery date once they hand the message to the recipient.
- Read: The recipient has opened and read the WhatsApp text message. The read date and time are recorded.
- Played: The recipient has played the voice note or audio message. The played date and time are recorded..
- Seen: The recipient has viewed the media message (such as image, video, or document). The seen date and time are recorded
- Send Date: The exact timestamp when the Falcon system successfully submitted the message payload to Meta for the specific recipient.
- Delivery Date: The timestamp returned by Meta indicating when the message was successfully handed over to the recipient's device. This field remains empty until a "Delivered" status is received.
- Status Date: The timestamp of the most recent status update received for the message (e.g., the time it was Read, Played, or Seen). This date dynamically updates as the recipient interacts with the message.
- Message cost: contains the cost for the basic message sent in this transaction, it does not include any costs for replies later.
- Has a reply indication: to indicate if there is any reply message from the recipient to this basic message sent in this transaction.
- Action column contains 3dots action:
- “Conversation” option, in which the user can enter to the conversation history page for this recipient starting from this transaction message point, and he can go up (older) and down (newer) in addition to ability to manage the conversation and start chatting with the recipient “with conditions” , the view and functionality of the conversation will be clarified later
- Message Preview: once the user selects/ presses on any recipient, a phone preview screen will be shown to him, filled by the transaction message after variable replacements for this user.
- Options to export the details and export statistics. Export details will be the same as the recipient details grid adding to each recipient (creation date “transaction creation date”, Message content “message body with variable replacement”, list of all statuses available and their dates).

### WhatsApp Scheduled Tab
This tab contains a grid view for all transactions created by the logged in user but their due date is still not satisfied. This tab contains the following columns.
- Transaction ID: Unique identifier for the transaction, auto generated by the system.
- Sender ID: The whatsapp phone number used as sender when this transaction was sent.
- Template name: The name for the selected and used whatsapp template.
- Template language: The language for the selected and used whatsapp template.
- Template type: The type for the selected and used whatsapp template.
- Creation date: The datetime when this transaction has been created/ submitted.
- Scheduled date: The datetime which indicates when this transaction should be processed.
- Total recipient count: Total number of the recipients in all CGs including the manually added recipients.
- Total transaction cost: The total cost for all sent messages to all recipients in the transaction.
- Recipients: Contact groups names, in addition to the added manually recipients.
- Status: (Scheduled, Deleted).
- Actions: 3dots contains:
- “Details” button which opens a transaction detailed page (will be described later).
- “Edit” button which opens the “send whatsapp message” screen with the data that already filled before and he can edit anything in this page
- “Delete” button:
Enabled only if the due date for this scheduled transaction is not satisfied.
A confirmation popup will be shown to the user to confirm the deletion action or no. If the user confirms the delete action, this record will stay viewed in the view but with status Deleted.

#### Scheduled Detailed View Page
Each transaction in the scheduled tab has a details page, accessible by clicking on the “Details” option in the 3-dot action menu. This page provides a comprehensive overview of the scheduled transaction and allows for modifications.
Upon entering the details page for any scheduled WhatsApp transaction, the user will see full details about this transaction, including:
- Transaction ID, Sender ID, used WhatsApp Template name, used WhatsApp Template language, used Template type, Creation date for this transaction, Scheduled date for this transaction, Total recipient count in this transaction, Total transaction cost for this transaction, Recipients, and Transaction Status (Scheduled).
- Statistics will be all zeros and empty since the transaction is not yet processed
- Recipients details grid that contains all recipients as mobile numbers listed in a table one by one followed by the following details per each recipient
- Recipient mobile number.
- Whatsapp message status for this mobile number: the status for this message as per Meta:
- Pending:
- Send Date:empty
- Delivery Date:empty
- Status Date :empty
- Message cost: 0 SAR.
- Action column contains 3dots action:
- “Conversation” option disabled
- In addition, the page will feature:
- Message Preview: A smartphone mockup UI component displaying a real-time message preview, generated by replacing template variables with data values from the first recipient in the first selected contact group.

### WhatsApp Conversation Page
By clicking on the “conversation” option that is located in the whatsapp outbox details page , the following parts should appear:
- Header Information
Displays general information about the conversation.
Displayed Information
- Message Name
- Created Date
- Recipient Number
- Message Information Panel
Displays summary information related to the selected conversation.
Displayed Information
- Sender Number
- Message Type
- Created Date
- Send Date
- Delivery Date
- Read Date
- Conversation Area
Displays the chronological conversation between the sender and the customer.
Supported message types include:
- Text Messages
- Images
- Documents
- Audio Messages
- Videos
- Location Messages
- Contacts
- Interactive Messages
- Template Messages
- Replies
- Emoji Reactions
Business Rules
- Messages shall be displayed in chronological order.
- Sender messages shall appear on right side of the conversation.
- Recipient messages shall appear on the left side.
- Each message shall display its sending time.
- Delivery and read indicators shall be displayed when available..
- Message Actions
users may perform actions on individual messages.
Available actions may include:
- Reply
- View Information ,then the message info will be reflected in the message info panel
- React with Emoji
- Download Attachment (if applicable)
Business Rules
- Reply and react on message is available only while the customer service window is active.
- Conversation Search
Allows users to search within the conversation.
Business Rules
The user may search using:
- Message text
- File name
- Keywords
Search results shall:
- Highlight matching messages.
- Navigate directly to the selected message.
- Customer Service Window
Displays the remaining time available for free-form messaging.
Displayed Information:
- Hours
- Minutes
- Seconds
Business Rules
- The customer service window shall start when the recipient sends a message to the organization.
- The countdown shall begin from 24 hours and decrease continuously.
- Whenever the recipient sends another message before the countdown expires, the customer service window shall be reset to 24 hours, and the countdown shall restart.
- While the customer service window is active, authorized users may send free-form WhatsApp messages to the recipient.
- When the countdown reaches 00:00:00, the customer service window shall be marked as Expired, and free-form messaging shall no longer be permitted.
- After the customer service window expires, the user may only initiate communication by sending an approved WhatsApp template message.
- Sending an approved template message after the customer service window has expired will open the “send whatsapp message” screen with keeping the recipient (destination) and viewing the added variables that may be viewed based on the selected template and by clicking on send the system shall create a new conversation record.
- The new conversation record shall reference the previous conversation record as its Conversation History, allowing users to view all previous conversations with the same recipient.
- Each conversation record shall maintain its own lifecycle, timestamps, statuses, and messages while preserving the complete conversation history across all conversation records for the recipient.
- Message Composer
Allows users to send messages while the customer service window remains active.
Supported content:
- Text
- Attachments
- Emojis
- Voice record
- Templates:
By clicking on its icon the “send whatsapp message” screen will appear:
- The Recipient details must appear and be disabled
- The variables should be viewed based on the selected template name
- The user should fill in the variables

## Voice Tab
Inside this Voice tab there are multiple tabs (Outbox and Scheduled) in addition to the “Send Voice IVR Message” button.

### Send Voice IVR Message button
When an authorized user clicks the “Send Voice IVR Message” button, a screen will. The interface enforces the following configurations:
- Message Details
- Select Voice Sender ID: Represents field represents the source of the voice call message. It is one of the verified phone numbers related to the client SIP account. By default; any Normal User can select any Sender ID attached to the tenant, unless restricted by an overriding permission group.
- Select IVR Voice Template: Users are restricted to selecting a single, pre-approved voice IVR template that is created or shared with the user, the UI enforces a 2-tier selection tree:
- Voice IVR trees category (Static or Dynamic) → Template Name.
- The selected template variables will be viewed under the Variables field to be more clear to user to know the variables then map them
- Select the sending time: The user can select the sending time for that transaction, either send the transaction now (immediately) or schedule it in future (set date and time).
- Retry Logic (Optional): The User can configure up to 3 retry attempts for one or more of the following statuses (no answer, busy, cancel, failed ).
For each attempt, a duration (in minutes) can be specified to define the waiting period before the next retry. This allows for flexible handling of temporary network issues or recipient unavailability.
- Add Recipients:
The user can add recipients using one of the following methods:
- Select Contact Groups
- The user can select one or multiple contact groups as recipients.
- The selected contact groups can be:
- Created by the same user.
- Shared with the user.
- For each selected contact group, the user must:
- Identify the destination column that contains the recipients’ mobile numbers.
- Map the contact group fields/columns with the template variables before selecting another contact group.
- Add Manual Recipients:
- The user can enter direct/manual phone numbers in the recipient field.
- A maximum of 3 manual recipients is allowed.
- For each manually added recipient, the user must:
- Enter values for all related template variables.
- The manually entered template variable values should:
- Be displayed to the user.
- Be editable by the user.
- Variable Schema Mapping: For each contact group added, the interface must render a 1:1 schema mapping grid, forcing the user to map every required variable inside the Voice IVR template to a specific data column header within that contact group sheet.
- Preview: 
The user can see the canvas including the IVR tree and play the IVR voices node by node for the current transaction he is building which contains variable replacements by the values related to the first recipient in the first selected contact group.
Once all the send transaction configurations have been set, and the sending time defined, a confirmation message will be shown to the user, this confirmation message contains:
- A Check box to ask the user if he wants to allow for duplicate recipients or not.
- Estimation for this transaction cost (based on the recipient's destination, expected call time, number of recipients, active contract details, …).
Once the user confirms these points, the transaction will be processed (if the sending time was now), or saved to be processed in future (if the sending time was later). In both cases the balance deduction will be done on sending time for the transactions, which means there is no reservation for balance at the transaction creation time for the future transactions.

#### Send Logic
At the exact time of execution (whether immediately or at the scheduled future time), the backend engine takes over:
- The system does not make any reservation for balance at the transaction creation time, it starts deducting balance at the execution time and once it starts processing the records/patches of that transaction.
- The system must process the manually entered recipients first, then the other contact groups based on their added order in the compose process.
- The system will do variable replacements with the actual data for each recipient right before dispatching the payload to SIPor Voice providers. (this will represent the Send date for each recipient).
- If the user does not allow for duplicate sending, the internal logic will remove the duplicated numbers, keep and process the first one only.
- When it comes to charging; for each record/bulk we do NOT make any reservation from the balance, we start doing the call, deducting the cost from balance in almost realtime (every one second), and once the balance is exhausted; we terminate the call. This is applied in both cases to send a single transaction or bulk, since the bulk from inside is sending one by one.
- Which means before processing a voice call we are checking if there is a balance greater than the cost for one second; we will proceed, otherwise we terminate the transaction.

#### Transaction statuses
- If the system decides to abort the transaction due to insufficient balance right before processing any record; the transaction status will be “Failed”.
- If the system decides to partially process the transaction due to insufficient balance the transaction status will be “Partially processed”.
- If the system successfully processes the whole transaction records, the status will be “Completed”.
- During the process of the transaction its status will be “In Progress” and the total recipient count and total transaction cost columns will be updated during the time.
- During the process of the transaction the user can “Cancel” this transaction, and its status will be “Canceled”. The system will stop processing the next patch and update the records accordingly.
There should be a confirmation message shown to the user about the cancelation action, and indicate if the cancelation action took place while the transaction is still in progress, or the system already finished the whole transaction and processed all recipients in it.
- If the user decided to Delete -from the scheduled tab- the scheduled transaction which their due date has not come yet, the system will ignore this transaction, and its status will be “Deleted”.
- All transactions whose due date has not come yet will be viewed and listed in the scheduled tab, and their status will be “Scheduled” unless they were deleted and mentioned before.
Anytime the system decides to abort the transaction with status “Failed” or change its status to “Partially processed”, details will be added in the transaction detailed page to give the user indication and reason for these statuses.

### Voice Outbox tab
This tab contains a grid view for all transactions sent by the logged in user (the transactions whose execution time is satisfied regardless if they are already processed or are processing now).
This tab contains the following columns:
- Transaction ID: Unique identifier for the transaction, auto generated by the system.
- Sender ID: The Voice phone number used as sender when this transaction was sent.
- IVR name: The name for the selected and used IVR tree.
- IVR type: The type for the selected and used IVR tree.
- Creation date: The datetime when this transaction has been created/ submitted.
- Total recipient count: Total number of the recipients in all CGs including the manually added recipients.
- Total transaction cost: The total cost for all sent messages to all recipients in the transaction.
- Recipients: Contact groups names, in addition to the added manually recipients.
- Status: (In Progress, Canceled, Partially Processed, Failed, Completed)
- Actions: 3dots contains:
- “Details” button which opens a transaction detailed page (will be described later).
- “Cancel” button which cancels and aborts the sending/ processing logic, and stops processing the next patch regardless of the remaining or processed recipients. And update the fields accordingly (status, count, cost, …).
Cancellation Rule: If a user triggers a Cancel command on an In Progress transaction via the 3-dot action menu, the engine terminates processing at the next immediate batch edge.
- Confirmation Dialog: The system must intercept the cancellation request with a confirmation dialog that dynamically displays the thread state. It must clarify:
- The transaction's current processing status.
- Whether the cancellation successfully intercepted the transaction mid-flight (leaving unsent records uncharged).
- Whether the backend completed processing all records before the cancel thread completed execution.
Post-Cancellation System Updates: Upon successful cancellation, the system will:
- Update the transaction's Status to 'Canceled'.
- Adjust the Total Recipient Count to reflect only those recipients for whom messages were successfully sent before the cancellation.
- Recalculate the Total Transaction Cost based solely on these successfully sent messages.
- Exclude recipients whose messages were not processed from both the count and the cost.

#### Outbox Detailed View Page
Each transaction in the Voice outbox tab has a details page, it could be reached by clicking on the “Details” option in the 3dots in the actions column.
Once the user enters the details page for any Voice outbox transaction, he will see a full details about this transaction, including:
- Transaction ID, Sender ID, used IVR tree name, used IVR tree type, Creation date for this transaction, Total recipient count in this transaction, Total transaction cost for this transaction, Recipients, Transaction Status, in addition to the following:
- Some statistics and readings about this transaction.
Suggested Statistics for Voice Outbox Detailed View:
- Answered Rate: Percentage of calls successfully answered by recipients.
- Busy Rate: Percentage of calls that encountered a busy signal.
- No Answer Rate: Percentage of calls that rang but were not answered.
- Failed Rate: Percentage of calls that failed to initiate due to technical errors.
- IVR Completion Rate: Percentage of answered calls where the recipient navigated through the entire IVR tree.
- Average Call Duration: The average length of answered calls.
- Cost Breakdown: A breakdown of costs by IVR template type, recipient destination, or retry attempts.
- Recipients details grid that contains all recipients as mobile numbers listed in a table one by one followed by the following details per each recipient:
- Recipient mobile number.
- Voice message status, Check the mapping of the below statuses with SIP status in this sheet:
- Pending: The call has been queued but not yet submitted to the SIP or Voice provider.
- Sent: The call request has been submitted to the SIP or Voice provider. This marks the submission date.
- Ringing: The call is currently ringing on the recipient's device.
- Live: The call has been answered by the recipient and the IVR interaction is active.
- Unreachable: The recipient's number could not be reached (e.g., out of service, invalid number).
- Initiator drop the call: The Falcon system or the SIP/Voice provider terminated the call before it was answered or completed.
- Canceled: The call was aborted due to a user-initiated cancellation or system intervention.
- Answered: The recipient picked up the call and the IVR started.
- Busy: The recipient's line was busy at the time of the call.
- No Answer: The call rang but was not picked up by the recipient.
- Failed: A technical error occurred preventing the call from being initiated or completed successfully.
- Attempt Tracking: For transactions with retry logic enabled, this grid will display:
- Attempt Number: (1, 2, or 3).
- Attempt Status: The specific status of that particular attempt (failed, canceled ,busy,no answered,unreachable).
- Attempt Timestamp: The exact time the attempt was initiated.
- Duration Between Attempts: The configured wait time before this attempt was triggered.
- Send date: The timestamp of the first attempt.
- Status date: The timestamp of the final status update.
- Message cost: The total cost incurred for all attempts for this recipient.
- Action column contains 3dots action:
- Conversation option that will view the IVR and the interaction from the recipient , in this screen the user can either ‘send whatsapp message”’ and this will open send whatsapp message screen filled with the recipient details or “send IVR voice message” that will view the send screen with the recipient details filled (will be more clear later)
- Options to export the details and export statistics: Export details will be the same as the recipient details grid, including a full audit trail for each recipient (creation date, all attempt statuses, and their respective timestamps).
- “Preview”, in which the user can preview and play the IVR tree with variable replacements and as the user system did it with the recipient, it is a recorded message including when the user closes or hangs the call.

### Voice Scheduled tab
This tab contains a grid view for all transactions created by the logged in user but their due date is still not satisfied. This tab contains the following columns.
- Transaction ID: Unique identifier for the transaction, auto generated by the system.
- Sender ID: The Voice phone number used as sender when this transaction was sent.
- IVR name: The name for the selected and used IVR tree.
- IVR type: The type for the selected and used IVR tree.
- Creation date: The datetime when this transaction has been created/ submitted.
- Scheduled date: The datetime which indicates when this transaction should be processed.
- Total recipient count: Total number of the recipients in all CGs including the manually added recipients.
- Total transaction cost: The total cost for all sent messages to all recipients in the transaction.
- Recipients: Contact groups names, in addition to the added manually recipients.
- Status: (Scheduled, Deleted).
- Actions: 3dots contains:
- “Details” button which opens the Scheduled Detailed View Page (Voice).
- “Edit” button which opens the “send voice IVR message” the details will open the “send IVR screen” with the already filled details and the user can edit anything in this screen
- “Delete” button:
Enabled only if the due date for this scheduled transaction is not satisfied.
A confirmation popup will be shown to the user to confirm the deletion action. If confirmed, the record remains in the view with the status 'Deleted'.

#### Scheduled Detailed View Page (Voice)
This page provides a comprehensive overview and management interface for a pending Voice transaction.
View Mode:
- Transaction details: Displays Transaction ID, Sender ID, IVR Template Name, Creation Date, Scheduled Date, Total Recipient Count, and Estimated Cost.
- Statistics will be all empty since the transaction is not yet processed
- Recipients details grid that contains all recipients as mobile numbers listed in a table one by one followed by the following details per each recipient
- Recipient mobile number.
- Whatsapp message status for this mobile number: the status for this message will be
- Pending:
- Attempts :will be 0.
- Status Date :empty
- Message cost: 0 SAR.
- Duration
- Action column contains 3dots action:
- “Conversation” option disabled
- In addition, the page will feature:
The IVR canvas showing the IVR tree for this transaction.

## API
Our BSA should provide all needed APIs that allow the client (Normal user & in future only system user) to use all app functionalities as they are in the UI interface in order to compose and send transactions using the API for system-to-system integration.
Using the BSA APIs should give the user similar functionality of the web interface including:
- API to send transaction that contains: (BSA API)
- Authentication and user authorization for the user who calls this API.
- Ability to specify the commchannel, sending method (Whatsapp or Voice).
- Ability to specify the SenderName/ SenderID (whatsapp phone number or voice phone number)
- Ability to specify the Message body (Whatsapp template ID or Voice IVR ID)
- The ID could be our autogenerated ID, or the Reference ID linked to that template while its creation.
- Ability to specify the recipients:
- Ability to select ONLY one contact group per request
- To specify the Destination “recipient” in this contact group, the user should specify the column name which contains the mobile numbers as a value for a key called “Destination/Recipient”.
- The user should give us the (Key = variable name exactly as it is in the template/IVR) & the (Value = column name in the selected contact group).
- Ability to add a list of recipients “phone numbers” manually.
- The user should give us the (Key = variable name exactly as it is in the template/IVR) & the (Value = the value of that variable) per recipient for each added recipient.
- Ability to specify if duplication behaviour:
- Allow the duplication or not.
- Ability to specify the send date:
- If not given, it means now.
- If given, should be greater than now and datetime format.
Detailed and meaningful errors if there is anything not correct or rejected for this request
- API to retrieve the Templates: (Skeleton API)
- Authentication and authorization for the user who calls this API.
- Specify what commchannels that the user want to retrieve the template for (whatsapp or Voice)
- Return list of templates that are eligible to be used by this user (his own created templates or shared with him) & should be Approved.
- Each template json should contain full details about each template:
- Template type: for whatsapp templates (Authentication, Utility, Marketing), for Voice (Dynamic, Static).
- Template Name: the template name for Whatsapp or Voice.
- Language (if exist): only for whatsapp.
- Template ID: autogenerated ID by the system.
- Reference ID: the refID added by the user during the creation.
- Variable list in each template.
- API to retrieve the Contact groups: (Skeleton API)
- Authentication and user authorization for the user who calls this API.
- Return a list of contact groups that are eligible to be used by this user (his own created contact groups or shared with him) & should be active “not deleted”.
- Each contact group json should contain full details about each contact group:
- CG name: the CG name as entered during the creation process.
- CG ID: auto generated ID by the system.
- Reference ID: the refID added by the user during the creation.
- Columns name in each template, their final shape.
- API to retrieve the SenderName/ SenderID: (Skeleton API)
- Authentication and user authorization for the user who calls this API.
- Return a list of SenderNames/ SenderIDs in json format that include:
- Commchannel
- List of Sendernames/ SenderIDs under that commchannel.
In near future, we will support the following:
- App configuration to decide who the user wants to manage the statuses and call back.
- APIs for return/inquiring about the transaction status per transaction and per recipient inside the transaction.
- APIs for balance inquiry, this is API for the Skeleton not for the app
- Allow/now allow partial processing in case of insufficient balance.
Pending:
- Report page.
- Other Roles behaviour and screens.
- Detailed subpages under the command channel.
- Detailed subpages under the Marketplace application.
- The conversation menu item.
- API documentation and requirements.
- Considering the edge cases below.
Edge Cases:
- Zero Balance at Start: If a scheduled campaign begins, and the wallet is already at zero, the entire transaction is immediately marked as "Failed - Insufficient Balance" and no messages are sent.
- Deleted Assets Before Scheduled Send: If a user schedules a send for next week, but another user deletes the selected Contact Group or the Template gets revoked by Meta in the meantime, the system will instantly fail the transaction at execution time and log the reason (e.g., "Asset Missing").
- Third-Party Rejections: If the system successfully deducts the wallet and sends the message, but WhatsApp later rejects it (e.g., number blocked), this application does not handle the refund. It simply marks the status as "Failed." The platform's core Wallet Engine will automatically process the refund based on the overarching contract rules.