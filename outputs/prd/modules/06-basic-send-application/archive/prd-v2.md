
# Falcon Basic Send Application (BSA)
This document outlines the detailed specifications for the Falcon Basic Send Application (BSA), a centralized communication platform designed to manage and automate customer interactions across multiple channels, specifically WhatsApp and Voice IVR. It covers core functionalities, architectural constraints, workflow processes, and reporting mechanisms.

## 1. Basic Send Application (WhatsApp & Voice)
The Basic Send Application (BSA) is a foundational, lightweight utility within the Falcon platform enabling users to dispatch WhatsApp messages and Voice (IVR) broadcasts to targeted recipient lists via the web UI or system-to-system APIs.

## 2. Core System Architecture & Operational Constraints

### 2.1. Default Costs & Permissions
Default Setup: The BSA is visible by default to any account onboarded onto the Falcon platform. It carries a One-Time Payment price type configured at 0 SAR by default. These base pricing values can be overridden exclusively by a user with the Falcon Usertype role.
Activation Rules: Only the Account Owner and Falcon Usertype roles are allowed to purchase and activate applications from the marketplace.
Once activated, the BSA is immediately available to all Normal Users under that account across all organizational levels, unless an explicit Permission Group is assigned to a specific user to override this default role behavior.

### 2.2. Channel Isolation & Failover Constraints
Zero Channel Cross-Over: There is no failover capability between communication channels in application. A transaction is strictly isolated; a user must explicitly configure a transaction to send either a WhatsApp message or a Voice IVR broadcast.
If a CommChannel under an account is not enabled, or becomes disabled for any reason (manually disabled, grace period finished, …) :
•The SEND button within the respective BSA tab is disabled.
•The user is restricted to viewing the Outbox and Scheduled sub-tabs and cannot initiate new transactions.
•If a previously scheduled transaction reaches its due date while the communication channel is disabled, the transaction execution thread will be immediately terminated by the backend, its state will be updated to “Failed”, and the system log will write the specific error code “CommChannel is not active/disabled”

### 2.3. Financial & Balance Strategy
The application does not execute any financial balance reservations at the time of transaction creation or future scheduling. Balance deduction is evaluated and charged strictly at the exact time of execution.
Using the application to send transactions does not care about the Wallet and Balance configurations, it will follow the balance strategy used and comply with it.
If an internal platform-side failure occurs after balance deduction has succeeded but before the API payload is handed off to the external service provider (Meta or the SIP/Voice Gateway), the system must execute an immediate programmatic rollback refund of the exact charged amount to the source wallet.
Insufficient Balance Abort: The application has no balance failover facility. If the finalized destination wallet or bucket lacks sufficient balance to fulfill the processing record/batch, the transaction or remaining batch chunk is immediately aborted.

## 3. BSA Features, Functionalities, and Pages
Once the normal user selects the activated BSA from the marketplace; the application landing page will be the detailed page for the Whatsapp tab and there is another almost similar page for the Voice tab.

### 3.1. Whatsapp Tab
Inside this Whatsapp tab there are multiple tabs (Outbox, and Scheduled) in addition to the “Send Whatsapp Message” button.

#### A. "Send WhatsApp Message" Workflow & Interface
When an authorized user clicks the Send WhatsApp Message button, a dedicated composition wizard opens. The interface enforces the following configurations:
- Select WhatsApp Sender ID: Represents the verified phone number linked to the client's Meta Business account. By default, a Normal User can select any Sender ID attached to the tenant, unless restricted by an overriding Permission Group.
- Select WhatsApp Template: Users are restricted to selecting a single, pre-approved template that they created or that was shared within their tenant. The UI must enforce a 3-tier selection hierarchy:
- Category (service type (Marketing,Utility and Authentication)) → Language → Template Name
- Add Recipients:
- Manual Input: Users can input up to a maximum of 3 manual phone numbers. The UI must dynamically generate inline text fields for every variable dictated by the chosen template skeleton. These manually entered variable values must remain fully editable by the composer before dispatch.
- Contact Groups (CG): Users can select multiple active contact groups. For each group selected, the user must explicitly define the target column containing the phone numbers (Recipient Mobile Number).
- Variable Schema Mapping: For each contact group added, the interface must render a 1:1 schema mapping grid, forcing the user to map every required variable inside the WhatsApp template to a specific data column header within that contact group sheet.
- Real-Time Message Preview: The screen must render a smartphone mockup UI component showing a real-time message preview. This preview is generated by taking the template text and replacing its variables with the data values belonging to the first recipient inside the first selected contact group.
- Select the sending time: The user can select the sending time for that transaction, either send the transaction now (immediately) or schedule it in future (set date and time).
- Before final submission, the system displays a confirmation summary overlay presenting:
- A duplicate handling checkbox: Allow duplicate recipients.
- A transaction cost estimation calculated programmatically based on target recipient destinations, template category type, total recipient count, and active contract details
Once the user confirms these points, the transaction will be processed (if the sending time was now), or saved to be processed in future (if the sending time was later). In both cases the balance deduction will be done on sending time for the transactions, which means there is no reservation for balance at the transaction creation time for the future transactions.

