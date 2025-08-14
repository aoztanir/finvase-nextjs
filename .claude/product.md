# Finvase - Investment Banking AI Automation Platform.

We are building an end-to-end AI-powered platform that will help investors and banks automate their investment banking processes. It harnesses agents to automate the entire process and replacing the majority of analysts and the need for human interactions.

# App Features

## Landing Page (explains the app in a modern professional way with cool animations and graphics. Modern AI agent landing page kind of app.)

# Routes and Parts of the actual app

## Investor's dashboard /dashboard/investor

- The investor dashboard is where potential investors for the clients taht IB banks work with can view the potential deals and opportunities for them.

The sidebar should have a list of all the potential deals and the title of each nav component should be the company name for each of these.

### /dashboard/investor/deals/[deal-id]. (When they click on a deal, they should be taken to a page under the route)

On the left half of this page it shows: All the company deal information: the teaser, the pitch deck, financial models, and the key metrics. On the right half of this page there should be a chat where they can communicate with an AI agent to ask more questions about the deal and get more insights or answers into the company. The agent will provide the bank's contact and the clients contact in the case that it cannot answer a question.

## Client's dashboard /dashboard/client

- For the client Dashboard, they are able to view three things: the deals they have worked on in the past and what bank they have used for that deal. When they click on the deal they should view two things under that: the home route and the data room route. The sidebar should have a list of all the deals they have worked on and then shift to display the home route and data route when they click on a specific deal, there should be a switch deal select at the bottom of the sidebar.

### /dashboard/client/deals/[deal_id] (This is the home route for the client dashboard for the specific deal under the id "deal_id". It should be just the base route but will be in the (home) folder to indicate to devs that it is the base "home" route)

- The home route shows the client what's going on with their deal clearly and concisely. It shows the deal's progress and the agent's progress on the left half. (however it is not to be mentioned that it is an AI agent, it shows the bank's progress as "example bank's progress"). This will be like a timleine with check marks when someothing is completeted and then a button saying "action required" if they need to do something. When they click on the action required button, a drawer on the right opens up (like a modal) and asks them to complete the task with an AI chat UI. For example if they need to upload an excel file for last years financial statements they missed, when they press the button it will open up a drawer with an upload file AI chat UI, where after uploading the file, the AI can confirm its success/failure. On the right-half will be the client AI chat UI where the client can ask questions about the deal and specify more about their needs. The AI will provide the answers and insights to the client, and also log their questions and answers for the bank to look at and review and the agent to work through their requests.

### /dashboards/client/deals/[deal_id]/data-room (This is the data room route for the client dashboard for the specific deal under the id "deal_id".)

- The data room route shows the client the data they have uploaded and gives them an opportunity to view it and download it from the data room. It shows what they've uploaded in folder format and also prompts them to upload more files that are required in a files/folders required card. I'll let you design the best UI for this to be simplistic but beautiful for the client to use.

## Bank's dashboard /dashboard/bank

- The bank dashboard is where the banks can view the deals they have worked on and the clients they have worked with this is the first base route that they see. They can create a new deal and then view all the deals they have worked on in cards format (i'll let you design the best UI for this to be simplistic but beautiful for the bank to use). When they click on a deal they will be routed to /dashboard/bank/deal/[deal_id].

### /dashboard/bank/deals/[deal_id] (This is the (home) route for the bank dashboard for the specific deal under the id "deal_id". It will be under (home) for devs to understand and for readability and DX)

- The home route shows the bank what's going on with their deal clearly and concisely. It is kind of like the left half of the clients home route, however it shows everything in a timeline and is very detailed about what the agent is doing. Employees can also click on the timeline to expand the details of the task that is occurring and click see more details to be routed to the specific task that is occurring under the /dashboard/bank/deal/[deal_id]/agent-tasks/[task_id] route.

### /dashboard/bank/deals/[deal_id]/agent-tasks/[task_id] (This is the agent tasks route for the bank dashboard for the specific deal under the id "deal_id" and the specific task under the id "task_id".)

- This route without the id will show the agent progress on the left half very similar to the client's home route and on the right half will be the AI chat UI where the bank can ask questions about the deal and specify more about their needs. The AI will provide the answers and insights to the bank, and also log their questions and answers for the bank to look at and review and the agent to work through their requests. Under the [task_id] route, the agent will be able to see the specific task that is occurring and the progress of the task, and any other details that are relevant to that specific task.

### /dashboard/bank/deals/[deal_id]/data-room (This is the data room route for the bank dashboard for the specific deal under the id "deal_id".)

- The data room route gives the banks an opportunity to upload data for the client if the client does not want to handle it or if they haven't yet. It is basically the clients view but the target language should be for the bank's client. Make sure it makes sense for the bank to use. Once again use the same kind of UI that you designed for the clients data room route.

### /dashboard/bank/deals/[deal_id]/cim-management (This is the cim management route for the bank dashboard for the specific deal under the id "deal_id".)

- This route gives banks an opportunity to see the CIM (Confidential Investment Materials) that the agent generated or to generate new ones that they want. These are documents like the teaser, pitch decks, financial models, or market research reports. They can also upload new CIM's or delete old ones. We want to give banks an option to use this without the rest of the app (except for data room) to just help their analysts generate CIM's effectively and efficiently. This is arguably the most important part of the app and should be the most complex part of the app.

Left half of the CIM management route: This is a chat UI with an input box that allows for files, folders, or basic text input. It should give banks an option to upload a powerpoint, excel model, financial model, etc... or any other type of CIM to be edited or to have the AI generate one from scratch. Their should be a tab kind of UI at the top of the input that allows them to change between different types of CIM's. This doesn't need to be just one input box, it should be a card with different controls in the UI that the bank can use to alter and change the CIM they are generating or editing. Once they click start, or the submit button or icon, the AI should generate the CIM in a sheet on the right side of the screen and the bank employee should be able to see the progress of the AI as it goes along generating this type of CIM. in the sheet, this new generated CIM should be saved to the right half of the screen. In additoin in the sheet at the bottom their should be a similar type of chat to the left half of the screen where they can alter and keep changing the CIM they generated. ALL VERSION HISTORY SHOULD BE SAVED and accessible in the sheet.

The right half of the CIM management route: This is a list of all the Existing materials and CIM's that the bank has generated or uploaded (only CIM's not data-room data, these are like the bank's deliverables). They can click on a specific CIM to view it and edit it in a sheet/drawer kind of UI. I will give you the liberty to design this UI however you want, it should look beautiful and be easy to use with a good UX and data display that is easy to read and understand. It should show banks the basic data they need to know about the CIM they are viewing and editing (like when title, created, who created it, when it was last updated, and more etc...). I will let you judge what is important to show and what is not.