#### B. Send Logic
Upon immediate execution or when a scheduled date matures, the backend processing engine takes over using the following sequential rules:
- The system does not make any reservation for balance at the transaction creation time, it starts deducting balance at the execution time and once it starts processing the records/patches of that transaction.
- The system should make sure that there is enough balance for the current record/batch under processing. We will deduct the balance as the first step of processing the record/batch, and then refund in case of any internal failures preventing this record/batch from being processed successfully. This will be applied regardless of the balance strategy (User Based or NodeBased, Single Wallet or Multiple Wallets).
- The system must process the manually entered recipients first, then the other contact groups based on their added order in the compose process.
- The system will do variable replacements with the actual data for each recipient right before dispatching the payload to Meta or Voice providers. (this will represent the Send date for each recipient).
- If the user does not allow for duplicate sending, the internal logic will remove the duplicated numbers, keep and process the first one only.

#### C. WhatsApp Data Grids & Interaction Logs

##### 1. WhatsApp Outbox Tab
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
- “Details” button which opens a transaction detailed page (will be described later).
- “Cancel” button which cancels and aborts the sending/ processing logic, and stops processing the next batch regardless of the remaining or processed recipients. And update the fields accordingly (status, count, cost, …).
Cancellation Rule: If a user triggers a Cancel command on an In Progress transaction via the 3-dot action menu, the engine terminates processing at the next immediate batch edge. The system must intercept the cancellation request with a confirmation dialog that dynamically displays the thread state: it must clarify the transaction's current processing status and whether the cancellation successfully intercepted the transaction mid-flight (leaving unsent records uncharged) or if the backend completed processing all records before the cancel thread completed execution. Upon successful cancellation, the system will update the transaction's Status to 'Canceled'. The Total recipient count will be adjusted to reflect only those recipients for whom messages were successfully sent before the cancellation. Correspondingly, the Total transaction cost will be recalculated based solely on these successfully sent messages. Recipients whose messages were not processed due to the cancellation will not be included in the count or cost.

##### 2. WhatsApp Scheduled Tab
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
- “Details” button which opens a transaction detailed page (will be described later). And it contains view mode and edit mode.
- “Edit” button which opens a transaction detailed page and allows the user to edit all things inside it:
- Whatsapp template.
- Recipients
- Send datetime.
- Sender ID.
- “Delete” button:
Enabled only if the due date for this scheduled transaction is not satisfied.
A confirmation popup will be shown to the user to confirm the deletion action or no. If the user confirms the delete action, this record will stay viewed in the view but with status Deleted.

##### 3. Outbox Detailed View Page
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
- Cost Breakdown: A breakdown of costs by template type or recipient destination.
- Recipients details grid that contains all recipients as mobile numbers listed in a table one by one followed by the following details per each recipient:
- Recipient mobile number.
- Whatsapp message status for this mobile number: the status for this message as per Meta:
- Pending: we did not submit it yet to Meta, still in our system.
- Sent: we have replaced the variables, submitted it to Meta for this recipient, and this is the submission date (confirm with Noor if Meta returns this date or its our submission date).
- Delivered: Meta returns the status delivered with the delivery date once they hand the message to the recipient.
- Read: That means the recipient has read the text message, and when he reads it, there will be a read date.
- Played: that means the recipient has played the voice note message, and when he played it, there will be a played date.
- Seen: that means the recipient has seen the media message, and there will be a seen date.
- Send date.
- Delivery date.
- Status date.
- Message cost: contains the cost for the basic message sent in this transaction, it does not include any costs for replies later.
- Has a reply indication: to indicate if there is any reply message from the recipient to this basic message sent in this transaction.
- Action column contains 3dots action:
- “Conversation” option, in which the user can enter to the conversation history page for this recipient starting from this transaction message point, and he can go up (older) and down (newer) in addition to ability to manage the conversation and start chatting with the recipient “with conditions”. (will be discussed later).
- Message Preview: once the user selects/ presses on any recipient, a phone preview screen will be shown to him, filled by the transaction message after variable replacements for this user.
- Options to export the details and export statistics. Export details will be the same as the recipient details grid adding to each recipient (creation date “transaction creation date”, Message content “message body with variable replacement”, list of all statuses available and their dates).

##### 4. Scheduled Detailed View Page
Each transaction in the scheduled tab has a details page, accessible by clicking on the “Details” option in the 3-dot action menu. This page provides a comprehensive overview of the scheduled transaction and allows for modifications.
Upon entering the details page for any scheduled WhatsApp transaction, the user will see full details about this transaction, including:
- Transaction ID, Sender ID, used WhatsApp Template name, used WhatsApp Template language, used Template type, Creation date for this transaction, Scheduled date for this transaction, Total recipient count in this transaction, Total transaction cost for this transaction, Recipients, and Transaction Status (Scheduled).
- In addition, the page will feature:
- Message Preview: A smartphone mockup UI component displaying a real-time message preview, generated by replacing template variables with data values from the first recipient in the first selected contact group.
- Edit Mode: An option to switch to an edit mode, allowing the user to modify the following aspects of the scheduled transaction:
- WhatsApp template.
- Recipients (add, remove, or modify contact groups and manual inputs).
- Send datetime.
- Sender ID.

##### 5. WhatsApp Conversation Page
This page serves as a centralized hub for all WhatsApp conversations, providing a comprehensive overview before diving into individual message details. It is an independent submenu item under the communication channel (WhatsApp) and aggregates all interactions related to WhatsApp, regardless of the sender ID, application, or client user involved.
Overview Screen Structure:
Upon navigating to the WhatsApp Conversation Page, users will be presented with a grid view or list of active conversations. Each entry in this overview will typically display:
- Recipient Mobile Number: The primary identifier for the conversation.
- Last Message Timestamp: The date and time of the most recent message exchanged in the conversation.
- Last Message Snippet: A short preview of the last message content.
- Sender ID Used: The WhatsApp phone number through which the last message was sent or received.
- Application Name: The Falcon application from which the conversation originated or was last interacted with.
- Conversation Status: (e.g., Open, Closed, Awaiting Reply, Resolved).
- Unread Message Count: An indicator for new, unread messages in the conversation.
- Actions: (e.g., View Details, Assign to User, Mark as Read).
Filtering and Search Capabilities:
The overview screen will include robust filtering and search functionalities to help users quickly locate specific conversations:
- Search Bar: To search by recipient mobile number, sender ID, or keywords from message content.
- Filters: Options to filter conversations by:
- Sender ID: Select specific WhatsApp sender numbers.
- Application: Filter by the Falcon application that initiated the conversation.
- User: View conversations handled by specific client users.
- Status: Filter by conversation status (e.g., Open, Closed).
- Date Range: Filter conversations within a specific time period.
Detailed Conversation View (upon selecting a record):
Once a specific conversation record is selected from the overview, the user will enter a detailed view, which is an application-agnostic screen that displays a unified communication timeline with a specific customer phone number across all Sender IDs, applications, and platform users
- The left section contains the Message info:
- Sender ID, message type, message status details with dates details for the selected message in the conversation.
- The right  section contains the Conversation view:
- Messages from the client users who send this message in the right side of the conversation, and any reply from the recipient in the left side.
- Full support for all Whatsapp messaging features related to messaging.
- Send message field:
- A place in which the user can send whatsapp messages to that recipient, considering the 24-hour window and whatsapp messaging limitations and conditions.

## 3. IVR Voice Module Functional Specifications

#### A. "Send IVR Voice Message" Workflow & Interface
The architecture of the Voice (IVR) broadcast module mirrors the functional flow of the WhatsApp module, substituting text specifications with interactive telephony voice parameters:
- Select Voice Sendername (Sender ID): Displays outbound phone numbers or SIP trunks assigned to the client account. Users have access to all Sender IDs unless restricted by an overriding Permission Group.
- Select IVR Voice Template: Users select an approved IVR tree asset. The UI enforces a 2-tier selection tree:
The user has to select the category of  IVR trees first (Static or Dynamic), then select the IVR name
- Recipient Schema Configuration:
- Manual Inputs:The user can select multiple contact groups as recipients for this message, or by entering direct/ manual phone numbers in the recipient field (max 3 manual recipients).
- Each time the user adds a recipient manually, he has to fill the values for the Dynamic IVR variables related to that recipient.
- The values for the Dynamic IVR variables which are added manually for the entered recipients, should be viewed and can be edited by the user.
- Contact Groups & Mapping: The selected contact groups could be any contact group created by that user, or shared with him.
- Each time the user selects a contact group, he has to identify the destination column in that sheet, the column which contains the Recipients Mobile Number.
- Each time the user selects a contact group, he has to make a mapping between that contact group column (field) and the Dynamic IVR variables. Then he can select the other contact group.
- Audio Node Preview: The user can see a message preview and play the IVR voices node by node for the current transaction he is building which contains variable replacements by the values related to the first recipient in the first selected contact group.
- Retry Logic (Optional): Users can configure up to 3 retry attempts for the selected by user statuses( no answer,busy,cancel, failed ) voice messages. For each attempt, a duration (in minutes) can be specified to define the waiting period before the next retry. This allows for flexible handling of temporary network issues or recipient unavailability.
Once all the send transaction configurations have been set, and the sending time defined, a confirmation message will be shown to the user, this confirmation message contains:
- A Check box to ask the user if he wants to allow for duplicate recipients or not.
- Estimation for this transaction cost (based on the recipient's destination, expected call time, number of recipients, active contract details, …).
Once the user confirms these points, the transaction will be processed (if the sending time was now), or saved to be processed in future (if the sending time was later). In both cases the balance deduction will be done on sending time for the transactions, which means there is no reservation for balance at the transaction creation time for the future transactions.

#### B. Send Logic
At the exact time of execution (whether immediately or at the scheduled future time), the backend engine takes over:
- The system does not make any reservation for balance at the transaction creation time, it starts deducting balance at the execution time and once it starts processing the records/patches of that transaction.
- The system should make sure that there is enough balance for the current record/batch under processing. We will deduct the balance as the first step of processing the record/batch, and then refund in case of any internal failures preventing this record/batch from being processed successfully. This will be applied regardless of the balance strategy (User Based or NodeBased, Single Wallet or Multiple Wallets).
- The system must process the manually entered recipients first, then the other contact groups based on their added order in the compose process.
- The system will do variable replacements with the actual data for each recipient right before dispatching the payload to SIP or Voice providers. (this will represent the Send date for each recipient).
- If the user does not allow for duplicate sending, the internal logic will remove the duplicated numbers, keep and process the first one only.

#### C. Transaction statuses
- If the system decides to abort the transaction due to insufficient balance right before processing any record; the transaction status will be “Failed”.
- If the system decides to partially process the transaction due to insufficient balance the transaction status will be “Partially processed”.
- If the system successfully processes the whole transaction records, the status will be “Completed”.
- During the process of the transaction its status will be “In Progress” and the total recipient count and total transaction cost columns will be updated during the time.
- During the process of the transaction the user can “Cancel” this transaction, and its status will be “Canceled”. The system will stop processing the next patch and update the records accordingly.
There should be a confirmation message shown to the user about the cancelation action, and indicate if the cancelation action took place while the transaction is still in progress, or the system already finished the whole transaction and processed all recipients in it.
- If the user decided to Delete -from the scheduled tab- the scheduled transaction which their due date has not come yet, the system will ignore this transaction, and its status will be “Deleted”.
- All transactions whose due date has not come yet will be viewed and listed in the scheduled tab, and their status will be “Scheduled” unless they were deleted and mentioned before.
Anytime the system decides to abort the transaction with status “Failed” or change its status to “Partially processed”, details will be added in the transaction detailed page to give the user indication and reason for these statuses.

#### D. Voice Outbox tab
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

##### Voice Details page for outbox records
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
- “Preview” option, in which the user can preview and play the IVR tree with variable replacements and as the user system did it with the recipient, it is a recorded message including when the user closes or hangs the call.
- Options to export the details and export statistics: Export details will be the same as the recipient details grid, including a full audit trail for each recipient (creation date, all attempt statuses, and their respective timestamps).

#### E. Voice Scheduled tab
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
- “Edit” button which opens the detailed page in edit mode.
- “Delete” button:
Enabled only if the due date for this scheduled transaction is not satisfied.
A confirmation popup will be shown to the user to confirm the deletion action. If confirmed, the record remains in the view with the status 'Deleted'.

##### Scheduled Detailed View Page (Voice)
This page provides a comprehensive overview and management interface for a pending Voice transaction.
View Mode:
- Transaction Metadata: Displays Transaction ID, Sender ID, IVR Template Name, Creation Date, Scheduled Date, Total Recipient Count, and Estimated Cost.
- IVR Tree Preview: A visual representation of the IVR flow, showing the sequence of nodes and variable placeholders.
- Recipient Summary: Lists the selected contact groups and any manually added recipients.
- Edit Mode:
- Modify IVR Template: Allows the user to switch to a different approved IVR tree.
- Recipient Management: Enables adding or removing contact groups and manual recipients, including re-mapping variables if necessary.
- Reschedule: Allows updating the planned execution date and time.
- Sender ID: Option to change the outgoing voice number.
- Retry Logic: Update the number of retry attempts (up to 3) and the durations between them.

#### F. Voice Preview
Each record in the outbox recipient details grid contains a preview option, this preview option allows the user to hear and play the recoded voice call between the application/system and the recipient as it was done, including:
- Showing the original IVR tree skeleton (voices and variables)
- Highlight the nodes which are actually played or selected by the recipient from this IVR, and allow the user to play/hear them, with variable replacement.

## API
Our BSA should provide the APIs that allow the client (Normal user) to use and send transactions using the API for system-to-system integration. Using the BSA APIs should give the user similar functionality of the web interface including:
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